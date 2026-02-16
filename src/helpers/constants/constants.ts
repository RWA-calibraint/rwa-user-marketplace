import { DOCUMENT_TYPE } from './document-types';

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const accordionSections = [
  { key: DOCUMENT_TYPE.CERTIFICATES, label: 'Certificates' },
  {
    key: DOCUMENT_TYPE.LEGAL_HEIR_CERTIFICATES,
    label: 'Legal heir certificate',
  },
  { key: DOCUMENT_TYPE.PROOF_OF_OWNERSHIP, label: 'Proof of ownership' },
  { key: DOCUMENT_TYPE.LAB_REPORTS, label: 'Lab Reports' },
  { key: DOCUMENT_TYPE.AWARDS, label: 'Any awards or government certificates' },
  { key: DOCUMENT_TYPE.NOC, label: 'NOC from countries with legal entities' },
  { key: DOCUMENT_TYPE.OTHERS, label: 'Other documents' },
];

export const STATUS_KEYS = [
  {
    key: 'Submitted',
    value: 'submitted',
  },
  {
    key: 'Adjustment Required',
    value: 'adjustmentRequired',
  },
  {
    key: 'Approved',
    value: 'approved',
  },
  {
    key: 'Rejected',
    value: 'rejected',
  },
  {
    key: 'Sold',
    value: 'sold',
  },
  {
    key: 'Hold asset',
    value: 'hold',
  },
  {
    key: 'Draft',
    value: 'draft',
  },
];

export const assets = [
  {
    id: '1',
    title: 'Cyber Spiral Sphere - Neo-Futurist Sculpture',
    image: '/images/landing-main-asset.png',
    priceUSD: '$1650',
    priceETH: '0.63 ETH',
    countdown: '62:39:08',
  },
  {
    id: '1',
    title: 'Cyber Spiral Sphere - Neo-Futurist Sculpture',
    image: '/images/painting1.jpg',
    priceUSD: '$1650',
    priceETH: '0.63 ETH',
    countdown: '62:39:08',
  },
  {
    id: '1',
    title: 'Cyber Spiral Sphere - Neo-Futurist Sculpture',
    image: '/images/painting2.jpg',
    priceUSD: '$1650',
    priceETH: '0.63 ETH',
    countdown: '62:39:08',
  },
  {
    id: '1',
    title: 'Cyber Spiral Sphere - Neo-Futurist Sculpture',
    image: '/images/painting3.jpg',
    priceUSD: '$1650',
    priceETH: '0.63 ETH',
    countdown: '62:39:08',
  },
];

export enum COLLECTION_VIEW_TYPE {
  LIST = 'list',
  GRID = 'grid',
}

export enum COLLECTION_TABS {
  COLLECTED = 'collected',
  FOR_SALE = 'for-sale',
  SOLD = 'sold',
}

export enum COLLECTION_TABLE_MENU_OPTIONS {
  VIEW_DETAILS = 'view-details',
  LIST_TOKENS = 'list-tokens',
  CANCEL_LISTING = 'cancel-listing',
}

export const stripeData = [
  {
    question: 'Why this is required?',
    answer:
      'To receive payouts from sales on Rare Agora, you need to connect your Stripe account. This ensures secure, direct, and timely transfers of your earnings.',
  },
  {
    question: `What you'll need`,
    list: [
      'A verified Stripe account (or create one during setup)',
      'Basic personal/business information (for KYC)',
      'Bank account details for payouts',
    ],
  },
  {
    question: 'What happens after connecting',
    list: [
      `You'll be able to list and sell assets on the marketplace`,
      `Payouts will be automatically handled via Stripe`,
      `You’ll gain access to your seller dashboard and transaction history`,
    ],
  },
];

export enum PAYMENT_STATUS {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export const kycConstants = {
  KYC_PENDING: 'We received your documents and your KYC verification is under process.',
  KYC_REJECTED: {
    NATIONAL_ID: "National ID doesn't look clear.Please try uploading it again.",
    LIVE_PHOTO: "Photo doesn't look clear.Please try uploading it again.",
  },
};
