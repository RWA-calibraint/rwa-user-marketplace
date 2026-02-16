'use client';

import { Skeleton } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import './homepage.scss';
import { AssetData, PriceHistory } from '@/components/asset-details/interface';
import { useCookieListener } from '@/hooks/useCookieListener';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useToast } from '@helpers/notifications/toast.notification';
import {
  useFeatureAssetQuery,
  useLazyGetExclusiveAccessQuery,
  useLazyGetPriceHistoryQuery,
  useSubmitExclusiveAccessMutation,
} from '@redux/apis/asset.api';

import 'swiper/css';
import 'swiper/css/navigation';
import AssetCard from './AssetCard';
import NoDataFound from './no-data';

function FeatureAsset() {
  let layoutClass = '';

  const { data, isLoading, isFetching, error: featureAssetError } = useFeatureAssetQuery({});
  const [fetchExclusiveAccess, { error: exclusiveAssetError }] = useLazyGetExclusiveAccessQuery();
  const [fetchPriceHistory] = useLazyGetPriceHistoryQuery();
  const [submitExclusiveAccess, { error: submitExclusiveAccessError }] = useSubmitExclusiveAccessMutation();

  const accessTokenAdded = useCookieListener();
  const { showErrorToast } = useToast();

  const isMobile = useMediaQuery('mobile');

  const featureAsset = useMemo(() => (Array.isArray(data?.response) ? data?.response : []), [data?.response]);

  if (featureAsset.length === 4) layoutClass = 'gridFourPlus';
  else if (featureAsset.length === 3) layoutClass = 'gridThree';
  else layoutClass = 'gridTwo';

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const [exclusiveAccessMap, setExclusiveAccessMap] = useState<Record<string, boolean>>({});
  const [priceHistoryMap, setPriceHistoryMap] = useState<Record<string, PriceHistory[]>>({});
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [viewState, setViewState] = useState({
    isCarousel: false,
    isTwoOrLess: false,
    isOne: false,
    isGrid: false,
  });

  useEffect(() => {
    const isCarousel = featureAsset.length > 4;
    const isTwoOrLess = featureAsset.length <= 2;
    const isOne = featureAsset.length === 1;
    const isGrid = !isCarousel && !isTwoOrLess;

    setViewState({ isCarousel, isTwoOrLess, isOne, isGrid });
  }, [featureAsset]);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;

      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  useEffect(() => {
    if (!accessTokenAdded || featureAsset.length === 0) return;

    featureAsset.forEach(async (asset: AssetData) => {
      if (!exclusiveAccessMap[asset._id]) {
        try {
          const exclusiveData = await fetchExclusiveAccess(asset._id).unwrap();

          if (exclusiveData?.response) {
            setExclusiveAccessMap((prev) => ({ ...prev, [asset._id]: true }));
          }
        } catch (error) {
          showErrorToast(error as string, 'Failed to fetch exclusive access.');
        }
      }
      if (!priceHistoryMap[asset.assetId]) {
        try {
          const priceHistoryData = await fetchPriceHistory(asset.assetId).unwrap();

          if (priceHistoryData?.response) {
            setPriceHistoryMap((prev) => ({ ...prev, [asset.assetId]: priceHistoryData.response }));
          }
        } catch (error) {
          showErrorToast(error as string, 'Failed to fetch price history.');
        }
      }
    });
  }, [featureAsset, accessTokenAdded]);

  const handleGetExclusiveAccess = async (assetId: string) => {
    try {
      await submitExclusiveAccess({ assetId }).unwrap();
      setExclusiveAccessMap((prev) => ({ ...prev, [assetId]: true }));
    } catch (error) {
      showErrorToast(error as string, 'Failed to submit exclusive access.');
    }
  };

  const handleApiError = useCallback(
    (error: unknown, fallbackMsg: string) => {
      if (error) {
        showErrorToast(error as string, fallbackMsg);
      }
    },
    [showErrorToast],
  );

  useEffect(() => {
    handleApiError(featureAssetError, 'Failed to fetch the featured asset.');
  }, [featureAssetError, handleApiError]);

  useEffect(() => {
    handleApiError(submitExclusiveAccessError, 'Failed to submit exclusive access.');
  }, [handleApiError, submitExclusiveAccessError]);

  useEffect(() => {
    handleApiError(exclusiveAssetError, 'Failed to get exclusive asset access.');
  }, [exclusiveAssetError, handleApiError]);

  if (featureAssetError)
    return (
      <div className="d-flex justify-center align-center width-100 m-y-60 border-primary-1 radius-8 h-328">
        <h3 className="f-22-24-400-error-s">Oops something went wrong!!</h3>
      </div>
    );

  if (!featureAsset && !isLoading && !isFetching)
    return (
      <NoDataFound
        title="No Featured  Assets Yet"
        description={`The admin hasn't highlighted any assets for now. Please check back later — Featured  assets will appear here once available!`}
      />
    );

  return (
    <div className="p-y-60 d-flex flex-column gap-6">
      <div className="d-flex flex-column gap-3">
        <div className={`${isMobile ? 'f-22-24-700-primary' : 'f-30-36-700-primary'}`}>
          Featured Assets &nbsp;
          {isLoading || isFetching || !data?.response?.length
            ? ''
            : data.response.length > 4
              ? '(4+ assets)'
              : `(only ${data.response.length} ${data.response.length === 1 ? 'asset' : 'assets'})`}
        </div>
      </div>
      {featureAsset && !isLoading && !isFetching ? (
        !isMobile ? (
          <>
            {viewState.isCarousel ? (
              <div className="carouselWrapper">
                <button ref={prevRef} className="arrowLeft">
                  <ChevronLeft />
                </button>
                <button ref={nextRef} className="arrowRight">
                  <ChevronRight />
                </button>

                <Swiper
                  modules={[Navigation]}
                  onSwiper={setSwiperInstance}
                  spaceBetween={16}
                  slidesPerView={4}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                  }}
                >
                  {featureAsset.length > 0 ? (
                    featureAsset.map((asset: AssetData) => (
                      <SwiperSlide key={asset._id}>
                        <AssetCard
                          asset={asset}
                          isGrid={true}
                          hasExclusiveAccess={exclusiveAccessMap[asset._id] || false}
                          priceHistories={priceHistoryMap[asset.assetId] || []}
                          handleGetExclusiveAccess={() => handleGetExclusiveAccess(asset._id)}
                          fetchThePriceHistory={() => {}}
                        />
                      </SwiperSlide>
                    ))
                  ) : (
                    <NoDataFound
                      title="No Featured  Assets Yet"
                      description={`The admin hasn't highlighted any assets for now. Please check back later — Featured  assets will appear here once available!`}
                    />
                  )}
                </Swiper>
              </div>
            ) : viewState.isGrid ? (
              <>
                {featureAsset.length > 0 ? (
                  <div className={`assetsGrid ${layoutClass}`}>
                    {featureAsset?.map((asset: AssetData) => (
                      <AssetCard
                        key={asset._id}
                        asset={asset}
                        isGrid={true}
                        hasExclusiveAccess={exclusiveAccessMap[asset._id] || false}
                        priceHistories={priceHistoryMap[asset.assetId] || []}
                        handleGetExclusiveAccess={() => handleGetExclusiveAccess(asset._id)}
                        fetchThePriceHistory={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <NoDataFound
                    title="No Featured  Assets Yet"
                    description={`The admin hasn't highlighted any assets for now. Please check back later — Featured  assets will appear here once available!`}
                  />
                )}
              </>
            ) : (
              <>
                {featureAsset.length > 0 ? (
                  <div className={`assetsGrid ${layoutClass}`}>
                    {featureAsset?.map((asset: AssetData) => (
                      <AssetCard
                        key={asset._id}
                        asset={asset}
                        isGrid={false}
                        hasExclusiveAccess={exclusiveAccessMap[asset._id] || false}
                        priceHistories={priceHistoryMap[asset.assetId] || []}
                        handleGetExclusiveAccess={() => handleGetExclusiveAccess(asset._id)}
                        fetchThePriceHistory={() => {}}
                        isOne={viewState.isOne}
                      />
                    ))}
                  </div>
                ) : (
                  <NoDataFound
                    title="No Featured  Assets Yet"
                    description={`The admin hasn't highlighted any assets for now. Please check back later — Featured  assets will appear here once available!`}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <>
            {featureAsset.length > 0 ? (
              featureAsset.map((asset: AssetData, index: number) => (
                <AssetCard key={index} asset={asset} isGrid={true} isFeatureAsset={false} />
              ))
            ) : (
              <NoDataFound
                title="No Featured  Assets Yet"
                description={`The admin hasn't highlighted any assets for now. Please check back later — Featured  assets will appear here once available!`}
                isMobile={isMobile}
              />
            )}
          </>
        )
      ) : (
        <div className="d-flex justify-space-between gap-9 width-100 m-t-20">
          <div className="width-50 h-fit border-primary-1 p-14 radius-8">
            <div className="d-flex gap-4">
              <Skeleton.Avatar shape="square" size={270} active />
              <div className="d-flex flex-column width-100">
                <Skeleton.Input className="m-b-8" active size="small" />
                <Skeleton.Input className="m-b-8" active size="default" />
                <Skeleton.Input className="m-b-8" active size="default" />
                <Skeleton paragraph={{ rows: 2 }} active />
              </div>
            </div>
          </div>
          {/* Right side section  */}
          <div className="d-flex width-50 align-center justify-center radius-8 bg-brand border-none p-14">
            <div className="d-flex flex-column width-100 text-center">
              <Skeleton.Input className="m-b-10" active size="large" />
              <div className="d-flex justify-center">
                <Skeleton
                  paragraph={{ rows: 1, width: 140, className: 'feature-asset' }}
                  active
                  className="feature-asset"
                />
              </div>
              <Skeleton.Input className="m-t-16" active size="large" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeatureAsset;
