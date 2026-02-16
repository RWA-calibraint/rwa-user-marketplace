'use client';

import { Breadcrumb } from 'antd';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useToast } from '@helpers/notifications/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { formatNumber } from '@helpers/services/number-formatter';
import { useAddViewsMutation, useGetAllViewsQuery } from '@redux/apis/asset.api';

import { AssetDetailProps, Document } from './interface';
import LeftSection from './left-section';
import RightSection from './right-section';

const AssetDetailsPage = ({ assetData, refetch }: AssetDetailProps) => {
  const isMobile = useMediaQuery('mobile');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [addViews] = useAddViewsMutation();
  const { showErrorToast } = useToast();
  const { data: getViewsCount } = useGetAllViewsQuery({ id: assetData._id });

  useEffect(() => {
    async function addAssetViews() {
      try {
        await addViews({ id: assetData._id });
      } catch (error) {
        showErrorToast(error, getErrorMessage(error));
      }
    }
    addAssetViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container d-flex align-center justify-center">
      <div className="outer-container">
        <div className={`${isMobile ? 'm-b-10' : ''}`}>
          <Breadcrumb
            separator=">"
            items={[
              {
                title: 'Marketplace',
              },
              {
                title: `${assetData.category.category}`,
              },
              {
                title: `${assetData.name}`,
                // href: `/asset/${assetData.assetId}`,
              },
            ]}
          />
        </div>
        <div className="container">
          <div className="m-b-16 asset-mobile-title-container d-none">
            <div className="d-flex align-center m-b-16">
              <p className="f-16-20-400-tertiary border-primary-1 p-x-10 p-y-4 radius-6 m-r-10">#{assetData.assetId}</p>
              <p className="f-16-20-400-tertiary d-flex align-center">
                <Eye className="m-r-6" size={18} /> {formatNumber(getViewsCount?.response?.count ?? 0)} Views
              </p>
            </div>
            <h1 className="title">{assetData.name}</h1>
          </div>

          <LeftSection
            images={assetData?.images}
            assetId={assetData._id}
            isLiked={assetData.isLiked}
            likesCount={assetData.likesCount}
            refetch={refetch}
          />
          <RightSection
            assetData={assetData}
            isMenuOpen={isMenuOpen}
            selectedDocument={selectedDocument}
            setIsMenuOpen={setIsMenuOpen}
            setSelectedDocument={setSelectedDocument}
            assetRefetch={refetch}
            getViewsCount={getViewsCount}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsPage;
