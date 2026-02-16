import { Drawer } from 'antd';
import { Tally1, X } from 'lucide-react';
import Image from 'next/image';

import { PAYMENT_STATUS } from '@/helpers/constants/payment-status';
import { formatAsInternationalDate } from '@/helpers/services/date-formatter';
import { truncateString } from '@/helpers/services/text-formatter';

import { DrawerProps } from './interface';

const DrawerComponent = ({ open, loading = false, assetId, closable = false, order, handleClose }: DrawerProps) => {
  return (
    <Drawer
      closable={closable}
      destroyOnClose
      title={
        <div className="d-flex align-center justify-space-between p-x-24 p-y-20">
          <p className="f-17-22-600-tertiary">Order Details</p>
          <X size={24} className="cursor-pointer icon-24-tertiary" onClick={handleClose} />
        </div>
      }
      placement="right"
      open={open}
      loading={loading}
      width="40vw"
      className="custom-ant-drawer"
      onClose={handleClose}
    >
      <div className="d-flex flex-column gap-3 bg-secondary height-100">
        <div className="bg-white p-x-20 p-y-20">
          <div className="d-flex gap-4">
            <Image src={order.asset.images[0]} alt={`${assetId}-image`} width={80} height={80} className="radius-6" />
            <div className="d-flex flex-column gap-2 justify-space-between">
              <h1 className="f-16-20-600-primary">{order.asset.name}</h1>
              <div className="d-flex align-center gap-3">
                <div className="d-flex align-baseline">
                  <p className="f-17-20-600-primary">{order.asset.tokens}</p>
                  <p className="f-12-20-500-tertiary"> &nbsp;Tokens</p>
                </div>
                <Tally1 size={30} className="p-l-10 icon-32-tertiary" />
                <div className="d-flex align-baseline">
                  <p className="f-17-20-600-primary">${order.asset.price}</p>
                  <p className="f-12-20-500-tertiary"> &nbsp;USD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-x-20 p-y-20">
          <div className="d-flex flex-column gap-5">
            <h1 className="f-16-20-600-primary">Order Summary</h1>
            <div className="d-flex  flex-column gap-4">
              <div className="d-flex align-center justify-space-between f-14-20-400-tertiary">
                <p>No of tokens brought</p>
                <p>{order.quantity}</p>
              </div>
              <div className="d-flex align-center justify-space-between f-14-20-400-tertiary">
                <p>Total Amount ($USD)</p>
                <p>${order.amount}</p>
              </div>
              <div className="d-flex align-center justify-space-between f-14-20-400-tertiary">
                <p>Reward Points</p>
                <p> ${order?.rewardPoints ?? '1000'}</p>
              </div>
              <div className="d-flex align-center justify-space-between f-16-20-600-primary">
                <p>Grand total</p>
                <p>${order.amount}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-x-20 p-y-20 height-100">
          <div className="d-flex flex-column gap-5">
            <h1 className="f-16-20-600-primary">Order Details</h1>
            <div className="grid-cols-3 gap-6">
              <div className="d-flex flex-column gap-1">
                <p className="f-12-20-400-tertiary">ORDER ID</p>
                <p className="f-14-20-500-secondary transform-capitalize">{truncateString(order._id, 16, '...')}</p>
              </div>
              <div className="d-flex flex-column gap-1">
                <p className="f-12-20-400-tertiary">ORDER PLACED ON</p>
                <p className="f-14-20-500-secondary transform-capitalize">
                  {formatAsInternationalDate(order.createdAt)}
                </p>
              </div>
              <div className="d-flex flex-column gap-1">
                <p className="f-12-20-400-tertiary">PAYMENT METHODs</p>
                <p className="f-14-20-500-secondary transform-capitalize">{order.paymentMethod}</p>
              </div>
              <div className="d-flex flex-column gap-1">
                <p className="f-12-20-400-tertiary">TRANSACTION ID</p>
                <p className="f-14-20-500-secondary transform-capitalize">
                  {truncateString(order.transactionId, 16, '...')}
                </p>
              </div>
              <div className="d-flex flex-column gap-1">
                <p className="f-12-20-400-tertiary">PAYMENT STATUS</p>
                <div className="d-flex align-center">
                  <div
                    className={`radius-6 table-chip ${
                      order.paymentStatus === PAYMENT_STATUS.COMPLETED ? 'bg-payment-success' : ''
                    }
                  ${order.paymentStatus === PAYMENT_STATUS.PENDING ? 'bg-payment-pending' : 'bg-e-bg'}`}
                  >
                    <p
                      className={`p-x-8 p-y-4 ${
                        order.paymentStatus === PAYMENT_STATUS.COMPLETED ? 'f-14-16-500-success' : ''
                      } ${order.paymentStatus === PAYMENT_STATUS.FAILED ? 'f-14-16-500-err-text' : ''} ${
                        order.paymentStatus === PAYMENT_STATUS.PENDING ? 'f-14-16-500-w-t' : ''
                      } transform-capitalize`}
                    >
                      {order.paymentStatus === PAYMENT_STATUS.COMPLETED ? 'Success' : order.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerComponent;
