import { Button, Input, Modal, Image as AntImage } from 'antd';
import {
  ChartNoAxesCombined,
  CheckCircle2Icon,
  ChevronDown,
  CircleDollarSign,
  Eye,
  Info,
  Minus,
  Pencil,
  Plus,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';

import { ENV_CONFIGS } from '@/helpers/constants/configs/env-vars';
import { handleBuyWithCrypto, handleListCrypto } from '@/helpers/services/blockchain.service';
import { getErrorMessage } from '@/helpers/services/get-error-message';
import { getUserFromCookies } from '@/helpers/services/get-user-data';
import { isKycVerified } from '@/helpers/services/kyc-verification';
import { calculateTokenPrice } from '@/helpers/services/token-price';
import { useUserListener } from '@/hooks/useUserListener';
import {
  useDeleteListingsMutation,
  useGetExclusiveAccessQuery,
  useListAssetsMutation,
  useSubmitExclusiveAccessMutation,
} from '@/redux/apis/asset.api';
import { useBuyAssetMutation } from '@/redux/apis/payment.api';
import { ASSET_STATUS, ASSET_TYPE, ASSSET_ACTION } from '@helpers/constants/asset-status';
import { accordionSections, PAYMENT_STATUS } from '@helpers/constants/constants';
import { ERROR_MESSAGE } from '@helpers/constants/error-message';
import { SUCCESS_MESSAGES } from '@helpers/constants/success.message';
import { useToast } from '@helpers/notifications/toast.notification';
import { getStatusClass } from '@helpers/services/get-status-class';
import { formatNumber } from '@helpers/services/number-formatter';
import { useUsdToPolConverter } from '@hooks/useUsdToPol';
import { useDeleteAssetMutation } from '@redux/apis/create-asset.api';

import StyledCollapse from '../collapse/collapse';
import DropdownComponent from '../drop-down/drop-down';
import AssetModal from '../Modal/asset-modal';
import BuyModal from '../Modal/buy-modal';
import StyledModal from '../Modal/Modal';
import PDFViewer from '../PDFViewer/PDFViewer';
import TabsPanel from '../TabsPanel/tabsPanel';
import { Timer } from '../Timer/Timer';

import AddressSection from './address-section';
import { Document, RightSectionProps } from './interface';
import PriceChartComponent from './price-chart-graph';
import RemarksText from './remarks-text';
import RenderSlateContent from './slate-renderer';
import TokenDetails from './token-details';
import Warning from './warning';

const showTokenDetails = ['Live', 'Delisted', 'Sold', 'Going Live'];

const menuItems = [
  {
    key: 'fiat',
    label: 'Buy with fiat',
    icon: <CircleDollarSign />,
  },
  {
    key: 'crypto',
    label: 'Buy with crypto',
    icon: <Image src="/icons/bitcoin-refresh.svg" alt="bitcoin-logo" width={24} height={24} />,
  },
];

const RightSection = ({
  assetData,
  setSelectedDocument,
  selectedDocument,
  setIsMenuOpen,
  isMenuOpen,
  assetRefetch,
  getViewsCount,
}: RightSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFeaturedQuery = searchParams.get('isFeaturedAsset');
  const assetType = searchParams.get('type');

  const { convertUsdToPol } = useUsdToPolConverter();

  const [buyToken] = useBuyAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();
  const [deleteListings] = useDeleteListingsMutation();
  const { showErrorToast, showSuccessToast } = useToast();
  const userData = useUserListener();

  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [tokens, setTokens] = useState<number>(assetData.tokens - assetData.soldTokens === 0 ? 0 : 1);
  const [activeTab, setActiveTab] = useState((assetType as ASSSET_ACTION) || ASSSET_ACTION.BUY);
  const [warning, setWarning] = useState<boolean>(tokens > Math.floor(0.6 * (assetData.tokens - assetData.soldTokens)));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [type, setType] = useState<ASSSET_ACTION>((assetType as ASSSET_ACTION) || ASSSET_ACTION.BUY);
  const [price, setPrice] = useState<number>(Number(calculateTokenPrice(assetData.price, assetData.tokens, 2)) || 0);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [availableTokens, setAvailableTokens] = useState<number>(assetData.availableTokens || 0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<PAYMENT_STATUS | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('fiat');
  const [openMoonpayModal, setOpenMoonpayModal] = useState<boolean>(false);
  const [openCryptoToFiatModal, setOpenCryptoToFiatModal] = useState<boolean>(false);
  const [openFiatToCryptoModal, setOpenFiatToCryptoModal] = useState<boolean>(false);
  const [openProcessingModal, setOpenProcessingModel] = useState<boolean>(false);

  // const signer = useSigner();
  const activeAccount = useActiveAccount();

  const [isBuyOpen, setIsBuyOpen] = useState(false);

  const displayedContent = JSON.parse(assetData.description);
  const docsToShow = assetData.documents.map((section) => section.type);
  const accordionsToShow = accordionSections.filter((section) => docsToShow.includes(section.key));

  const [submitExclusiveAccess, { isLoading: submittingExclusiveAccess }] = useSubmitExclusiveAccessMutation();
  const [listAsset] = useListAssetsMutation();

  const {
    data: exclusiveAssetResponse,
    isLoading: gettingExclusiveAccess,
    refetch,
  } = useGetExclusiveAccessQuery(assetData?._id, { skip: !assetData?._id || !isFeaturedQuery });

  const user = getUserFromCookies();
  const isOwnAsset = user?._id === assetData?.sellerId?._id;

  const isBuyDisabled =
    !!assetType ||
    warning ||
    tokens < 1 ||
    assetData?.sold ||
    isOwnAsset ||
    assetData.status !== ASSET_STATUS.LIVE ||
    assetData.availableListingTokens + tokens > Math.floor(0.6 * assetData.tokens);

  const handlePreview = (doc: Document) => {
    setPreviewDoc(doc);
  };

  const checkIsKycVerified = () => {
    if (userData?.kycVerificationStatus === 'completed') {
      return true;
    }

    showErrorToast(ERROR_MESSAGE.KYC_VERIFICATION, 'Complete KYC');
    setIsTxLoading(false);

    return false;
  };

  const handleDecreaseTokens = () => {
    if (tokens > 0) {
      setTokens((prev) => prev - 1);
    }
    if (tokens <= assetData.tokens - assetData.soldTokens) {
      setWarning(false);
    }
  };

  const handleIncreaseTokens = () => {
    const availableTokens = assetData.tokens - assetData.soldTokens;
    const maxAllowed = Math.floor(0.6 * assetData.tokens);
    const nextValue = tokens + 1;

    if (nextValue > availableTokens) {
      setWarning(true);
    }

    setTokens(nextValue);
  };

  useEffect(() => {
    const isDisabled =
      !!assetType ||
      tokens < 0 ||
      assetData?.sold ||
      isOwnAsset ||
      assetData?.status !== ASSET_STATUS.LIVE ||
      tokens > Math.min(assetData.tokens - assetData.soldTokens, Math.floor(0.6 * assetData.tokens)) ||
      assetData.availableListingTokens + tokens > Math.floor(0.6 * assetData.tokens);

    if (isDisabled) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  }, [assetType, tokens, assetData, isOwnAsset, warning]);

  useEffect(() => {
    const checkMoonpayRedirects = async () => {
      if (searchParams.get('transactionId')) {
        if (searchParams.get('stripe')) {
          handleBuyToken();
        } else if (searchParams.get('walletAddress') === activeAccount?.address) {
          try {
            setOpenProcessingModel(true);
            await handleBuyWithCrypto({
              activeAccount,
              assetData,
              assetRefetch,
              setIsPaymentModalOpen,
              setPaymentStatus,
              isPaymentModalOpen,
              paymentStatus,
              buyTokens: tokens,
              selectedListingId: selectedListingId ?? '',
              showErrorToast,
              showSuccessToast,
              setOpenMoonpayModal,
              setOpenCryptoToFiatModal,
            });
            setOpenProcessingModel(false);
          } catch (error) {
            setOpenProcessingModel(false);
          }
        }
        router.push(window.location.pathname);
      }
    };

    checkMoonpayRedirects();
  }, [searchParams]);

  useEffect(() => {
    if (openMoonpayModal) {
      setIsTxLoading(false);
    }
    if (isTxLoading) {
      setIsOpen(true);
    }
  }, [openMoonpayModal, isTxLoading]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleBuySecondaryToken = useCallback(
    (listingId: string) => {
      setSelectedListingId(listingId);
      setType(ASSSET_ACTION.BUY);
      toggleOpen();
    },
    [toggleOpen],
  );
  const handleCancelListings = useCallback((listingId: string) => {
    setSelectedListingId(listingId);
    setModalOpen(true);
  }, []);

  const cancelListings = async () => {
    try {
      if (selectedListingId) {
        await deleteListings(selectedListingId);
        assetRefetch?.();
        showSuccessToast('Deleted asset listings');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage, ERROR_MESSAGE.DELETE_LISTINGS);
    }
  };

  const handleBuyToken = async () => {
    try {
      setIsTxLoading(true);
      const verification = await checkIsKycVerified();

      if (!verification) {
        showErrorToast(ERROR_MESSAGE.KYC_PENDING, 'Kyc is Pending');
      } else {
        const payload: { assetId: string; tokenCount: string; currency: string; listingId?: string } = {
          assetId: assetData._id,
          tokenCount: String(tokens),
          currency: 'USD',
        };

        if (selectedListingId) {
          payload['listingId'] = selectedListingId;
        }
        const checkoutSessionUrl = await buyToken(payload).unwrap();

        window.location.replace(checkoutSessionUrl.response);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage, ERROR_MESSAGE.BUY_TOKEN_FAILED);
    } finally {
      setIsTxLoading(false);
    }
  };

  const handleListToken = async () => {
    try {
      setIsTxLoading(true);
      if (!activeAccount) {
        showErrorToast(ERROR_MESSAGE.WALLET_NOT_CONNECTED, ERROR_MESSAGE.DEFAULT);
        setIsTxLoading(false);

        return;
      }
      try {
        await handleListCrypto({
          activeAccount,
          assetData,
          price,
          tokens,
          selectedListingId: selectedListingId ?? '',
          showErrorToast,
          showSuccessToast,
        });
      } catch (e) {
        if (assetRefetch) assetRefetch();
        setTokens(1);
        setPrice(0);
        setWarning(false);
        setIsOpen(false);

        return;
      }

      await listAsset({
        assetId: assetData._id,
        tokens,
        tokenPrice: price,
      }).unwrap();

      showSuccessToast(SUCCESS_MESSAGES.TOKEN_LISTED);

      if (assetRefetch) assetRefetch();
      setTokens(1);
      setPrice(0);
      setWarning(false);
      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage, ERROR_MESSAGE.LIST_TOKEN_FAILED);

      if (assetRefetch) assetRefetch();
      setTokens(1);
      setPrice(0);
      setWarning(false);
      setIsOpen(false);
    } finally {
      setIsTxLoading(false);
      handleCancel();
    }
  };
  const handleDelete = async () => {
    try {
      setIsTxLoading(true);
      await deleteAsset(assetData.assetId);
      showSuccessToast(SUCCESS_MESSAGES.ASSET_DELETED);
      router.push('/submission');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failure';

      showErrorToast(errorMessage, ERROR_MESSAGE.FAILED_TO_DELETE_ASSET);
    } finally {
      setIsTxLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTokens(1);
    setWarning(false);
  };

  const handleList = () => {
    setType(ASSSET_ACTION.SELL);
    setIsOpen(true);
  };

  useEffect(() => {
    if (selectedListingId) {
      const selectedListing = assetData.listings.find((listing) => listing._id === selectedListingId);

      setPrice(selectedListing?.tokenPrice ?? 0);
      setAvailableTokens(selectedListing?.tokens ?? 0);
    }
  }, [selectedListingId, assetData]);

  const showOutOfTokens = activeTab === ASSSET_ACTION.BUY && (assetData.status === ASSET_STATUS.SOLD || assetData.sold);

  const tabs = [
    {
      key: ASSSET_ACTION.BUY,
      label: <span>Buy</span>,
      children: (
        <div className="d-flex flex-column gap-4">
          <div className="p-y-10 d-flex flex-column gap-2">
            <p className="f-14-16-400-tertiary hide-in-mobile-view">Price per token</p>
            <div className="price-section">
              <div className="price">
                ${assetData.price}
                <div className="currency">USD</div>
              </div>
              <Image src="/icons/arrow-swap-horizontal.svg" alt="Arrow-swap icon" width={16} height={16} />
              <div className="price">
                {convertUsdToPol(assetData.price)}
                <span className="currency">POL</span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3 align-center justify-space-between width-100 m-b-16 buy-container">
            <div className="d-flex align-center justidy-space-between gap-2 width-25">
              <button
                className="bg-white border-primary-1 radius-4 d-flex align-center justify-center w-36 h-40 cursor-pointer"
                onClick={handleDecreaseTokens}
                disabled={tokens <= 1}
              >
                <Minus />
              </button>
              <Input
                value={tokens}
                type="text"
                className="p-x-10 p-y-6 border-primary-1 radius-4 w-40 text-center w-60 h-40"
                onChange={(e) => setTokens(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))}
              />
              <button
                className="bg-white border-primary-1 radius-4 d-flex align-center justify-center w-36 h-40 cursor-pointer"
                onClick={handleIncreaseTokens}
                disabled={
                  !!assetType ||
                  warning ||
                  tokens < 0 ||
                  assetData?.sold ||
                  isOwnAsset ||
                  assetData.status !== ASSET_STATUS.LIVE ||
                  tokens > Math.min(assetData.tokens - assetData.soldTokens, Math.floor(0.6 * assetData.tokens)) ||
                  assetData.availableListingTokens + tokens > Math.floor(0.6 * assetData.tokens)
                }
              >
                <Plus />
              </button>
            </div>
            <DropdownComponent
              label={
                <Button
                  className={`d-flex align-center p-y-8 p-x-16 gap-2 radius-6 d-flex align-center justify-center f-15-20-500-text-white bg-brand-color border-blue-1 ${isBuyDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} position-relative`}
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  style={{ opacity: isBuyDisabled ? 0.5 : 1 }}
                  type="primary"
                  loading={isTxLoading}
                  disabled={isTxLoading}
                >
                  Buy Now
                  <ChevronDown
                    className={`img-16 ${isMenuOpen ? 'rotate' : ''}`}
                    style={{ position: 'absolute', right: '10px' }}
                  />
                </Button>
              }
              menuItems={menuItems}
              dropdownPlacement="bottom"
              handleClick={async (info: { key: string }) => {
                if (!isKycVerified()) return;

                if (info.key === 'fiat') {
                  if (!assetData?.sellerId?.stripeAccountId) {
                    return setOpenFiatToCryptoModal(true);
                  }
                  handleBuyToken();
                } else if (info.key === 'crypto') {
                  try {
                    setIsTxLoading(true);
                    await handleBuyWithCrypto({
                      activeAccount,
                      assetData,
                      assetRefetch,
                      setIsPaymentModalOpen,
                      setPaymentStatus,
                      isPaymentModalOpen,
                      paymentStatus,
                      buyTokens: tokens,
                      selectedListingId: selectedListingId ?? '',
                      showErrorToast,
                      showSuccessToast,
                      setOpenMoonpayModal,
                      setOpenCryptoToFiatModal,
                    });
                  } catch (error) {
                    showErrorToast(error, getErrorMessage(error));
                  } finally {
                    setIsTxLoading(false);
                  }
                }
              }}
              className="width-85 bg-brand-blue p-x-16 p-y-8"
              disabled={isBuyDisabled || loading}
            />
          </div>
          <div className="description asset-mobile-description-container d-none">
            <div className="f-14-22-400-tertiary">{<RenderSlateContent content={displayedContent} />}</div>
          </div>
          {warning && <Warning />}
        </div>
      ),
    },
    {
      key: ASSSET_ACTION.SELL,
      label: <span>Sell</span>,
      children: (
        <div className="d-flex flex-column gap-4">
          <div className="p-y-10 d-flex gap-10">
            <div className="d-flex flex-column gap-2">
              <p className="f-14-16-400-tertiary">You own</p>
              <div className="price-section">
                <p className="price">
                  {assetData.availableListingTokens} <span className="currency">TOKENS</span>
                </p>
              </div>
            </div>
            <div className="d-flex flex-column gap-2">
              <p className="f-14-16-400-tertiary">Current token value</p>
              <div className="price-section">
                <div className="price">
                  ${calculateTokenPrice(assetData.price, assetData.tokens, 2)}
                  <div className="currency">USD</div>
                </div>
                <Image src="/icons/arrow-swap-horizontal.svg" alt="Arrow-swap icon" width={16} height={16} />
                <div className="price">
                  {convertUsdToPol(assetData.price)}
                  <span className="currency">POL</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            onClick={handleList}
            disabled={
              !assetData.tokensBought ||
              assetData.status === ASSET_STATUS.DE_LISTED ||
              assetData.tokens - assetData.soldTokens !== 0
            }
            className="m-b-16"
          >
            <Tag /> List Tokens
          </Button>
        </div>
      ),
    },
  ];

  const tabChangeHandler = (key: string) => {
    if (key === ASSSET_ACTION.BUY) {
      setType(ASSSET_ACTION.BUY);
    } else {
      setType(ASSSET_ACTION.SELL);
    }
    setActiveTab(key as ASSSET_ACTION);
  };

  const handleGetExclusiveAccess = async () => {
    try {
      if (assetData) await submitExclusiveAccess({ assetId: assetData?._id }).unwrap();
      refetch();
    } catch (error) {
      showErrorToast(error as string, 'Failed to submit exclusive access.');
    }
  };

  const handleAssetConfirmation = async () => {
    try {
      if (type === ASSSET_ACTION.BUY) {
        if (paymentMethod === 'crypto') {
          setIsTxLoading(true);
          await handleBuyWithCrypto({
            activeAccount,
            assetData,
            assetRefetch,
            setIsPaymentModalOpen,
            setPaymentStatus,
            isPaymentModalOpen,
            paymentStatus,
            buyTokens: tokens,
            selectedListingId: selectedListingId ?? '',
            showErrorToast,
            showSuccessToast,
            setOpenMoonpayModal,
            setOpenCryptoToFiatModal,
          });
        } else {
          handleBuyToken();
        }
      } else handleListToken();
    } catch (error) {
      setIsTxLoading(false);
      showErrorToast(error, getErrorMessage(error));
    }
  };

  const handleRoute = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="right-section">
      <div className="info">
        <div className="status-section">
          <div className="d-flex align-center gap-3">
            <div className="badge d-flex align-center gap-2">{assetData.category.category || 'Antique'}</div>
            {
              <div className="d-flex align-center gap-1">
                <span className={`status-dot h-14 w-14 radius-100 ${getStatusClass(assetData.status)}`} />
                {assetData.status}
              </div>
            }
            <span className="d-flex align-center gap-2">
              <Eye className="img-16" />
              {formatNumber(getViewsCount?.response?.count ?? 0)} views
            </span>
          </div>
          <div className="d-flex align-center gap-4 justify-space-between"></div>
        </div>
        <p className="f-16-20-400-secondary">#{assetData.assetId}</p>
        <h1 className="title">{assetData.name}</h1>
        <div className="description">
          <div className="f-14-22-400-tertiary">{<RenderSlateContent content={displayedContent} />}</div>
        </div>
      </div>

      {!isFeaturedQuery && (
        <div>
          {(assetData.status === ASSET_STATUS.LIVE ||
            assetData.status === ASSET_STATUS.GOING_LIVE ||
            assetData.status === ASSET_STATUS.SOLD) &&
          !isOwnAsset ? (
            <div className="radius-6 border-primary-1 asset-details-tab">
              <TabsPanel
                tabs={tabs}
                activeKey={activeTab}
                onTabChange={tabChangeHandler}
                className="p-x-16 custom-tab"
              />
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              <p className="f-14-20-400-tertiary">Asset Price</p>
              <div className="price-section">
                <div className="price">
                  ${assetData.price}
                  <div className="currency">USD</div>
                </div>
                <Image src="/icons/arrow-swap-horizontal.svg" alt="Arrow-swap icon" width={16} height={16} />
                <div className="price">
                  {convertUsdToPol(assetData.price)}
                  <span className="currency">POL</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showOutOfTokens && <div className="f-18-20-600-status-red">Out of tokens</div>}

      {!isFeaturedQuery && !assetData.isFeaturedAsset && assetData.status === ASSET_STATUS.NEWLY_ADDED && (
        <div className="d-flex gap-3 align-center">
          <button
            className="p-y-8 p-x-16 gap-2 radius-6 d-flex align-center justify-center border-primary-1 bg-white f-14-20-500-black-secondary width-50 cursor-pointer h-44"
            onClick={() => {
              router.push(`/sell?assetId=${assetData.assetId}`);
            }}
          >
            <Pencil className="h-16 w-16" />
            Edit Asset
          </button>
          <button
            className="p-y-8 p-x-16 gap-2 radius-6 d-flex align-center justify-center border-red-1 bg-white f-14-20-500-red width-50 cursor-pointer h-44"
            onClick={handleDelete}
          >
            <Trash2 className="h-16 w-16" />
            Delete Asset
          </button>
        </div>
      )}

      {!isFeaturedQuery && assetData.adminRemarks ? (
        <RemarksText status={assetData.status} remarks={assetData.adminRemarks} />
      ) : null}

      {!isFeaturedQuery && showTokenDetails.includes(assetData.status) && !!assetData.tokens && (
        <TokenDetails
          price={assetData.price}
          tokens={assetData.tokens}
          soldTokens={assetData.soldTokens}
          listings={assetData.listings}
          listingActivity={assetData.listingActivity}
          handleBuy={handleBuySecondaryToken}
          handleCancel={handleCancelListings}
          isOwnAsset={isOwnAsset}
          status={assetData.status}
          ownershipDetails={assetData.assetOwners}
          contractTokenId={assetData.contractTokenId}
          arweaveMetadataUrl={assetData.arweaveMetadataUrl}
        />
      )}
      {!isFeaturedQuery && assetData.status === ASSET_STATUS.APPROVED && (
        <div className="d-flex align-center justify-flex-start gap-3 radius-4 bg-brand width-100 p-x-12 p-y-12">
          <Info className="f-14-20-500-b-s" />
          <p className="f-14-20-400-secondary">Asset Value and documents are all verified by RareAgora.</p>
        </div>
      )}

      {isFeaturedQuery && (
        <>
          <div className="p-y-10 d-flex flex-column gap-2 hide-in-desktop-view">
            <p className="f-14-16-400-tertiary">Price per token</p>
            <div className="price-section">
              <div className="price">
                ${assetData.price}
                <div className="currency">USD</div>
              </div>
              <Image src="/icons/arrow-swap-horizontal.svg" alt="Arrow-swap icon" width={16} height={16} />
              <div className="price">
                {convertUsdToPol(assetData.price)}
                <span className="currency">POL</span>
              </div>
            </div>
          </div>
          <div className="description hide-in-desktop-view">
            <div className="f-14-22-400-tertiary">{<RenderSlateContent content={displayedContent} />}</div>
          </div>
        </>
      )}

      {isFeaturedQuery && (
        <Timer
          date={assetData.listedDate ?? ''}
          setIsExpired={() => {}}
          className="d-flex bg-hold-secondary justify-center p-x-60 p-y-20 m-t-10 gap-4 text-center f-30-40-600-hold radius-6"
          labelClassName="f-16-24-400-tertiary"
        />
      )}

      {isFeaturedQuery &&
        (!exclusiveAssetResponse?.response ? (
          <Button
            onClick={() => {
              handleGetExclusiveAccess();
            }}
            size="large"
            type="primary"
            loading={submittingExclusiveAccess || gettingExclusiveAccess}
          >
            <Sparkles className="icon-16-white w-16 h-16" />
            Get Exclusive Access
          </Button>
        ) : (
          <Button size="large" type="default">
            <CheckCircle2Icon className="icon-16-white w-16 h-16" />
            Request Submitted
          </Button>
        ))}

      {isFeaturedQuery && (
        <div className="f-16-24-400-tertiary p-16 border-secondary-1">
          <h4>Token Details</h4>
          <div className="d-flex align-center justify-space-between m-t-10">
            <span>Contract Address</span>
            <span
              className="tokenDetailsHeader"
              onClick={() => handleRoute(`${ENV_CONFIGS.POLYGON_URL}/${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS}`)}
            >{`${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS.slice(0, 5)}...${ENV_CONFIGS.RWA_TOKEN_CONTRACT_ADDRESS.slice(-4)}`}</span>
          </div>
          <div className="d-flex align-center justify-space-between m-t-10">
            <span>Token ID</span>
            <span className="tokenDetailsHeader" onClick={() => handleRoute(assetData.arweaveMetadataUrl)}>
              {assetData.contractTokenId}
            </span>
          </div>
          <div className="d-flex align-center justify-space-between m-t-10">
            <span>Token Standard</span>
            <span className="tokenDetailsHeader">{'ERC1155'}</span>
          </div>
        </div>
      )}

      {isFeaturedQuery && (
        <div>
          {assetData.priceHistory.length > 0 ? (
            <>
              <h4 className="f-16-24-600-primary">Asset Value Over Time</h4>
              <PriceChartComponent priceHistory={assetData.priceHistory} />
            </>
          ) : (
            <div className="border-primary-1 radius-6 p-24 gap-6 d-flex flex-column align-center justify-center width-100">
              <div className="p-10 radius-100 bg-hold-secondary d-flex align-center display-center">
                <ChartNoAxesCombined className="icon-20-brand-secondary" />
              </div>
              <p className="f-14-22-400-tertiary">No Data Available for Chart</p>
            </div>
          )}
        </div>
      )}

      {!isFeaturedQuery && (
        <StyledCollapse
          assetData={assetData}
          setSelectedDocument={setSelectedDocument}
          accordionSections={accordionsToShow}
          selectedDocument={selectedDocument}
          handlePreview={handlePreview}
        />
      )}

      {!isFeaturedQuery && (
        <AddressSection
          country={assetData.country}
          city={assetData.city}
          pincode={assetData.pincode}
          showDates={true}
          submittedDate={assetData.updatedAt}
          otherDateType={assetData.status.toUpperCase()}
          otherDate={assetData.status === ASSET_STATUS.LIVE ? assetData.listedDate : assetData.updatedAt}
        />
      )}
      <AssetModal
        isOpen={isOpen}
        availableTokens={availableTokens}
        availableListingTokens={assetData.availableListingTokens}
        handleCancel={handleCancel}
        handleConfirm={handleAssetConfirmation}
        price={price}
        setPrice={setPrice}
        setTokens={setTokens}
        tokens={tokens}
        type={type}
        totalTokens={assetData.tokens}
        assetPrice={assetData.price}
        isTxLoading={isTxLoading}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <StyledModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        className="max-w-460"
        type="Asset"
        actionType={ASSET_TYPE.DELETE}
        handleCancel={() => setModalOpen(false)}
        handleConfirm={cancelListings}
      />
      <BuyModal
        assetTokens={assetData.tokens}
        availableTokens={assetData.tokens - assetData.soldTokens}
        handleCancel={() => {
          setIsBuyOpen(false);
        }}
        handleConfirm={handleBuyToken}
        isOpen={isBuyOpen}
        price={assetData.price}
        tokens={tokens}
      />

      {!isFeaturedQuery &&
        previewDoc &&
        (/\.(jpg|jpeg|png|svg)$/.test(previewDoc.documentUrl) ? (
          <AntImage
            src={previewDoc.documentUrl}
            alt={previewDoc.documentName}
            preview={{ visible: !!previewDoc, onVisibleChange: () => setPreviewDoc(null) }}
          />
        ) : (
          <PDFViewer
            onClose={() => {
              setPreviewDoc(null);
            }}
            pdfDocument={previewDoc}
          />
        ))}
      <Modal open={openMoonpayModal} closable={false} footer={false} centered>
        <div className="p-24">
          <h3>Insufficient USDC balance to complete the purchase.</h3>
          <p className="m-t-6">Please fund your wallet with moonpay USDC.</p>
          <div className="m-t-24 d-flex align-center justify-flex-end gap-2">
            <Button type="text" onClick={() => setOpenMoonpayModal(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="f-15-20-500-text-white bg-brand-color border-blue-1"
              onClick={() => {
                window.open(
                  ENV_CONFIGS.MOONPAY_BUY_URL +
                    `&email=${encodeURIComponent(user?.email)}&walletAddress=${activeAccount?.address || ''}&currencyCode=usdc&redirectURL=${window.location.href}?walletAddress=${activeAccount?.address || ''}`,
                  '_blank',
                );
              }}
            >
              Fund My Wallet
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={openCryptoToFiatModal} closable={false} footer={false} centered>
        <div className="p-24">
          <h3>This asset owner only accepts fiat</h3>
          <p className="m-t-6">
            Please buy with fiat. If you don`t have enough fiat, You can convert your crypto to fiat by clicking proceed
            button. After this process, It will take you to our stripe payment. Their you can complete your transaction.
          </p>
          <div className="m-t-24 d-flex align-center justify-flex-end gap-2">
            <Button type="text" onClick={() => setOpenCryptoToFiatModal(false)}>
              No Thanks
            </Button>
            <Button
              type="primary"
              className="f-15-20-500-text-white bg-brand-color border-blue-1"
              onClick={async () => {
                // const checkoutSessionUrl = await handleBuyToken(true);
                window.open(
                  ENV_CONFIGS.MOONPAY_SELL_URL +
                    `&baseCurrencyCode=eth&quoteCurrencyCode=EUR&redirectURL=${encodeURIComponent(window.location.href + '?stripe=true')}`,
                  '_blank',
                );
              }}
            >
              Proceed
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={openFiatToCryptoModal} closable footer={false} centered>
        <div className="p-24">
          <h3>This asset owner only accepts crypto</h3>
          <p>
            Please buy with crypto, If you don`t have enough crypto, Click proceed button, and setup or transfer crypto
            fund using moonpay. After that you can buy this asset using crypto.
          </p>

          <div className="m-t-24 d-flex align-center justify-flex-end gap-2">
            <Button type="text" onClick={() => setOpenFiatToCryptoModal(false)}>
              No Thanks
            </Button>
            <Button
              type="primary"
              className="f-15-20-500-text-white bg-brand-color border-blue-1"
              onClick={() => {
                window.open(
                  ENV_CONFIGS.MOONPAY_BUY_URL +
                    `&email=${user?.email}&redirectURL=${encodeURIComponent(window.location.href)}`,
                  '_blank',
                );
              }}
            >
              Proceed
            </Button>
          </div>
        </div>
      </Modal>
      <Modal open={openProcessingModal} closable={false} footer={false} centered>
        <div className="p-24">
          <h3>Processing...</h3>
          <p>Please wait, We are processing your crypto transaction to buy this asset.</p>
        </div>
      </Modal>
    </div>
  );
};

export default RightSection;
