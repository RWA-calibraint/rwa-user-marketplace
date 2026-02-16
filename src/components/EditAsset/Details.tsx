'use client';

import { Form, Input, Select, Upload, UploadProps } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC, useCallback, useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Descendant } from 'slate';

import { useGetImageAnalysisMutation } from '@/redux/apis/asset.api';
import { ERROR_MESSAGE } from '@helpers/constants/error-message';
import { useToast } from '@helpers/notifications/toast.notification';
import { extractText } from '@helpers/slate/function';

import { DraggableUploadList } from '../Draggable';
import TextEditor from '../TextEditor/Editor';

import { EditAssetDetailsProps } from './interface';

const DndProvider = dynamic(() => import('react-dnd').then((mod) => mod.DndProvider), { ssr: false });

const { Dragger } = Upload;

const EditAssetDetails: FC<EditAssetDetailsProps> = ({
  form,
  fileList,
  setFileList,
  setCategory,
  categoryOptions,
  description,
  setDescription,
  setHasFormUpdated,
  hasFormUpdated,
}) => {
  const [analyzeImage] = useGetImageAnalysisMutation();
  const [nameCount, setNameCount] = useState(0);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [price, setPrice] = useState<number>(1);

  const { showErrorToast } = useToast();

  const handleDescriptionChange = (value: Descendant[]) => {
    setDescription(value);
    form?.setFieldsValue({ description: value });
  };

  const checkImage = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append('image', file);
      const res = await analyzeImage({ data: formData }).unwrap();

      if (res.response?.quality?.overallScore > 0.5) {
        return true;
      }
      // const errorMessage = res.response.recommendation ?? 'Image quality is not good';

      showErrorToast(ERROR_MESSAGE.IMAGE_REJECTED, 'Please Upload clear images');

      return false;
    } catch (error) {
      showErrorToast(error, ERROR_MESSAGE.FAILED_TO_UPLOAD_IMAGE);

      return false;
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    maxCount: 7,
    showUploadList: false,
    accept: '.png,.jpeg,.jpg,.mp4, .avi,.mov,.mkv',
    beforeUpload: async (newFile) => {
      const isVideo = newFile.type.startsWith('video/');
      const imageCheckResult = isVideo ? true : await checkImage(newFile);

      if (!imageCheckResult) {
        return Upload.LIST_IGNORE;
      }
      if (fileList.length === 7) {
        showErrorToast(ERROR_MESSAGE.NO_OF_FILES(7, 'images'), ERROR_MESSAGE.UPLOAD_FAILED);

        return Upload.LIST_IGNORE;
      }
      const isLimitGreaterThan2M = newFile.size / 1024 / 1024 >= 0.1;
      const isLimitLessThan5M = newFile.size / 1024 / 1024 <= 5;

      if (!isLimitLessThan5M) {
        showErrorToast(ERROR_MESSAGE.IMAGE_SIZE_LIMIT, ERROR_MESSAGE.UPLOAD_FAILED);

        return Upload.LIST_IGNORE;
      } else if (!isLimitGreaterThan2M) {
        showErrorToast(ERROR_MESSAGE.IMAGE_SIZE_LESS, ERROR_MESSAGE.UPLOAD_FAILED);

        return Upload.LIST_IGNORE;
      }
    },
    onChange: ({ fileList: newFileList }) => {
      if (form) form.setFieldsValue({ images: newFileList });
      if (setFileList) setFileList(newFileList);
      if (!hasFormUpdated) setHasFormUpdated(!hasFormUpdated);
    },
  };

  const handleCategoryChange = (
    value: string,

    option?: { label: string; key: string; value: string } | { label: string; key: string; value: string }[],
  ) => {
    if (Array.isArray(option)) {
      if (setCategory) setCategory(option[0]?.key || '');
    } else if (option) {
      if (setCategory) setCategory(option.key);
    }
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newFileList = fileList ? [...fileList] : [];
    const draggedFile = newFileList[dragIndex];

    if (!draggedFile) {
      showErrorToast(ERROR_MESSAGE.DRAG_FILE_FAIL, ERROR_MESSAGE.DRAG_FILE_FAIL);

      return;
    }
    newFileList[hoverIndex] = newFileList.splice(dragIndex, 1, newFileList[hoverIndex])[0];
    if (setFileList) setFileList(newFileList);
    if (form) form.setFieldsValue({ images: newFileList });
  };

  useEffect(() => {
    if (form) form.setFieldValue('images', fileList);
  }, [fileList, form]);

  const checkDescription = useCallback((_: unknown, value: Descendant[]) => {
    if (!value || value.length === 0) {
      return Promise.reject(new Error('Description is required'));
    }
    const text = extractText(value);

    if (!text || !text.trim()) {
      return Promise.reject(new Error('Description is required'));
    }

    return Promise.resolve();
  }, []);

  return (
    <div className={`w-662 radius-12 bg-white  border-white-1 overflow-auto `}>
      <div className="border-white-1">
        <div>
          <Form.Item
            label={
              <span>
                Images <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="images"
            className="m-b-16"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              {
                required: true,
                message: 'Please upload at least one image',
              },
            ]}
          >
            <DndProvider backend={HTML5Backend}>
              <Dragger {...props} className="no-padding-upload">
                <div className="d-flex align-center p-y-32 width-100 text-justify justify-center bg-white">
                  <Image src="/image-ref.svg" alt="image" width={52} height={52} />
                  <div className="m-l-16 max-w-240 text-left">
                    <p className="f-14-16-600-primary">
                      Drag and drop files here or &nbsp; <span className="f-14-16-600-b-s">upload</span>
                    </p>
                    <p className="f-12-14-400-tertiary m-t-8">
                      Supported file format: .png, .jpeg Max 7 images, Each 5 mb.
                    </p>
                  </div>
                </div>
              </Dragger>
              {fileList.length > 0 && (
                <div className="m-b-16">
                  <DraggableUploadList fileList={fileList} moveImage={moveImage} setFileList={setFileList} />
                </div>
              )}
              {fileList && fileList.length <= 0 && (
                <div className="f-14-20-400-tertiary m-t-8">
                  Please ensure that the photos you upload are original and taken directly by you. Avoid using images
                  downloaded from websites, as only authentic asset photos will be accepted.
                </div>
              )}
            </DndProvider>
          </Form.Item>

          {categoryOptions.length > 0 && (
            <Form.Item
              label={
                <span>
                  Category <span className="f-14-16-500-status-red">*</span>
                </span>
              }
              name="category"
              className="m-b-16"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select" options={categoryOptions} onChange={handleCategoryChange} />
            </Form.Item>
          )}

          {/* Name */}
          <Form.Item
            label={
              <span>
                Name <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="name"
            className="m-b-0"
            rules={[
              { required: true, message: 'Please enter asset name' },
              { pattern: /^[a-zA-Z0-9][a-zA-Z0-9-_]*(?: [a-zA-Z0-9-_]+)*\s?$/, message: 'Enter a valid asset name' },
            ]}
          >
            <Input onChange={(e) => setNameCount(e.target.value.length)} placeholder="Asset name" maxLength={70} />
          </Form.Item>
          <div className="d-flex justify-flex-end f-14-20-400-tertiary m-t-8 m-b-16">{nameCount || 0}/70</div>

          {/* Slate Editor */}
          <Form.Item
            label={
              <span>
                Description <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="description"
            rules={[{ required: true, message: '' }, { validator: checkDescription }]}
            className="m-b-16"
            validateTrigger={['onSubmit']}
          >
            <TextEditor onChange={handleDescriptionChange} value={description} />
          </Form.Item>

          {/* Price */}
          <Form.Item
            label={
              <span>
                Price in USD ($) <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name="price"
            className="m-b-16"
            rules={[
              { required: true, message: 'Please Enter Price' },
              {
                validator: (_, value) => {
                  const minPrice = 10;

                  const numValue = Number(value);

                  if (numValue < minPrice) {
                    return Promise.reject(new Error(`Minimum value allowed is ${minPrice}`));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger={['onSubmit', 'onChange']}
          >
            <Input
              placeholder="Amount"
              type="text"
              onChange={(e) => {
                const inputValue = e.target.value;

                if (inputValue === '') {
                  setPrice(0);
                  form?.setFieldValue('price', '');
                } else {
                  if (!isNaN(Number(inputValue))) {
                    setPrice(Number(inputValue));
                    form?.setFieldValue('price', inputValue);
                  }
                }
              }}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default EditAssetDetails;
