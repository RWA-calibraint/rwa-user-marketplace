'use client';

import { Card } from 'antd';
import Image from 'next/image';

import useMediaQuery from '@/hooks/useMediaQuery';

function HowItWorks() {
  const isMobile = useMediaQuery('mobile');
  const howItWorksObject = [
    {
      id: '1',
      iconImage: '/icons/assets-icon.svg',
      description: 'List your assets on RareAgora approved by experts.',
    },
    {
      id: '2',
      iconImage: '/icons/convert-icon.svg',
      description: 'We convert your assets into secure, tradable digital tokens - backed by real value',
    },
    {
      id: '3',
      iconImage: '/icons/purchase-icon.svg',
      description: 'Purchase tokens from a curated collection of rare assets',
    },
    {
      id: '4',
      iconImage: '/icons/trade-icon.svg',
      description: 'Trade back your tokens freely in our dynamic marketplace to gain profit.',
    },
  ];

  const imageProps = !isMobile
    ? {
        src: '/rareagora.gif',
        width: 480,
        height: 460,
      }
    : {
        src: '/Illustration.svg',
        width: 311,
        height: 303,
      };

  return (
    <div className="p-y-60">
      <Card className="radius-12 bg-brand custom-card" variant="borderless">
        <div className="d-flex flex-column align-center justify-center gap-3">
          <span className="f-30-56-700-primary">
            How it <span className="f-30-56-700-b-s">Works</span>
          </span>
          <p className="f-17-24-500-tertiary">
            Discover exclusive, high-value assets carefully curated for collectors and investors.
          </p>
        </div>

        {/* Visualization Image */}
        <div className="grid-container">
          <Image
            {...imageProps}
            alt="Tokenization process visualization"
            unoptimized
            className="height-auto m-x-auto m-y-0"
          />

          {/* Steps grid */}
          <div>
            <div className="grid-content">
              {howItWorksObject.map((item, index) => (
                <div key={index} className="d-flex flex-column  border-light-blue-1 radius-6 p-24 gap-2">
                  <div
                    className={`d-flex align-center justify-center ${item.id !== '1' ? 'w-24 h-24 radius-100' : 'radius-6 gap-2 h-28 p-x-8'} bg-brand-secondary f-16-24-600-white-primary`}
                    style={{ placeSelf: 'flex-start' }}
                  >
                    {item.id === '1' ? 'STEP' : ''}
                    {item.id === '1' && '\u00A0'}
                    {item.id}
                  </div>
                  <div className="d-flex flex-column align-center justify-center gap-2">
                    <Image src={item.iconImage} alt={`Step ${item.id} icon`} width={48} height={48} />
                    <p className="f-14-0-400-primary text-center">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default HowItWorks;
