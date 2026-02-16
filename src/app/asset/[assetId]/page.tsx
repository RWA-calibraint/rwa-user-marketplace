'use client';

import { useParams } from 'next/navigation';
import { useRef, useEffect } from 'react';

import mixpanel, { initMixpanel } from '@/helpers/constants/configs/mixpanel';
import ErrorPage from '@app/not-found';
import AssetDetailsPage from '@components/asset-details/asset-details';
import { AssetData } from '@components/asset-details/interface';
import AssetDetailsSkeleton from '@components/skeleton/asset-details-skeleton';
import { useGetAssetQuery } from '@redux/apis/asset.api';

const Page = () => {
  const startTimeRef = useRef<number | null>(null);
  const params = useParams();
  const assetId = params.assetId;

  const {
    data: assetData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAssetQuery(String(assetId), { refetchOnMountOrArgChange: true });

  const reportTimeSpent = () => {
    const startTime = startTimeRef.current;

    if (startTime !== null) {
      const durationMs = Date.now() - startTime;
      const durationSec = Math.floor(durationMs / 1000);

      mixpanel.track('time_spent_on_asset_page', {
        duration_seconds: durationSec,
      });
    }
  };

  useEffect(() => {
    initMixpanel();
    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => {
      reportTimeSpent();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (isLoading || isFetching) return <AssetDetailsSkeleton />;

  if (isError) return <ErrorPage />;

  return <AssetDetailsPage assetData={assetData?.response as AssetData} refetch={refetch} />;
};

export default Page;
