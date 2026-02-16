'use client';

import { Image as AntImage } from 'antd';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { showErrorToast } from '@helpers/constants/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import useMediaQuery from '@hooks/useMediaQuery';
import { useAddFavouriteMutation } from '@redux/apis/asset.api';

import { LeftSectionProps } from './interface';

const LeftSection = ({ images, assetId, isLiked, likesCount, refetch }: LeftSectionProps) => {
  const isMobile = useMediaQuery('mobile');
  const [addToFavourites] = useAddFavouriteMutation();
  const [selectedImage, setSelectedImage] = useState<string | undefined | null>(images[0]);

  const [index, setIndex] = useState({
    start: 0,
    end: 4,
  });

  const handleShowNextImages = () => {
    if (index.end < images.length) {
      setIndex((prev) => ({
        start: prev.start + 1,
        end: prev.end + 1,
      }));
    }
  };

  const handleShowPreviousImages = () => {
    if (index.start > 0) {
      setIndex((prev) => ({
        start: prev.start - 1,
        end: prev.end - 1,
      }));
    }
  };

  const handleFavouriteClick = async () => {
    try {
      await addToFavourites({ assetId: assetId });
      refetch?.();
    } catch (error) {
      showErrorToast(getErrorMessage(error));
    }
  };

  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];

  return (
    <div className="left-section">
      <div className="images-section">
        <div className="thumbnails">
          {images.slice(index.start, index.end).map((thumb, i) => {
            const isVideo = videoExtensions.some((ext) => thumb.toLowerCase().endsWith(ext));

            return (
              <div
                key={i}
                className={`${
                  thumb === selectedImage ? 'border-selected-image-3' : ''
                } thumbnail-image radius-6 cursor-pointer img-fit-contain width-100`}
                style={{ borderRadius: '6px' }}
              >
                <div className="d-flex align-center justify-center height-100">
                  {isVideo ? (
                    <video
                      onClick={() => setSelectedImage(thumb)}
                      width={86}
                      height={86}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        overflow: 'hidden',
                        maxHeight: '100px',
                      }}
                    >
                      <source src={thumb} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      onClick={() => setSelectedImage(thumb)}
                      src={thumb}
                      alt={`Thumbnail ${i + 1}`}
                      width={86}
                      height={86}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        overflow: 'hidden',
                        maxHeight: '100px',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {/*Images navigation menu*/}
          {index.end < images.length && (
            <button
              style={{
                position: 'absolute',
                bottom: '0',
                width: '100%',
                height: '7%',
              }}
              className="bg-secondary cursor-pointer border-primary-1 radius-4"
              onClick={handleShowNextImages}
              aria-label="Show next images"
            >
              <ChevronDown size={20} />
            </button>
          )}
          {index.start > 0 && (
            <button
              style={{
                position: 'absolute',
                top: '0',
                width: '100%',
                height: '7%',
              }}
              className="bg-secondary cursor-pointer border-primary-1 radius-4"
              onClick={handleShowPreviousImages}
              aria-label="Show previous images"
            >
              <ChevronUp size={20} />
            </button>
          )}
        </div>
        <div className={`${isMobile ? 'width-100' : 'width-80'}`}>
          <div
            className="w-82 radius-40 p-x-10 p-y-6 bg-white position-absolute d-flex align-center jsutidy-space-between gap-2 z-index-1"
            style={{ right: '10px', top: '15px' }}
          >
            <div className="d-flex gap-2 align-center">
              <Heart
                className={`position-absolute z-index-1 cursor-pointer ${isLiked ? 'icon-24-red' : 'icon-24-blue'}`}
                size={24}
                fill={`${isLiked ? '#ED1515' : '#fff'}`}
                onClick={handleFavouriteClick}
              />
              <p className="f-14-26-400-primary z-index-1 position-relative left-35">{likesCount ?? 0}</p>
            </div>
          </div>
          {videoExtensions.some((ext) => selectedImage?.toLowerCase().endsWith(ext)) ? (
            <video controls width="100%" height="100%" className="main-image width-100">
              <source src={selectedImage || ''} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <AntImage
              src={selectedImage || ''}
              alt={`${selectedImage}-image`}
              width={'100%'}
              height={'100%'}
              className="main-image width-80"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
