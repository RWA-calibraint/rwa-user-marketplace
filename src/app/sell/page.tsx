'use client';

import { Button, Form, Steps, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Descendant } from 'slate';
import { useActiveAccount } from 'thirdweb/react';

import { isKycVerified } from '@/helpers/services/kyc-verification';
import { useUserListener } from '@/hooks/useUserListener';
import { EditAssetDetails, EditAssetDocument, EditAssetLocation } from '@components/EditAsset';
import { getMimeType } from '@components/EditAsset/constants';
import { UploadDocInterface } from '@components/EditAsset/interface';
import ConnectStripeModal from '@components/Modal/connect-stripe';
import { STATUS_TYPE } from '@helpers/constants/asset-status';
import { SUCCESS_MESSAGES } from '@helpers/constants/success.message';
import { useToast } from '@helpers/notifications/toast.notification';
import { clearFormData } from '@helpers/services/clear-formdata';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { useGetAssetCategoriesQuery, useGetAssetQuery, useGetAssetDraftQuery } from '@redux/apis/asset.api';
import { useCreateAssetMutation, useUpdateAssetMutation, useAssetsDraftMutation } from '@redux/apis/create-asset.api';
import { UpdatedDocsList } from '@redux/apis/interface';
import { useCreateStripeAccountMutation, useLazyGetStripeLoginLinkQuery } from '@redux/apis/payment.api';

import { documentType } from './sell.interface';

const formData = new FormData();
const assetsDraftFormData = new FormData();

