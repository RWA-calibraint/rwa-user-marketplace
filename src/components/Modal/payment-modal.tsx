import { Button, Modal } from 'antd';
import { RotateCcw } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { PAYMENT_STATUS } from '@/helpers/constants/payment-status';

const PaymentModal = ({
  type,
  isOpen = true,
  handleClick,
  handleCancel,
}: {
  type: PAYMENT_STATUS;
  isOpen: boolean;
  handleClick: () => void;
  handleCancel: () => void;
}) => {
  return (
    <Modal
      centered
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      closable={false}
      style={{ zIndex: 10 }}
      width={440}
    >
      <div className="d-flex flex-column gap-6 p-24 align-center justify-center">
        <Image
          src={type === PAYMENT_STATUS.SUCCESS ? '/payment_success.svg' : '/payment_failed.svg'}
          alt={`payment status - ${type}`}
          width={100}
          height={100}
        />
        <div className="d-flex flex-column gap-3 align-center justify-center">
          <p className="f-18-20-600-primary">Payment {type === PAYMENT_STATUS.SUCCESS ? 'Successful!' : 'Failed!'}</p>
          <p className="f-14-20-400-tertiary text-center">
            {type === PAYMENT_STATUS.SUCCESS
              ? 'Your transaction has been completed successfully. Your asset will be securely added to your collections.'
              : 'Unfortunately, your transaction couldn’t be completed. Please check your payment details and try again, or contact support if the issue persists.'}
          </p>
        </div>
        <div className="d-flex align-center gap-5">
          <button
            className="border-primary-1 bg-white radius-6 p-y-12 p-x-16 f-14-16-500-primary cursor-pointer"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <Button type="primary" onClick={handleClick}>
            {type === PAYMENT_STATUS.FAILED && <RotateCcw size={16} />}
            {type === PAYMENT_STATUS.SUCCESS ? 'View Collection' : 'Retry'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
