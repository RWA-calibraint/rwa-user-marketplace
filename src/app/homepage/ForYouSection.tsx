import { Button, Card } from 'antd';
import { Gift, Package, SearchCheck, Users } from 'lucide-react';
import Image from 'next/image';
import { SetStateAction } from 'react';

import HowItWorks from '@app/homepage/HowItWorks';
import useMediaQuery from '@hooks/useMediaQuery';

import FeatureAsset from './FeatureAsset';
import InfiniteVerticalScroll from './InfiniteScroll';
import NewArrivals from './NewArrivals';

interface ForYouLayoutProps {
  setActiveKey: React.Dispatch<SetStateAction<string>>;
}
function ForYouLayout({ setActiveKey }: ForYouLayoutProps) {
  const isMobile = useMediaQuery('mobile');
  const cardObject = [
    {
      id: '1',
      icon: <Gift />,
      title: 'Discover Rare Finds',
      description: 'Get exclusive access to unique assets.',
    },
    {
      id: '2',
      icon: <SearchCheck />,
      title: 'Verified by experts',
      description: 'Every asset is reviewed and appraised by our experts.',
    },
    {
      id: '3',
      icon: <Package />,
      title: 'Buyers Protection',
      description: 'Secure payments and verified sellers.',
    },
    {
      id: '4',
      icon: <Users />,
      title: 'Trusted by millions',
      description: 'Be part of a worldwide community of buyers & sellers.',
    },
  ];

  const categoryImgList = [
    {
      id: 1,
      imgPath: '/categories/Art.svg',
      title: 'ART',
    },
    {
      id: 2,
      imgPath: '/categories/RealEstate.svg',
      title: 'REAL ESTATE',
    },
    {
      id: 3,
      imgPath: '/categories/Coins.svg',
      title: 'COINS & STAMPS',
    },
    {
      id: 4,
      imgPath: '/categories/Cars.svg',
      title: 'CARS',
    },
    {
      id: 5,
      imgPath: '/categories/Luxury.svg',
      title: 'LUXURY',
    },
    {
      id: 6,
      imgPath: '/categories/Jewellery.svg',
      title: 'JEWELLERY',
    },
    {
      id: 7,
      imgPath: '/categories/Furniture.svg',
      title: 'FURNITURE',
    },
    {
      id: 8,
      imgPath: '/categories/Collectibles.svg',
      title: 'COLLECTIBLES',
    },
  ];

  return (
    <div>
      <div className="banner w-full h-screen gap-15 m-t-40 bg-notification">
        <div className="d-flex flex-column justify-center align-left items-center bg-gray-100 gap-4 banner-content">
          <div className="d-flex flex-column banner-text">
            <span className="f-18-20-400-secondary">
              Accessed only by <span className="f-18-20-400-b-s">Top 0.1%</span> earlier
            </span>
            <span className="f-40-56-700-primary">
              Own a piece of the<span className="f-40-56-700-b-s">&nbsp;Rarest High-Value Assets</span>
            </span>
          </div>
          <span className="f-18-27-400-secondary banner-text-span">
            RareAgora makes it available to everyone through &nbsp;
            <span className="f-18-27-400-b-s">fractional ownership</span>.
          </span>
          <div className="width-40">
            <Button
              type="primary"
              onClick={() => {
                setActiveKey('2');
              }}
            >
              Explore Rare Assets
            </Button>
          </div>
        </div>
        <div className="infiniteScrollWrapper">
          <InfiniteVerticalScroll />
        </div>
      </div>
      <FeatureAsset />
      <NewArrivals />
      <HowItWorks />
      <div className="p-y-60 d-flex flex-column gap-10">
        <div className="d-flex flex-column gap-3">
          <p className="f-30-36-700-primary d-flex justify-center">
            Why <span className="f-30-36-700-b-s">&nbsp;RareAgora?</span>
          </p>
          <p className="f-17-24-500-tertiary d-flex justify-center">
            Explore classical, modern and contemporary works by Picasso, Chagall and Joan Miró.
          </p>
        </div>

        <div className="card-object">
          {cardObject?.map(({ icon, title, description }, index) => (
            <Card key={index} className={`bg-card border-primary-1 radius-12`}>
              <div className={`d-flex flex-column ${isMobile ? 'gap-4' : 'gap-5'}`}>
                <div className="radius-8 p-10 bg-white w-48 h-48 d-flex align-center justify-center">
                  <p className="f-24-27-500-warning">{icon}</p>
                </div>
                <p className={`${isMobile ? 'f-18-26-600-primary' : 'f-30-36-600-primary'}`}>{title}</p>
                <p className={`${isMobile ? 'f-14-18-400-tertiary' : 'f-18-20-400-tertiary'}`}>{description}</p>
              </div>
            </Card>
          ))}
        </div>
        <p className={`${isMobile ? 'f-20-24-700-primary' : 'f-24-26-700-primary'}`}>Explore our categories</p>
        {isMobile ? (
          <div className="d-flex flex-column gap-4">
            <div className="d-flex flex-row gap-3" style={{ overflowX: 'auto' }}>
              {categoryImgList?.slice(0, 4).map(({ id, imgPath, title }) => (
                <div key={id}>
                  <Image src={imgPath} alt={title} width={150} height={150} className="radius-8" />
                </div>
              ))}
            </div>
            <div className="d-flex flex-row gap-3" style={{ overflowX: 'auto' }}>
              {categoryImgList?.slice(4, 8).map(({ id, imgPath, title }) => (
                <div key={id}>
                  <Image src={imgPath} alt={title} width={150} height={150} className="radius-8" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="d-flex flex-row gap-3" style={{ overflowX: 'auto' }}>
            {categoryImgList?.map(({ id, imgPath, title }) => (
              <div key={id}>
                <Image src={imgPath} alt={title} width={150} height={150} className="radius-8" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForYouLayout;
