import Image from 'next/image';

import { AboutPageData } from '@/helpers/constants/about-data';

import ContactUs from '../contactUs/page';

import { AboutData } from './interface';
const AboutUs = () => {
  const data: AboutData = AboutPageData;

  return (
    <>
      <div className="d-flex flex-column p-x-100 p-y-80 gap-25 align-center">
        <div className="d-flex gap-15 p-80 radius-10 w-1300 h-420 bg-notification">
          <div className="d-flex flex-column gap-6 w-700">
            <p className="f-18-20-400-tertiary">{data.aboutUs?.label}</p>
            <span className="f-40-56-600-primary">
              <span className="f-40-56-600-hold">Rareagora:</span>
              &nbsp;Revolutionising Exclusive Asset Ownership
            </span>
            <p className="f-18-30-400-secondary">{data.aboutUs?.description}</p>
          </div>
          <Image src="/images/aboutus-blockchain.png" alt={'about-us'} width={476} height={300} />
        </div>

        <div className="d-flex w-1300 h-258 gap-20">
          <div className="d-flex flex-column gap-4 w-400">
            <span className="f-40-56-600-primary">
              Invest in Rare,&nbsp;
              <span className="f-40-56-600-hold"> Tokenized </span>
              &nbsp;Assets
            </span>
            <p className="f-16-26-400-secondary">{data.investSection?.description}</p>
            <Image src="/icons/aboutUs-cube.svg" width={150} height={124} alt={''} />
          </div>
          <div className="d-flex gap-6 p-y-28">
            {data.investSection?.sections[0].features?.map((feature, index) => (
              <div key={index} className="d-flex flex-column gap-5 w-400 radius-12 p-24 border-secondary-1">
                <Image src={feature.icon} alt={`feature-${index}`} width={64} height={64} />
                <p
                  className="d-block f-16-26-400-secondary"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex flex-column w-1300 gap-15">
          <div className="d-flex flex-column align-center gap-3">
            <span className="f-40-42-700-primary">
              Key Platform<span className="f-40-42-700-hold">&nbsp;Features</span>
            </span>
            <p className="f-16-26-400-tertiary">{data.platformFeatures?.description}</p>
          </div>

          <div className="d-flex w-1300 gap-5 h-392">
            {data.platformFeatures?.sections[0].cards?.map((card, index) => (
              <div key={index} className="d-flex flex-column gap-5 p-24 radius-12 bg-hold-secondary w-410 h-392">
                <Image src={card.icon} alt={`card-${index}`} width={60} height={60} />
                <p className="f-20-30-600-primary">{card.title}</p>
                <div className="f-16-30-400-secondary d-flex flex-column gap-3 ">
                  {card.points.map((point, idx) => (
                    <div key={idx}>{point}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ContactUs />
    </>
  );
};

export default AboutUs;
