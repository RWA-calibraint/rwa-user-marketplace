import { Button } from 'antd';
import React from 'react';

import { ASSET_STATUS } from '@/helpers/constants/asset-status';
import useMediaQuery from '@hooks/useMediaQuery';

import { ListingInterface } from './interface';
import NoData from './no-data';

const Listing = ({
  listings,
  handleBuy,
  handleCancel,
  isOwnAsset,
  status,
}: {
  listings: ListingInterface[];
  handleBuy: (listingId: string) => void | undefined;
  handleCancel: (listingId: string) => void | undefined;
  isOwnAsset: boolean;
  status: ASSET_STATUS;
}) => {
  const headers = ['Token Price', 'Tokens', 'From'];
  const isMobile = useMediaQuery('mobile');

  return (
    <div>
      {listings && listings.length > 0 ? (
        <>
          <div className={`d-grid grid-cols-4 align-center p-x-4`}>
            {headers.map((header, idx) => (
              <p key={idx} className={`f-14-16-500-tertiary ${isMobile ? 'p-x-4 p-y-8' : 'p-x-16 p-y-14'}`}>
                {header}
              </p>
            ))}
          </div>
          <div className="d-grid grid-cols-4 align-center p-x-4" style={{ overflowX: 'scroll' }}>
            {listings.map((item, idx) => (
              <React.Fragment key={idx}>
                <p className={`${isMobile ? 'p-x-4 p-y-8 text-ellipsis' : 'p-x-16 p-y-20'} f-14-16-500-secondary`}>
                  ${item.tokenPrice.toFixed(4)}
                </p>
                <p className={`${isMobile ? 'p-x-4 p-y-8 text-ellipsis' : 'p-x-16 p-y-20'} f-14-16-500-secondary`}>
                  {item.tokens}
                </p>
                <p className={`${isMobile ? 'p-x-4 p-y-8 text-ellipsis' : 'p-x-16 p-y-20'} f-14-16-500-secondary`}>
                  {item.sellerId._id}
                </p>
                <div
                  className={`${isMobile ? 'p-x-4 p-y-8' : 'p-x-16 p-y-20'} d-flex align-center justify-center ${isOwnAsset ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {!item?.userAsset ? (
                    <Button
                      type="primary"
                      onClick={() => handleBuy(item._id)}
                      disabled={isOwnAsset || status === ASSET_STATUS.DE_LISTED}
                    >
                      Buy
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => handleCancel(item._id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <NoData description="No Listings Yet" />
      )}
    </div>
  );
};

export default Listing;
