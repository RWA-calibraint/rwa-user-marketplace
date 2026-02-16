'use client';

import { Button } from 'antd';
import { Bitcoin, ChartNoAxesCombined, CheckCircle2Icon, DollarSign, Eye, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { ENV_CONFIGS } from '@/helpers/constants/configs/env-vars';
import { ERROR_MESSAGE } from '@/helpers/constants/error-message';
import { getUserFromCookies } from '@/helpers/services/get-user-data';
import { AssetCardProps } from '@components/asset-details/interface';
import RenderSlateContent from '@components/asset-details/slate-renderer';
import LineChartComponent from '@components/LineChart/LineChart';
import { Timer } from '@components/Timer/Timer';
import { useToast } from '@helpers/notifications/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { useUsdToPolConverter } from '@hooks/useUsdToPol';
import { useAddFavouriteMutation } from '@redux/apis/asset.api';

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isGrid,
  isFeatureAsset = true,
  hasExclusiveAccess,
  priceHistories,
  handleGetExclusiveAccess,
  isOne = false,
}) => {
  const [addToFavourites] = useAddFavouriteMutation();
  const [isLiked, setIsLiked] = useState(asset.isLiked || false);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const displayedContent = JSON.parse(asset.description ?? '');
  const { showErrorToast } = useToast();

  const { convertUsdToPol } = useUsdToPolConverter();

  const user = getUserFromCookies();
  const isOwnAsset = user?._id === asset?.sellerId;

  const handleImageClick = () => {
    const path =
      isFeatureAsset && !isTimerExpired
        ? `/asset/${asset.assetId}?isFeaturedAsset=${isFeatureAsset}`
        : `/asset/${asset.assetId}`;

    window.location.href = path;
  };
  const toggleIsLiked = () => setIsLiked((prev) => !prev);

  const handleRoute = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleFavouriteClick = async () => {
    try {
      if (user) {
        toggleIsLiked();
        await addToFavourites({ assetId: asset._id });
      } else showErrorToast(new Error(ERROR_MESSAGE.LOGIN_REQUIRED), ERROR_MESSAGE.LOGIN_REQUIRED);
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
      toggleIsLiked();
    }
  };

  const renderAccessButton = () => (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        handleGetExclusiveAccess?.(asset._id);
      }}
      size="large"
      type="primary"
    >
      <Sparkles className="icon-16-white w-16 h-16" />
      Get Exclusive Access
    </Button>
  );

  const renderSubmittedButton = () => (
    <Button size="large" type="default" onClick={(e) => e.stopPropagation()}>
      <CheckCircle2Icon className="icon-16-white w-16 h-16" />
      Request Submitted
    </Button>
  );

  const renderBuyOverlay = () => (
    <div className="countdownOverlay">
      {!isOwnAsset ? (
        <div className="d-flex justify-center align-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick();
            }}
            size="small"
            type="primary"
          >
            Buy with <DollarSign className="icon-16-white w-16 h-16" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick();
            }}
            size="small"
            type="primary"
            className="btn-bitcoin"
          >
            Buy with <Bitcoin className="icon-16-white w-16 h-16" />
          </Button>
        </div>
      ) : null}
    </div>
  );

  const renderViewOverlay = () => (
    <div className="countdownOverlay">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleImageClick();
        }}
        size="small"
        type="primary"
        className="btn-bitcoin"
      >
        View Asset <Eye className="icon-16-white w-16 h-16" />
      </Button>
    </div>
  );

  const renderExclusiveOverlay = () => {
    if (!isTimerExpired) {
      return (
        <div className="countdownOverlay">{!hasExclusiveAccess ? renderAccessButton() : renderSubmittedButton()}</div>
      );
    }

    return null;
  };

  const renderTimerSection = () => {
    if (isTimerExpired) return;

    return asset.listedDate ? (
      <Timer
        date={asset.listedDate}
        setIsExpired={setIsTimerExpired}
        className="d-flex bg-brand-secondary justify-center p-y-8 p-x-12 gap-3 text-center f-16-20-600-white radius-6 h-53"
        labelClassName="f-12-24-400-white"
      />
    ) : null;
  };

  const renderTokenDetails = () => (
    <div className="tokenDetails">
      <h4>Token Details</h4>
      <div>
        <span>Contract Address</span>
        <span
          className="tokenDetailsHeader"
          onClick={() => handleRoute(`${ENV_CONFIGS.POLYGON_URL}/${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS}`)}
        >{`${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS.slice(0, 5)}...${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS.slice(-4)}`}</span>
      </div>
      <div>
        <span>Token ID</span>
        <span className="tokenDetailsHeader" onClick={() => handleRoute(asset.arweaveMetadataUrl)}>
          {asset.contractTokenId}
        </span>
      </div>
      <div>
        <span>Token Standard</span>
        <span className="tokenStandard">{'ERC1155'}</span>
      </div>
    </div>
  );

  const renderPriceHistoryChart = () => {
    if (!isOne) return null;

    return (
      <div className="d-flex p-0">
        {priceHistories && priceHistories?.length > 0 ? (
          <LineChartComponent data={priceHistories} />
        ) : (
          <div className="border-primary-1 radius-12 p-24 gap-6 d-flex flex-column align-center justify-center width-100">
            <div className="p-10 radius-100 bg-hold-secondary d-flex align-center display-center">
              <ChartNoAxesCombined className="icon-20-brand-secondary" />
            </div>
            <p className="f-14-22-400-tertiary">No Data Available for Chart</p>
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => (
    <>
      <div className="assetCard">
        <div className="left">
          <div className="imageWrapper" onClick={handleImageClick}>
            <Image
              src={asset.images[0]}
              alt={asset.name}
              className={`assetImage ${isTimerExpired || !isFeatureAsset ? 'h-330' : 'h-266'}`}
              height={450}
              width={450}
            />
            <div
              className={`heartIconWrapper cursor-pointer ${isLiked ? 'icon-24-red' : 'icon-24-blue'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleFavouriteClick();
              }}
            >
              <Heart className="img-20" size={24} fill={`${isLiked ? '#ED1515' : '#fff'}`} />
            </div>
            {isFeatureAsset && !isTimerExpired
              ? renderExclusiveOverlay()
              : asset.sold
                ? renderViewOverlay()
                : renderBuyOverlay()}
          </div>
          {isFeatureAsset && renderTimerSection()}
        </div>

        <div className="right">
          <p className="d-flex justify-center align-center f-12-14-500-tertiary w-82 bg-secondary h-auto radius-6 p-y-6 p-x-8">
            {asset?.category?.category ?? 'Art'}
          </p>
          <h3 className="feat-title">{asset.name.length < 30 ? asset.name : asset.name.slice(0, 25) + '...'}</h3>
          <div className="feat-description">
            <RenderSlateContent content={displayedContent} charLimit={50} showMore={false} />
          </div>
          <p className="feat-price">
            <strong>${asset.price} USD</strong>
          </p>
          {renderTokenDetails()}
        </div>
      </div>
      {renderPriceHistoryChart()}
    </>
  );

  const renderGridView = () => (
    <div className="card">
      <div className="imageWrapper" onClick={handleImageClick}>
        <Image
          src={asset.images[0]}
          alt={asset.name}
          className={`assetImage ${isTimerExpired || !isFeatureAsset ? 'h-330' : 'h-266'}`}
          height={450}
          width={450}
        />
        <div
          className={`heartIconWrapper cursor-pointer ${isLiked ? 'icon-24-red' : 'icon-24-blue'}`}
          onClick={(e) => {
            e.stopPropagation();
            handleFavouriteClick();
          }}
        >
          <Heart className="img-20" size={24} fill={`${isLiked ? '#ED1515' : '#fff'}`} />
        </div>
        {isFeatureAsset && !isTimerExpired ? renderExclusiveOverlay() : renderBuyOverlay()}
      </div>
      <div className="assetDetails">
        <h3>{asset.name.length <= 30 ? asset.name : asset.name.slice(0, 23) + '...' + asset.name.slice(-4)}</h3>
        <div className="price">
          <div className="price-section">
            <div className="price">
              ${asset.price}
              <div className="currency">USD</div>
            </div>
            <Image src="/icons/arrow-swap-horizontal.svg" alt="Arrow-swap icon" width={16} height={16} />
            <div className="price">
              {convertUsdToPol(asset.price)}
              <span className="currency">POL</span>
            </div>
          </div>
        </div>
      </div>
      {isFeatureAsset && renderTimerSection()}
    </div>
  );

  return isGrid ? renderGridView() : renderListView();
};

export default AssetCard;
