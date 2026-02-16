'use client';

import { Skeleton } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import './homepage.scss';
import useMediaQuery from '@/hooks/useMediaQuery';
import { AssetData } from '@components/asset-details/interface';
import { useToast } from '@helpers/notifications/toast.notification';
import { useGetLiveAssetsListQuery } from '@redux/apis/asset.api';

import 'swiper/css';
import 'swiper/css/navigation';
import AssetCard from './AssetCard';
import NoDataFound from './no-data';

function NewArrivals() {
  let layoutClass = '';

  const { data, isLoading, isFetching, error: assetError } = useGetLiveAssetsListQuery();

  const { showErrorToast } = useToast();

  const isMobile = useMediaQuery('mobile');

  const liveAsset = useMemo(() => (Array.isArray(data?.response) ? data?.response : []), [data?.response]);

  if (liveAsset.length === 4) layoutClass = 'gridFourPlus';
  else if (liveAsset.length === 3) layoutClass = 'gridThree';
  else layoutClass = 'gridTwo';

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [viewState, setViewState] = useState({
    isCarousel: false,
    isTwoOrLess: false,
    isOne: false,
    isGrid: false,
  });

  useEffect(() => {
    const isCarousel = liveAsset.length > 4;
    const isTwoOrLess = liveAsset.length <= 2;
    const isOne = liveAsset.length === 1;
    const isGrid = !isCarousel && !isTwoOrLess;

    setViewState({ isCarousel, isTwoOrLess, isOne, isGrid });
  }, [liveAsset]);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;

      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  const handleApiError = useCallback(
    (error: unknown, fallbackMsg: string) => {
      if (error) {
        showErrorToast(error as string, fallbackMsg);
      }
    },
    [showErrorToast],
  );

  useEffect(() => {
    handleApiError(assetError, 'Failed to fetch the featured asset.');
  }, [assetError, handleApiError]);

  if (assetError)
    return (
      <div className="d-flex justify-center align-center width-100 m-y-60 border-primary-1 radius-8 h-328">
        <h3 className="f-22-24-400-error-s">Oops something went wrong!!</h3>
      </div>
    );

  if (!liveAsset && !isLoading && !isFetching)
    return (
      <NoDataFound
        title="No Newly Added Assets Yet"
        description={`The admin hasn't highlighted any assets for now. Please check back later — Newly added assets will appear here once available!`}
      />
    );

  return (
    <div className="p-t-30 d-flex flex-column gap-6">
      <div className="d-flex flex-column gap-3">
        <div className={`${isMobile ? 'f-22-24-700-primary' : 'f-30-36-700-primary'}`}>
          New Arrivals &nbsp;
          {isLoading || isFetching || !liveAsset?.length
            ? ''
            : liveAsset.length > 4
              ? '(4+ assets)'
              : `(only ${liveAsset.length} ${liveAsset.length === 1 ? 'asset' : 'assets'})`}
        </div>
      </div>
      {liveAsset && !isLoading && !isFetching ? (
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
                  {liveAsset.length > 0 ? (
                    liveAsset.map((asset: AssetData, idx) => (
                      <SwiperSlide key={idx}>
                        <AssetCard asset={asset} isGrid={true} isFeatureAsset={false} />
                      </SwiperSlide>
                    ))
                  ) : (
                    <NoDataFound
                      title="No Newly Added Assets Yet"
                      description={`The admin hasn't highlighted any assets for now. Please check back later — Newly added assets will appear here once available!`}
                    />
                  )}
                </Swiper>
              </div>
            ) : viewState.isGrid ? (
              <div className={`assetsGrid ${layoutClass}`}>
                {liveAsset?.map((asset: AssetData, idx) => (
                  <AssetCard key={idx} asset={asset} isGrid={true} isFeatureAsset={false} />
                ))}
              </div>
            ) : (
              <>
                {liveAsset.length > 0 ? (
                  <div className={`assetsGrid ${layoutClass}`}>
                    {liveAsset?.map((asset: AssetData, idx) => (
                      <AssetCard
                        key={idx}
                        asset={asset}
                        isGrid={false}
                        isFeatureAsset={false}
                        isOne={viewState.isOne}
                      />
                    ))}
                  </div>
                ) : (
                  <NoDataFound
                    title="No Newly added Assets Yet"
                    description={`The admin hasn't highlighted any assets for now. Please check back later — Newly added assets will appear here once available!`}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <>
            {liveAsset.length > 0 ? (
              liveAsset.map((asset: AssetData, idx) => (
                <AssetCard key={idx} asset={asset} isGrid={true} isFeatureAsset={false} />
              ))
            ) : (
              <NoDataFound
                title="No Newly Added Assets Yet"
                description={`The admin hasn't highlighted any assets for now. Please check back later — Newly added assets will appear here once available!`}
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

export default NewArrivals;
