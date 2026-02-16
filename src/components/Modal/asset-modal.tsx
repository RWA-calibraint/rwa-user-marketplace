import { Button, Divider, Input, Select } from 'antd';
import Modal from 'antd/es/modal/Modal';
import { DollarSign, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { calculateTokenPrice } from '@/helpers/services/token-price';
import { ASSSET_ACTION } from '@helpers/constants/asset-status';

import { AssetModalProps } from './interface';

const AssetModal: React.FC<AssetModalProps> = ({
  type,
  isOpen,
  className = '',
  closable = false,
  handleCancel,
  handleConfirm,
  availableListingTokens,
  availableTokens,
  setTokens,
  setPrice,
  tokens,
  price,
  totalTokens,
  assetPrice,
  paymentMethod,
  isTxLoading,
  setPaymentMethod,
}) => {
  const [errors, setErrors] = useState({
    tokenError: '',
    priceError: '',
    pricePerTokenError: '',
  });

  const handleDecreaseTokens = () => {
    if (tokens > 0) {
      setTokens((prev) => prev - 1);
    }
    if (tokens <= availableTokens) {
      setErrors((prev) => ({ ...prev, tokenError: '' }));
    }
  };

  const handleIncreaseTokens = () => {
    const maxAllowed = availableTokens;
    const nextValue = tokens + 1;

    if (nextValue <= maxAllowed) {
      setTokens(nextValue);
      setErrors((prev) => ({ ...prev, tokenError: '' }));
    }
  };

  useEffect(() => {
    if (type === ASSSET_ACTION.SELL) {
      if (tokens > availableListingTokens) {
        setErrors((prev) => ({
          ...prev,
          tokenError: `Available tokens: ${availableListingTokens}. Please enter a value of ${availableListingTokens} or less.`,
        }));
      }

      const pricePerToken = calculateTokenPrice(price, tokens, 2);

      if (Number(pricePerToken) < 0.5) {
        setErrors((prev) => ({
          ...prev,
          pricePerTokenError: 'Price per token must be at least 0.5. Either increase price or decrease tokens.',
        }));
      }
      const pricePerTokenAtBuy = assetPrice / totalTokens;
      const minRequiredPrice = pricePerTokenAtBuy * tokens;

      if (price <= minRequiredPrice) {
        setErrors((prev) => ({
          ...prev,
          pricePerTokenError: `Price should be greater than $${minRequiredPrice.toFixed(2)} for ${tokens} tokens`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          pricePerTokenError: '',
        }));
      }
    } else {
      if (tokens > availableTokens) {
        setErrors((prev) => ({
          ...prev,
          tokenError: `Available tokens: ${availableTokens}. Please enter a value of ${availableTokens} or less.`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          tokenError: '',
        }));
      }
    }
  }, [tokens, availableListingTokens, price, availableTokens, type, assetPrice, totalTokens]);

  const validateFields = () => {
    let isValid = true;

    if (!price || price < 0) {
      setErrors((prev) => ({ ...prev, priceError: 'Please enter a valid price' }));
      isValid = false;
    }
    if (!tokens || tokens < 0) {
      setErrors((prev) => ({ ...prev, tokenError: 'Please enter valid number of tokens' }));
      isValid = false;
    }

    return isValid;
  };

  const handleConfirmClick = () => {
    if (validateFields()) {
      handleConfirm();
    }
  };

  const handleCancelClick = () => {
    resetErrors();
    handleCancel();
  };

  const resetErrors = () => {
    setErrors({ tokenError: '', priceError: '', pricePerTokenError: '' });
  };

  const commission_percentage = 5;
  const pricePerToken = calculateTokenPrice(price, availableTokens, 2);
  const totalPrice = Number(pricePerToken) * tokens;

  let commission = (commission_percentage / 100) * totalPrice;

  commission = Math.round(commission * 100) / 100;

  const grandtotal = totalPrice + commission;

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={handleCancelClick}
      footer={null}
      className={className}
      destroyOnClose
      closable={closable}
      style={{ zIndex: 10 }}
    >
      <div className="d-flex flex-column gap-6 p-24">
        <div className="d-flex flex-column gap-3">
          <p className="f-18-20-600-primary">{type === ASSSET_ACTION.SELL ? 'List tokens ' : 'Buy tokens'}</p>
          <p className="f-14-16-400-tertiary">
            {type === ASSSET_ACTION.SELL
              ? `Specify the number of tokens to list for sale of this asset. The tokens will be listed on the marketplace,
            and buyers can purchase them.`
              : `Choose how many tokens you'd like to buy for this asset. You can pay using fiat or cryptocurrency.`}
          </p>
        </div>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-2">
            <p className="f-14-16-500-primary">No of Tokens </p>
            {type === ASSSET_ACTION.SELL ? (
              <>
                <Input
                  value={tokens}
                  placeholder="E.g.10,20,50"
                  className={`${errors.tokenError ? 'border-red-1' : ''}`}
                  onChange={(e) => {
                    resetErrors();
                    setTokens(Number.isNaN(e) ? 0 : parseInt(e.target.value) || 0);
                  }}
                />
                {errors.tokenError && <p className="p-t-4 f-14-16-500-err-text">{errors.tokenError}</p>}
              </>
            ) : (
              <>
                <div className="width-50">
                  <Input
                    value={tokens}
                    prefix={
                      <Minus
                        className="icon-20-primary cursor-pointer"
                        onClick={() => {
                          resetErrors();
                          handleDecreaseTokens();
                        }}
                      />
                    }
                    placeholder="E.g., 10, 50, 100"
                    onChange={(e) => {
                      resetErrors();
                      setTokens(Number.isNaN(e) ? 0 : parseInt(e.target.value) || 0);
                    }}
                    suffix={
                      <Plus
                        className="icon-20-primary cursor-pointer"
                        onClick={() => {
                          resetErrors();
                          handleIncreaseTokens();
                        }}
                      />
                    }
                    className={`${errors.tokenError ? 'border-red-1' : ''} price-input`}
                  />
                </div>
                <div>{errors.tokenError && <p className="p-t-4 f-14-16-500-err-text">{errors.tokenError}</p>}</div>
              </>
            )}
            <p className="f-14-16-400-tertiary">
              Available Tokens :{type === ASSSET_ACTION.SELL ? <>{availableListingTokens}</> : <>{availableTokens}</>}
            </p>
          </div>
          <div className="d-flex flex-column gap-2">
            {type === ASSSET_ACTION.SELL ? (
              <>
                <p className="f-14-16-500-primary">Total price for listed Tokens </p>
                <Input
                  placeholder="1200"
                  value={price}
                  type="Number"
                  step="0.0001"
                  prefix={<DollarSign />}
                  className={`${errors.pricePerTokenError ? 'border-red-1' : ''} square-input`}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    resetErrors();
                    if (inputValue === '' || /^\d*\.?\d{0,4}$/.test(inputValue)) {
                      const numericValue = inputValue === '' ? 0 : parseFloat(inputValue);

                      setPrice(numericValue);
                    }
                  }}
                />
                {errors.pricePerTokenError && <p className="p-t-4 f-14-16-500-err-text">{errors.pricePerTokenError}</p>}
              </>
            ) : (
              <>
                <p className="f-14-16-500-primary">Payment mode</p>
                <Select
                  showSearch={false}
                  value={paymentMethod}
                  onChange={(value: string) => {
                    setPaymentMethod(value);
                  }}
                  className="f-14-16-500-secondary"
                  defaultValue="fiat"
                  style={{ width: '100%' }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                  options={[
                    {
                      value: 'fiat',
                      label: 'Buy with fiat',
                    },
                    {
                      value: 'crypto',
                      label: 'Buy with crypto',
                    },
                  ]}
                />
              </>
            )}
          </div>
          <div className="d-flex flex-column gap-5 p-16 radius-6 border-primary-1">
            <p className="f-14-16-600-primary">Tokenization Breakdown</p>
            <div className="d-flex align-center justify-space-between">
              <p className="f-14-16-400-secondary">Price per token ($USD)</p>
              <p className="f-14-16-400-secondary">
                $
                {type === ASSSET_ACTION.SELL ? (
                  <>{calculateTokenPrice(price, tokens, 2)}</>
                ) : (
                  <>{calculateTokenPrice(price, availableTokens, 2)}</>
                )}
              </p>
            </div>
            {type === ASSSET_ACTION.BUY ? (
              <>
                <div className="d-flex align-center justify-space-between">
                  <p className="f-14-16-400-secondary">Commission</p>
                  <p className="f-14-16-400-secondary">$ {commission.toFixed(2)}</p>
                </div>
                <Divider className="custom-divider-one" />
                <div className="d-flex align-center justify-space-between">
                  <p className="f-14-16-500-primary">Overall Amount</p>
                  <p className="f-14-16-500-primary"> $ {grandtotal.toFixed(2)}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="d-flex align-center justify-flex-end">
          <div className="d-flex align-center gap-2">
            <button
              className="border-primary-1 bg-white radius-6 p-y-12 p-x-16 f-14-16-500-primary cursor-pointer"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <Button
              type="primary"
              loading={isTxLoading}
              className={`border-primary-1 bg-white radius-6 p-y-12 p-x-16 f-14-16-500-logo bg-brand-blue ${!!errors.tokenError || !!errors.priceError || !!errors.pricePerTokenError ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={handleConfirmClick}
              style={{ opacity: !!errors.tokenError || !!errors.priceError || !!errors.pricePerTokenError ? 0.5 : 1 }}
              disabled={!!errors.tokenError || !!errors.priceError || !!errors.pricePerTokenError || isTxLoading}
            >
              {type === ASSSET_ACTION.SELL ? 'List tokens' : 'Buy tokens'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssetModal;
