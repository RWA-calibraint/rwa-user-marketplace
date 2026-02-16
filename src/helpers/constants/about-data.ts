import { AboutData } from '@/app/aboutUs/interface';

export const AboutPageData: AboutData = {
  aboutUs: {
    label: 'About Us',
    description:
      'Rareagora is a groundbreaking platform that shatters traditional investment barriers, allowing everyday individuals to own fractional shares of rare, high-value assets previously reserved for the ultra-wealthy.',
  },

  investSection: {
    label: 'Invest',
    heading: 'Invest in Rare, Tokenized Assets',
    description:
      'Transforming exclusive collectibles into secure, accessible investment opportunities — vetted by experts with decades of experience.',
    sections: [
      {
        features: [
          {
            icon: '/icons/3dCube.svg',
            description: `Our innovative approach transforms exclusive investments that once required a  of <b>$500,000</b> into accessible, tokenized opportunities for a broader range of investors.`,
          },
          {
            icon: '/icons/users.svg',
            description: `Having experts who have experience of <b>3 decades</b> in handling and processing rare collectibles making rareagora most reliable and authentic platform to find assets that are vetted by experts`,
          },
        ],
      },
    ],
  },

  platformFeatures: {
    label: 'Platform Features',
    heading: 'Key Platform Features',
    description: 'Discover powerful features designed to simplify, secure, and expand your investment journey.',
    sections: [
      {
        cards: [
          {
            icon: '/icons/dollar.svg',
            title: 'Fractional Asset Ownership',
            points: [
              'Break down premium assets into tradable tokens.',
              'Invest in high-value properties, collectibles, and luxury items with minimal capital.',
              'Gain exposure to assets that traditionally required substantial upfront investment.',
            ],
          },
          {
            icon: '/icons/revenue.svg',
            title: 'Unique Investment Ecosystem',
            points: [
              'Curated selection of rare assets with potential for significant appreciation.',
              'Investments less correlated with conventional market fluctuations.',
              'Transparent tokenization process ensuring secure and verifiable ownership.',
            ],
          },
          {
            icon: '/icons/dollar_flower.svg',
            title: 'Opportunities for Asset Owners and Investors',
            points: [
              'For asset owners: Unlock liquidity and find diverse investor pools.',
              'For investors: Access exclusive markets with lower entry barriers.',
              'Flexible investment options tailored to individual financial goals.',
            ],
          },
        ],
      },
    ],
  },
};
