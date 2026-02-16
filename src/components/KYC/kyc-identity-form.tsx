import { Form, Upload, UploadFile, UploadProps, FormInstance } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DndProvider = dynamic(() => import('react-dnd').then((mod) => mod.DndProvider), { ssr: false });
const { Dragger } = Upload;

import { useGetImageAnalysisMutation } from '@/redux/apis/asset.api';
import { ERROR_MESSAGE } from '@helpers/constants/error-message';
import { useToast } from '@helpers/notifications/toast.notification';

import Button from '../button/button';
import { DraggableUploadList } from '../Draggable';

interface identifierInterface {
  currentStep: number;
  form: FormInstance;
}

export default function KycIdentityForm(identifierProps: identifierInterface) {
  const { currentStep, form } = identifierProps;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [analyzeImage] = useGetImageAnalysisMutation();
  const { showErrorToast } = useToast();

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    maxCount: 7,
    showUploadList: false,
    accept: '.png,.jpeg,.jpg,',
    beforeUpload: async (newFile) => {
      const imageCheckResult = await checkImage(newFile);

      if (!imageCheckResult) {
        return Upload.LIST_IGNORE;
      }
      if (fileList.length === 7) {
        showErrorToast(ERROR_MESSAGE.NO_OF_FILES(7, 'images'), ERROR_MESSAGE.UPLOAD_FAILED);

        return Upload.LIST_IGNORE;
      }
      const isLimitGreaterThan2M = newFile.size / 1024 / 1024 >= 0.1;
      const isLimitLessThan10M = newFile.size / 1024 / 1024 <= 10;

      if (!isLimitLessThan10M) {
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
    },
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

  const checkImage = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append('image', file);
      const res = await analyzeImage({ data: formData }).unwrap();

      if (res.response?.quality?.overallScore > 0.5) {
        return true;
      }

      showErrorToast(ERROR_MESSAGE.IMAGE_REJECTED, 'Please Upload clear images');

      return false;
    } catch (error) {
      showErrorToast(error, ERROR_MESSAGE.FAILED_TO_UPLOAD_IMAGE);

      return false;
    }
  };

  return (
    <section className={currentStep === 3 ? 'd-block' : 'd-none'}>
      <label className="">National ID</label>
      <Form.Item
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
          <Dragger {...props}>
            <div className="d-flex align-center p-y-32 width-100 text-justify justify-center bg-white">
              <Image src="/image-ref.svg" alt="image" width={52} height={52} />
              <div className="m-l-16 max-w-240 text-left">
                <p className="f-14-16-600-primary">
                  Drag and drop files here or &nbsp; <span className="f-14-16-600-b-s">upload</span>
                </p>
                <p className="f-12-14-400-tertiary m-t-8">Supported file format: .png, .jpeg.</p>
                <p className="f-12-14-400-tertiary m-t-4">Max file limit: 10 MB.</p>
              </div>
            </div>
          </Dragger>
          {fileList.length > 0 && (
            <div className="m-b-16">
              <DraggableUploadList fileList={fileList} moveImage={moveImage} setFileList={setFileList} />
            </div>
          )}
          {fileList && fileList.length <= 0 && (
            <div className="f-14-20-400-tertiary m-t-8">E.g. Aadhaar, SSN, NIN, Personalausweis, INSEE</div>
          )}
        </DndProvider>
      </Form.Item>
      <Button>Submit</Button>
    </section>
  );
}
