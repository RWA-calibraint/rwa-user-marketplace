import Modal from 'antd/es/modal/Modal';

import { BuyModalProps } from './interface';

const BuyModal: React.FC<BuyModalProps> = ({
  isOpen,
  className = '',
  closable = false,
  handleCancel,
  handleConfirm,
  availableTokens,
  tokens,
  assetTokens,
  price,
}) => {
  const commission_percentage = 5;
  const totalPrice = (price / assetTokens) * tokens;
  let commission = (commission_percentage / 100) * totalPrice;

  commission = Math.round(commission * 100) / 100;

  const grandtotal = totalPrice + commission;

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      className={className}
      destroyOnClose
      closable={closable}
      style={{ zIndex: 10 }}
    >
      <div className="d-flex flex-column gap-6 p-24">
        <div className="d-flex flex-column gap-3">
          <p className="f-18-20-600-primary"> Buy tokens</p>
          <p className="f-14-16-400-tertiary">
            Choose how many tokens you&apos;d like to buy for this asset. You can pay using fiat or cryptocurrency.
          </p>
        </div>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-2">
            <p className="f-14-16-500-primary">No of Tokens </p>

            <div className="width-25 border-primary-1 radius-6 p-6 text-center">{tokens}</div>
            <p className="f-14-16-400-tertiary">Available Tokens : {availableTokens}</p>
          </div>
          <div className="d-flex flex-column gap-2"></div>
          <div className="d-flex flex-column gap-5 p-16 radius-6 border-primary-1">
            <p className="f-14-16-600-primary">Tokenization Breakdown</p>
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-center justify-space-between">
                <p className="f-14-16-400-secondary">Total Token Price ($USD)</p>
                <p className="f-14-16-400-secondary">$ {totalPrice.toFixed(2)}</p>
              </div>
              <div className="d-flex align-center justify-space-between">
                <p className="f-14-16-400-secondary">Commission</p>
                <p className="f-14-16-400-secondary">$ {commission.toFixed(2)}</p>
              </div>
              <div className="d-flex align-center justify-space-between">
                <p className="f-14-16-500-primary">Overall Amount</p>
                <p className="f-14-16-500-primary"> $ {grandtotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex align-center justify-flex-end">
          <div className="d-flex align-center gap-2">
            <button
              className="border-primary-1 bg-white radius-6 p-y-12 p-x-16 f-14-16-500-primary cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={`border-primary-1 bg-white radius-6 p-y-12 p-x-16 f-14-16-500-logo bg-brand-blue cursor-pointer`}
              onClick={handleConfirm}
            >
              Buy tokens
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BuyModal;
