'use client';
import { useState } from 'react';

import './tokens.module.scss';
import { ASSET_STATUS } from '@helpers/constants/asset-status';

import Activity from './activity';
import Details from './details';
import { ListingInterface, OwnershipInterface } from './interface';
import Listing from './listing';
import Ownership from './ownership';

interface TokenDetailsProps {
  price: number;
  tokens: number;
  soldTokens: number;
  listings: ListingInterface[];
  listingActivity: ListingInterface[];
  ownershipDetails: OwnershipInterface[];
  handleBuy?: (listingId: string) => void;
  handleCancel?: (listingId: string) => void;
  isOwnAsset?: boolean;
  status: ASSET_STATUS;
  contractTokenId: string;
  arweaveMetadataUrl: string;
}

const TokenDetails = ({
  tokens,
  price,
  soldTokens,
  listings,
  listingActivity,
  handleBuy = () => {},
  handleCancel = () => {},
  isOwnAsset = false,
  status,
  ownershipDetails,
  contractTokenId,
  arweaveMetadataUrl,
}: TokenDetailsProps) => {
  const [activeTab, setActiveTab] = useState('Details');

  const tabButtons = [
    { key: 'details', label: 'Details' },
    { key: 'listings', label: 'Listings' },
    { key: 'activity', label: 'Activity' },
    ...(isOwnAsset ? [{ key: 'ownership', label: 'Ownership' }] : []),
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="border-primary-1 radius-6 d-flex flex-column gap-5">
      <div className="p-16 width-100">
        <div
          className="d-grid align-center gap-2 bg-badge-bg justify-space-between p-6"
          style={{ gridTemplateColumns: `repeat(${tabButtons.length}, 1fr)` }}
        >
          {tabButtons.map((btn) => (
            <button
              key={btn.key}
              className={`width-100 p-10 radius-2 cursor-pointer f-14-16-500-primary border-primary-0 ${activeTab === btn.label ? 'bg-white' : 'bg-badge-bg'}`}
              onClick={() => handleTabClick(btn.label)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'Details' ? (
          <Details
            price={price}
            soldTokens={soldTokens}
            tokens={tokens}
            contractTokenId={contractTokenId}
            arweaveMetadataUrl={arweaveMetadataUrl}
          />
        ) : activeTab === 'Listings' ? (
          <Listing
            listings={listings}
            handleBuy={handleBuy}
            handleCancel={handleCancel}
            isOwnAsset={isOwnAsset}
            status={status}
          />
        ) : activeTab === 'Activity' ? (
          <Activity activity={listingActivity} />
        ) : activeTab === 'Ownership' ? (
          <Ownership ownership={ownershipDetails} />
        ) : null}
      </div>
    </div>
  );
};

export default TokenDetails;
