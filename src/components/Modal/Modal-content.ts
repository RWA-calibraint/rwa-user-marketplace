import { ASSET_TYPE, KYC, SUBMISSION_TYPE } from '@/helpers/constants/asset-status';

import { ModalContent } from './interface';

export const modalContent: ModalContent = {
  Submission: {
    [SUBMISSION_TYPE.DELETE]: {
      heading: 'Delete Asset',
      description: `Are you sure you want to delete this asset from the list? The asset will not be shown on the marketplace..`,
    },
  },
  Asset: {
    [ASSET_TYPE.DELETE]: {
      heading: 'Delete Listings',
      description: `Are you sure you want to delete this listing? The listing will not be shown on the asset..`,
    },
  },
  KYC: {
    [KYC.INITIATE]: {
      heading: 'Verify your Identity',
      description: `It is necessary to complete KYC Verification before you can purchase or sell assets in RareAgora Marketplace`,
    },
    [KYC.REVIEW]: {
      heading: 'Reviewing your Identity',
      description: `We have received your KYC documents. It will take approximately 6 to 7 hours for your KYC to be approved. Once approved, you can start buying or selling assets.`,
    },
  },
};
