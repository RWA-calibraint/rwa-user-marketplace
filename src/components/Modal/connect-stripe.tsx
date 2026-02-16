import { Button, Modal } from 'antd';
import React from 'react';

import { stripeData } from '@helpers/constants/constants';
const ConnectStripeModal = ({
  isOpen = true,
  handleConfirm,
  loading,
  isAccountOnboarded,
}: {
  isOpen: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  loading: boolean;
  isAccountOnboarded: boolean | undefined;
}) => {
  return (
    <Modal centered open={isOpen} footer={null} closable={false} style={{ zIndex: 10 }}>
      <div className="d-flex flex-column gap-8 p-24">
        <div className="d-flex align-center gap-3">
          <div className="d-flex align-center justify-center bg-purple radius-100 h-50 w-50">
            <p className="f-14-18-600-white">stripe</p>
          </div>
          <p className="f-18-20-600-primary">
            {isAccountOnboarded === undefined
              ? 'Connect Your Stripe Account'
              : 'Complete Your Stripe Account Setup'}{' '}
          </p>
        </div>
        {isAccountOnboarded === undefined ? (
          <div className="d-flex flex-column gap-4">
            {stripeData.map((item, idx) => (
              <div key={idx}>
                {item.answer ? (
                  <div className="d-flex flex-column gap-2">
                    <p className="f-14-16-500-primary">{item.question}</p>
                    <p className="f-14-20-400-secondary">{item.answer}</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    <p className="f-14-16-500-primary">{item.question}</p>
                    <ul style={{ listStyleType: 'disc', margin: '0', paddingLeft: '25px' }}>
                      {item.list?.map((listItem, idx) => (
                        <li key={idx} className="f-14-20-400-secondary">
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="f-14-20-400-primary">
              Your stripe onboarding setup is not completed yet. Please Complete the setup to sell the asset
            </p>
          </div>
        )}
        <div className="d-flex align-center gap-3 justify-flex-end">
          <Button type="primary" onClick={handleConfirm} loading={loading}>
            {isAccountOnboarded === undefined ? 'Connect stripe Account' : 'Complete Stripe Setup'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectStripeModal;
