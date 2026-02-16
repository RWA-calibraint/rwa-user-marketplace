import { Button, Form, FormInstance, Tooltip, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import { Check, FileImage, FileText, Info, LoaderCircle, Trash2, UploadIcon, X } from 'lucide-react';
import Script from 'next/script';
import React, { useCallback, useEffect, useRef } from 'react';

import { ASSET_STATUS } from '@/helpers/constants/asset-status';
import { ERROR_MESSAGE } from '@/helpers/constants/error-message';
import { showErrorToast } from '@/helpers/constants/toast.notification';
import { loadPdfDocument, readFileAsArrayBuffer } from '@/helpers/services/file-reader';
import { getPdfPassword } from '@/helpers/services/pdf-password';
import { useUploadDocumentMutation } from '@/redux/apis/create-asset.api';

import { CustomAlertBox } from '../AlertBox/AlertBox';

import { ASSET_DOCUMENTS, SELL_CONSTANTS } from './constants';
import { UploadDocInterface } from './interface';

declare global {
  interface Window {
    pdfjsLib: typeof import('pdfjs-dist');
  }
}

const formData = new FormData();

const EditAssetDocument = ({
  form,
  docList,
  setDocList,
}: {
  form?: FormInstance<unknown>;
  docList?: Record<string, UploadDocInterface[]>;
  setDocList?: React.Dispatch<React.SetStateAction<Record<string, UploadDocInterface[]>>>;
}) => {
  const [uploadDocument] = useUploadDocumentMutation();
  const filePasswordsRef = useRef<Record<string, string>>({});

  const updateFileStatus = useCallback(
    (key: string, fileList: UploadDocInterface[], uid: string, updatedDocs: Partial<UploadDocInterface>) => {
      setDocList?.((prev) => ({
        ...prev,
        [key]: fileList.map((file) => (file.uid === uid ? { ...file, ...updatedDocs } : file)),
      }));
    },
    [setDocList],
  );

  const handleUploadError = useCallback(
    (key: string, newFile: UploadFile, fileList: UploadFile[], error: unknown) => {
      showErrorToast(error);

      updateFileStatus(key, fileList, newFile.uid, {
        isError: true,
      });
    },
    [updateFileStatus],
  );

  const handleUploadSuccess = useCallback(
    async (key: string, newFile: UploadFile, fileList: UploadFile[]) => {
      try {
        const filePassword = filePasswordsRef.current[newFile.uid] || '';

        formData.set('file', newFile.originFileObj as Blob);
        formData.set('password', filePassword);

        const response = await uploadDocument(formData).unwrap();

        updateFileStatus(key, fileList, newFile.uid, {
          uploadedS3Url: response.response,
          isError: false,
        });
      } catch (error) {
        handleUploadError(key, newFile, fileList, error);
      }
    },
    [handleUploadError, updateFileStatus, uploadDocument],
  );

  const handleUploadChange = useCallback(
    (key: string) =>
      async ({ file: newFile, fileList }: { fileList: UploadFile[]; file: UploadFile }) => {
        if (!setDocList) return;

        updateFileStatus(key, fileList, newFile.uid, {});

        if (newFile.status === 'done') {
          handleUploadSuccess(key, newFile, fileList);
        }
      },
    [handleUploadSuccess, setDocList, updateFileStatus],
  );

  const handleRemove = (key: string, file: UploadFile) => {
    setDocList?.((prev) => ({
      ...prev,
      [key]: prev[key]?.filter((item) => item.uid !== file.uid) || [],
    }));
  };

  const isDuplicateFile = (newFile: RcFile, fileList: RcFile[]) =>
    fileList.some((file) => file.name === newFile.name && file.size === newFile.size);

  const handleBeforeUpload = useCallback(async (newFile: RcFile, fileList: RcFile[]) => {
    try {
      if (newFile.type === 'application/pdf') {
        const arrayBuffer = await readFileAsArrayBuffer(newFile);

        await loadPdfDocument(arrayBuffer as ArrayBuffer);
      }
      const allowedFileTypes = new Set([
        'application/pdf',
        'image/png',
        'image/jpeg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ]);

      if (!allowedFileTypes.has(newFile.type)) {
        showErrorToast(new Error(ERROR_MESSAGE.INVALID_FILE));

        return Upload.LIST_IGNORE;
      }

      if (isDuplicateFile(newFile, fileList)) {
        showErrorToast(new Error(ERROR_MESSAGE.FILE_CONTENT_DUPLICATE));

        return Upload.LIST_IGNORE;
      }

      if (fileList.length >= 3) {
        showErrorToast(new Error(ERROR_MESSAGE.NO_OF_FILES(3, 'files')));

        return Upload.LIST_IGNORE;
      }

      if (newFile.size > 50 * 1024 * 1024) {
        showErrorToast(new Error(ERROR_MESSAGE.FILE_SIZE_LIMIT));

        return Upload.LIST_IGNORE;
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.log(error);
      try {
        const password = await getPdfPassword();

        filePasswordsRef.current[newFile.uid] = password;

        if (isDuplicateFile(newFile, fileList)) {
          showErrorToast(new Error(ERROR_MESSAGE.FILE_CONTENT_DUPLICATE));

          return Upload.LIST_IGNORE;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);

        return Upload.LIST_IGNORE;
      }
    }
  }, []);

  const handlePdfJsLoaded = () => {
    if (typeof window !== 'undefined') {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    }
  };

  useEffect(() => {
    form?.setFieldsValue({ docList });
  }, [docList, form]);

  useEffect(() => {
    ASSET_DOCUMENTS.forEach((document) => {
      form?.setFieldsValue({ [document.key]: docList?.[document.key] || [] });
    });
  }, [docList, form]);

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FileText size={20} color="gray" />;
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return <FileText size={20} color="blue" />;
    if (fileName.endsWith('.png') || fileName.endsWith('.jpeg')) return <FileImage size={20} color="gray" />;
  };

  return (
    <div className={`w-662 border-none-0 radius-12 bg-white overflow-auto`}>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
        onLoad={handlePdfJsLoaded}
        strategy="afterInteractive"
      />
      <CustomAlertBox>
        Supported file formats: .png, .jpeg, .pdf, .docx , .doc / Max file limit: 50 MB / Max file upload: 3
      </CustomAlertBox>

      {ASSET_DOCUMENTS.map((document) => {
        const fileList = docList?.[document.key] || form?.getFieldValue(document.key) || [];

        return (
          <Form.Item
            key={document.key}
            label={
              <span className="f-14-16-500-primary">
                {document.label}
                {document.required && <span className="f-14-16-500-status-red"> *</span>}
              </span>
            }
            name={document.key}
            valuePropName="fileList"
            className="m-b-16"
            rules={[
              {
                required: document.required,
                message: `Please upload at least one file for ${document.label}`,
              },
            ]}
            getValueFromEvent={(e) => e?.fileList || []}
          >
            <Upload
              listType="picture"
              accept=".png, .jpeg, .pdf"
              fileList={fileList}
              onChange={handleUploadChange(document.key)}
              beforeUpload={(newFile) => handleBeforeUpload(newFile, fileList)}
              itemRender={(_, file) => {
                const isRejected = (file as UploadDocInterface)?.statusExternal === ASSET_STATUS.REJECTED;

                return (
                  <div
                    className="d-flex align-center justify-center gap-2 text-center m-y-14"
                    style={{
                      border: isRejected ? '1px solid #FABE25' : '1px solid #E4E4E7',
                      borderRadius: '8px',
                      padding: '10px',
                      backgroundColor: isRejected ? '#FFFBEB' : 'white',
                    }}
                  >
                    {isRejected ? (
                      <Tooltip title={SELL_CONSTANTS.MISSING_AUTHORITY}>
                        <Info size={16} color="#FABE25" className="cursor-pointer" />
                      </Tooltip>
                    ) : (
                      (file as UploadDocInterface)?.uploadedS3Url && <Check size={16} color="green" />
                    )}
                    {!(file as UploadDocInterface)?.uploadedS3Url && !(file as UploadDocInterface)?.isError ? (
                      <LoaderCircle size={16} color="blue" className="spin" />
                    ) : null}
                    {(file as UploadDocInterface)?.isError && <X size={16} color="red" />}
                    {getFileIcon(file.name)}
                    <span className="text-sm font-medium flex-1 text-center">{file.name}</span>
                    <Trash2
                      size={16}
                      color="gray"
                      className="cursor-pointer"
                      onClick={() => handleRemove(document.key, file)}
                    />
                  </div>
                );
              }}
            >
              <Button
                icon={<UploadIcon className="blue-icon cardButton" />}
                className="h-40 f-14-20-500-selected-image border-selected-image-1"
                style={{ color: '#1B7FAE' }}
                type="text"
              >
                Upload
              </Button>
            </Upload>
          </Form.Item>
        );
      })}
    </div>
  );
};

export default EditAssetDocument;
