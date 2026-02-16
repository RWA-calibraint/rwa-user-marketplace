'use client';

import { Modal } from 'antd';
import { IdCard } from 'lucide-react';
import React from 'react';

import { ModalContent, ModalProps, ModalTypeContent } from './interface';
import { modalContent } from './Modal-content';

const StyledModal: React.FC<ModalProps> = ({
  type,
  isOpen,
  className = '',
  name = '',
  actionType,
  closable = false,
  handleCancel,
  handleConfirm,
}) => {
  const cancelHandler = () => {
    handleCancel();
  };

  const modalType = type as keyof ModalContent;
  const typeContent = modalContent[modalType] as ModalTypeContent;

  const content = typeContent[actionType];

  const description = typeof content.description === 'function' ? content.description(name) : content.description;

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={cancelHandler}
      onClose={cancelHandler}
      footer={null}
      className={className}
      destroyOnClose
      closable={closable}
    >
      <div className="d-flex flex-column gap-6 p-x-24 p-y-24">
        <div className="d-flex flex-column gap-3 ">
          {modalType === 'KYC' ? (
            <div className="bg-brand p-10 d-flex align-center justify-center radius-100 w-40 h-40">
              <IdCard className="icon-20-brand" size={20} />
            </div>
          ) : null}
          <h1 className="f-18-22-600-primary text-left">{content.heading}</h1>
          <div className="f-14-20-400-tertiary" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        {actionType === 'review' ? (
          <div className="d-flex align-center justify-flex-end">
            <button
              key="cancel"
              className="p-x-16 p-y-12 m-r-12 f-14-20-500-text-white radius-6 border-primary-1 cursor-pointer bg-brand-blue"
              onClick={cancelHandler}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="d-flex align-center justify-flex-end">
            <button
              key="cancel"
              className="bg-white p-x-16 p-y-12 m-r-12 f-14-20-500-t-o-s radius-6 border-primary-1 cursor-pointer"
              onClick={cancelHandler}
            >
              Cancel
            </button>
            <button
              key="submit"
              className={`p-x-16 p-y-12 radius-6 f-14-20-500-text-white bg-approve-button border-primary-1 cursor-pointer bg-brand-blue`}
              onClick={handleConfirm}
            >
              {content.heading}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StyledModal;
