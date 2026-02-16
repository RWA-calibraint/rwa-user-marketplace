'use client';
import { ArrowLeftRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ASSET_STATUS } from '@/helpers/constants/asset-status';
import { getErrorMessage } from '@/helpers/services/get-error-message';
import { GridProps } from '@app/favourites/interface';
import { useToast } from '@helpers/notifications/toast.notification';
import { useAddFavouriteMutation } from '@redux/apis/asset.api';

export const GridViewCard = ({ item, showWishList, refetch }: GridProps) => {
  const [addToFavourites] = useAddFavouriteMutation();
  const { showErrorToast } = useToast();

  const handleFavouriteClick = async () => {
    try {
      await addToFavourites({ assetId: item._id });
      refetch?.();
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };
  const router = useRouter();

  return (
    <div className="border-secondary-1 p-14 radius-10 collection-grid-item-container position-relative d-flex flex-column gap-3">
      {showWishList && (
        <div
          className={`w-40 h-40 radius-100 p-10 bg-white position-absolute d-flex align-center icon-24-red justify-center cursor-pointer`}
          style={{ right: '25px', top: '25px', zIndex: 1 }}
          onClick={handleFavouriteClick}
        >
          <Heart className="position-absolute z-index-1" fill={'#ED1515'} size={24} />
        </div>
      )}
      <div className="position-relative">
        <Image
          src={item.images[0]}
          alt="Asset Image"
          width={250}
          height={250}
          className="grid-view-img radius-4 cursor-pointer"
          onClick={() => router.push(`/asset/${item.assetId}`)}
        />
        {item.status === ASSET_STATUS.SOLD && (
          <div
            className="position-absolute d-flex justify-center align-center top-0 left-0 radius-4 width-100 height-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <p className="f-16-22-600-white">Sold Out</p>
          </div>
        )}
      </div>
      <h3 className="f-16-22-600-secondary">{item.name}</h3>
      <p className="f-16-22-600-primary d-flex align-end">
        {item.tokens} <span className="m-l-4 f-14-22-600-secondary">TOKENS</span>
        <span className="m-x-10 position-relative top-2">
          <ArrowLeftRight size={16} />
        </span>
        ${item.price}
        <span className="m-l-4 f-14-22-600-secondary">USD</span>
      </p>
    </div>
  );
};