const AssetDetailsForm = () => {
  const searchParams = useSearchParams();
  const assetId = searchParams.get('assetId');
  const type = searchParams.get('type');
  const router = useRouter();
  const user = useUserListener(true);
  const { showSuccessToast, showErrorToast } = useToast();

  const { data: assetDetail } = useGetAssetQuery(String(assetId), { refetchOnMountOrArgChange: true });
  const [createStripeAccount] = useCreateStripeAccountMutation();

  const [form] = Form.useForm();
  const [currentForm, setCurrentForm] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);
  const [hasFormUpdated, setHasFormUpdated] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [docList, setdocList] = useState<Record<string, UploadDocInterface[]>>({});

  const [address, setAddress] = useState<string>('');

  const [formTitle, setFormTitle] = useState<string>('Asset Details');

  const [isStripeModalOpen, setIsStripeModalOpen] = useState<boolean>(false);
  const [stripeOnboardStatus, setStripeOnboardStatus] = useState<{ isAccountOnboarded: boolean; url: string } | null>(
    null,
  );

  const [createAsset, { isLoading: createLoading }] = useCreateAssetMutation();
  const [updateAsset, { isLoading: updateLoading }] = useUpdateAssetMutation();
  const [assetsDraft, { isLoading: assetsDraftLoading }] = useAssetsDraftMutation();

  const { data: categories, isFetching } = useGetAssetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: draftedAsset } = useGetAssetDraftQuery(undefined, { refetchOnMountOrArgChange: true });
  const [getStripeLoginLink] = useLazyGetStripeLoginLinkQuery();

  const categoryOptions = useMemo(() => {
    if (!isFetching && categories?.response?.length)
      return categories.response.map(({ category, _id }) => ({ label: category, key: _id, value: category }));

    return [];
  }, [categories, isFetching]);

  const activeAccount = useActiveAccount();

  const constructImages = useCallback(
    async (mediaUrls: string[]) => {
      try {
        const formattedFiles = await Promise.allSettled(
          mediaUrls.map(async (url, index) => {
            try {
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Cache-Control': 'no-cache',
                },
              });

              if (!response.ok) {
                console.error(`Failed to fetch media ${index}:`, response.status);

                return null;
              }

              const blob = await response.blob();
              const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
              const isVideo =
                videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) || blob.type.startsWith('video/');

              const fileName = isVideo
                ? `video_${index}.${url.split('.').pop()}`
                : `image_${index}.${url.split('.').pop()}`;

              const file = new File([blob], fileName, { type: blob.type }) as RcFile;

              file.uid = String(Date.now() + index);
              const previewUrl = URL.createObjectURL(blob);

              const uploadFile: UploadFile = {
                uid: file.uid,
                name: file.name,
                status: 'done',
                url,
                thumbUrl: isVideo ? '/Logo.svg' : url,
                preview: previewUrl,
                originFileObj: file,
                type: blob.type,
              };

              if (isVideo) {
                return {
                  ...uploadFile,
                  isVideo: true,
                };
              }

              return uploadFile;
            } catch (error) {
              throw error;

              return null;
            }
          }),
        );

        const validFiles = formattedFiles
          .filter((result) => result.status === 'fulfilled' && result.value !== null)
          .map((result) => (result as PromiseFulfilledResult<UploadFile>).value);

        if (validFiles.length === 0) {
          return;
        }

        setFileList(validFiles);
        // const currentFormImages = form.getFieldValue('images') || [];

        form.setFieldsValue({
          images: validFiles,
        });
      } catch (error) {
        showErrorToast(error, getErrorMessage(error));
      }
    },
    [form, setFileList, showErrorToast],
  );

  const constructDocumentList = (documents: documentType[]) => {
    const groupedDocuments = documents.reduce(
      (acc: Record<string, UploadDocInterface[]>, doc: documentType, index: number) => {
        if (!acc[doc.type]) {
          acc[doc.type] = [];
        }
        const constructedData = {
          name: doc.documentName,
          type: getMimeType(doc.documentName),
          url: doc.documentUrl,
          uid: `uid_${index}`,
          uploadedS3Url: doc.documentUrl,
          isLoading: false,
          statusExternal: doc.status,
        };

        acc[doc.type].push(constructedData);

        return acc;
      },
      {} as Record<string, UploadDocInterface[]>,
    );

    setdocList(groupedDocuments);
  };

  useEffect(() => {
    if (assetDetail?.response) {
      setDescription(JSON.parse(assetDetail.response.description));
      setCategory(assetDetail?.response?.category?._id);
      setAddress(assetDetail.response.address);
      form.setFieldsValue({
        name: assetDetail.response.name ?? '',
        description: assetDetail.response.description ? JSON.parse(assetDetail.response.description) : '',
        price: assetDetail.response.price ?? '',
        category: assetDetail.response.category.category,
        country: assetDetail.response.country ?? '',
        state: assetDetail.response.state ?? '',
        address: assetDetail.response.address ?? '',
        postalCode: assetDetail.response.pincode ?? '',
        tokens: assetDetail.response.tokens ?? 10,
        city: assetDetail.response?.city ?? '',
      });

      if (assetDetail.response.images && assetDetail.response.images.length > 0) {
        constructImages(assetDetail.response.images);
      }

      if (assetDetail.response.documents && assetDetail.response.documents.length > 0) {
        constructDocumentList(assetDetail.response.documents);
      }
    }

    if (currentForm === 1) {
      setFormTitle('Asset Details');
    } else if (currentForm === 2) {
      setFormTitle('Asset Documents');
    } else {
      setFormTitle('Asset Location');
    }
    //NOTE :-> DO NOT INCLUDE currentForm AS DEPENDENCY
  }, [assetDetail, constructImages, form]);

  useEffect(() => {
    if (type === STATUS_TYPE.DRAFT) {
      if (draftedAsset?.response && categoryOptions) {
        setFileList([]);
        const draftedAssetResponse = draftedAsset.response.data[0];
        const draftedCategory = categoryOptions.find((option) => option.key === draftedAssetResponse.category);

        if (draftedCategory) {
          setCategory(draftedCategory?.key || '');
        }

        if (draftedAssetResponse.address) {
          setAddress(draftedAssetResponse.address);
        }

        form.setFieldsValue({
          name: draftedAssetResponse?.name,
          description: draftedAssetResponse.description ? JSON.parse(draftedAssetResponse.description) : '',
          price: draftedAssetResponse.price,
          category: draftedCategory?.value,
          country: draftedAssetResponse.country,
          state: draftedAssetResponse.state,
          address: draftedAssetResponse.address,
          postalCode: draftedAssetResponse.pincode,
          city: draftedAssetResponse?.city,
        });

        if (draftedAssetResponse.images && draftedAssetResponse.images.length > 0) {
          constructImages(draftedAssetResponse.images);
        }

        if (draftedAssetResponse.draftedDocuments && draftedAssetResponse.draftedDocuments.length > 0) {
          constructDocumentList(draftedAssetResponse.draftedDocuments);
        }
      }
    }
  }, [draftedAsset, form, categoryOptions, constructImages, type]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormUpdated) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form, hasFormUpdated]);

  useEffect(() => {
    isKycVerified();
  }, []);

  useEffect(() => {
    if (user?.stripeAccountId && !stripeOnboardStatus) {
      const checkIsStripeOnboarded = async () => {
        const response = await getStripeLoginLink(user?.stripeAccountId);

        setStripeOnboardStatus(response.data.response);
        setIsStripeModalOpen(true);
      };

      checkIsStripeOnboarded();
    } else {
      setIsStripeModalOpen(true);
    }
  }, [user]);

  const renderStepContent = () => {
    switch (currentForm) {
      case 1:
        return (
          <EditAssetDetails
            form={form}
            categoryOptions={categoryOptions}
            fileList={fileList}
            setFileList={setFileList}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
            setHasFormUpdated={setHasFormUpdated}
            hasFormUpdated={hasFormUpdated}
          />
        );
      case 2:
        return <EditAssetDocument form={form} setDocList={setdocList} docList={docList} />;
      case 3:
        return <EditAssetLocation form={form} address={address} setAddress={setAddress} />;
      default:
        return null;
    }
  };

  const validateForm = useCallback(async () => {
    try {
      const formValues = await form.validateFields();

      return formValues;
    } catch (error) {
      showErrorToast(error as string, 'Validation Failed');

      return false;
    }
  }, [form, showErrorToast]);

  const handleNext = async () => {
    const formValues = await validateForm();

    if (!isKycVerified()) return;

    if (!stripeOnboardStatus?.isAccountOnboarded) return setIsStripeModalOpen(true);

    if (formValues) {
      switch (currentForm) {
        case 1:
          formValues?.images?.forEach((file: { originFileObj: Blob }) => {
            formData.append('images', file.originFileObj);
            assetsDraftFormData.append('images', file.originFileObj);
          });
          formData.set('category', category);
          formData.set('name', formValues.name);
          formData.set('price', formValues.price);
          formData.set('description', JSON.stringify(description));

          assetsDraftFormData.set('category', category);
          assetsDraftFormData.set('name', formValues.name);
          assetsDraftFormData.set('price', formValues.price);
          assetsDraftFormData.set('description', JSON.stringify(description));
          break;

        case 2:
          formData.set(
            'documents',
            JSON.stringify(
              Object.keys(docList).reduce(
                (updatedDocs, key) => {
                  updatedDocs[key] = docList[key].map((doc) => ({
                    name: doc.name,
                    url: doc?.uploadedS3Url ?? '',
                  }));

                  return updatedDocs;
                },
                {} as Record<string, UpdatedDocsList[]>,
              ),
            ),
          );
          assetsDraftFormData.set(
            'documents',
            JSON.stringify(
              Object.keys(docList).reduce(
                (updatedDocs, key) => {
                  updatedDocs[key] = docList[key].map((doc) => ({
                    name: doc.name,
                    url: doc?.uploadedS3Url ?? '',
                  }));

                  return updatedDocs;
                },
                {} as Record<string, UpdatedDocsList[]>,
              ),
            ),
          );

          break;

        case 3:
          formData.set('country', formValues.country);
          formData.set('state', formValues.state);
          formData.set('city', formValues.city);
          formData.set('address', formValues.address);
          formData.set('pincode', formValues.postalCode);
          handleCreateAsset();
          break;
        default:
          break;
      }
      setCurrentForm((prev) => (prev < 3 ? prev + 1 : prev));
    }
  };

  const handleBack = () => {
    setCurrentForm((prev) => (prev > 1 ? prev - 1 : prev));
    if (currentForm === 3) {
      formData.delete('documents');
    } else if (currentForm === 2) {
      formData.delete('images');
    }
  };

  const handleCreateAsset = async () => {
    if (!isKycVerified()) return;

    // if (!activeAccount) {
    //   showErrorToast(ERROR_MESSAGE.WALLET_NOT_CONNECTED, 'Wallet not connected.');

    //   return;
    // }
    try {
      // setLoading(true);
      // const walletTransactionSuccess = await handleContractCall(activeAccount, showErrorToast, showSuccessToast);

      // if (!walletTransactionSuccess) {
      //   setLoading(false);

      //   return;
      // }

      if (assetId) {
        await updateAsset({ assetId, formData }).unwrap();
      } else {
        await createAsset(formData).unwrap();
      }
      showSuccessToast(assetId ? SUCCESS_MESSAGES.ASSET_CREATED : SUCCESS_MESSAGES.ASSET_UPDATED);
      setLoading(false);
      clearFormData(formData);
      setHasFormUpdated(false);

      router.push('/submission');

      return;
    } catch (error) {
      setLoading(false);
      showErrorToast(error as string, 'Failed to create asset. Please try again.');
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (!hasFormUpdated) return showErrorToast('', 'Make changes before save as draft');
      const formValues = form.getFieldsValue();

      for (let i = 0; i < assetsDraftFormData.getAll('images').length; i++) {
        assetsDraftFormData.delete('images');
      }

      formValues?.images?.forEach((file: { originFileObj: Blob }) => {
        assetsDraftFormData.append('images', file.originFileObj);
      });
      switch (currentForm) {
        case 1:
          assetsDraftFormData.set('category', category || '');
          assetsDraftFormData.set('name', formValues.name || '');
          assetsDraftFormData.set('price', formValues.price || '');
          assetsDraftFormData.set('description', JSON.stringify(description));
          break;

        case 2:
          assetsDraftFormData.set(
            'documents',
            JSON.stringify(
              Object.keys(docList).reduce(
                (updatedDocs, key) => {
                  updatedDocs[key] = docList[key].map((doc) => ({
                    name: doc.name,
                    url: doc?.uploadedS3Url ?? '',
                  }));

                  return updatedDocs;
                },
                {} as Record<string, UpdatedDocsList[]>,
              ),
            ),
          );
          break;

        case 3:
          assetsDraftFormData.set('country', formValues.country || '');
          assetsDraftFormData.set('state', formValues.state || '');
          assetsDraftFormData.set('city', formValues.city || '');
          assetsDraftFormData.set('address', formValues.address || '');
          assetsDraftFormData.set('pincode', formValues.postalCode || '');
      }
      await assetsDraft(assetsDraftFormData);
      setHasFormUpdated(false);
      showSuccessToast(SUCCESS_MESSAGES.ASSET_DRAFTED);
    } catch (error) {
      showErrorToast(error as string, 'Your changes not saved. Something went wrong!');
    }
  };

  const handleCreate = async () => {
    const payload = {
      email: user?.email?.toString(),
    };

    try {
      if (stripeOnboardStatus?.isAccountOnboarded === false) {
        return (window.location.href = stripeOnboardStatus.url);
      }
      setLoading(true);
      const stripeResponse = await createStripeAccount(payload);

      window.dispatchEvent(new Event('userAdded'));
      window.location.href = stripeResponse?.data?.response?.url || '';

      setIsStripeModalOpen(false);
      setLoading(false);
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <div className="width-100 bg-badge-bg p-x-80 p-y-32 d-flex flex-column justify-center align-center">
      <div className="xl d-flex flex-column gap-5">
        <h3 className="f-20-24-700-primary">Submit new asset</h3>
        <div className="d-flex m-t-24 gap-8">
          <div className="d-flex height-100 w-240 p-x-16 p-t-16 radius-8 border-primary-1 bg-white ">
            <div className="d-flex h-fit width-100 flex-column overflow-auto p-0">
              <h3 className="f-12-20-400-secondary">ASSET</h3>
              <Steps
                className="custom-steps-vertical-small m-t-8"
                direction="vertical"
                size="small"
                current={currentForm - 1}
                items={[{ title: 'Details' }, { title: 'Documents' }, { title: 'Location' }]}
              />
            </div>
          </div>

          <div className="width-100 overflow-auto p-28 radius-8 border-primary-1 bg-white">
            <h3 className="f-18-20-600-secondary m-b-32">{formTitle}</h3>
            <Form
              form={form}
              onValuesChange={() => {
                if (!hasFormUpdated) {
                  setHasFormUpdated(!hasFormUpdated);
                }
              }}
              layout="vertical"
              requiredMark={false}
            >
              {renderStepContent()}
            </Form>
            <div className={`d-flex align-center ${currentForm < 2 ? 'justify-flex-end' : 'justify-space-between'}`}>
              {currentForm > 1 && (
                <Button
                  type="link"
                  size="large"
                  className="bg-white main-button border-primary-1 f-14-20-400-primary"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              <div className="d-flex justify-flex-end gap-2  position-sticky bottom-0 z-index-1 bg-white footer-button">
                {/* For Full Product */}
                {!loading && (
                  <Button
                    type="text"
                    size="large"
                    className="border-blue-1"
                    loading={assetsDraftLoading}
                    onClick={handleSaveDraft}
                  >
                    Save as Draft
                  </Button>
                )}
                <Button
                  type="primary"
                  size="large"
                  className="bg-brand-color"
                  loading={loading || createLoading || updateLoading}
                  onClick={handleNext}
                  disabled={Object.values(docList)
                    .flat()
                    .some((doc) => !doc.uploadedS3Url)}
                >
                  {currentForm < 3 ? 'Continue' : 'Finish'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!assetId && !stripeOnboardStatus?.isAccountOnboarded && (
        <ConnectStripeModal
          isOpen={isStripeModalOpen}
          handleCancel={() => setIsStripeModalOpen(false)}
          handleConfirm={() => handleCreate()}
          loading={loading}
          isAccountOnboarded={stripeOnboardStatus?.isAccountOnboarded}
        />
      )}
    </div>
  );
};

export default AssetDetailsForm;
