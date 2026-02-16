import { Dispatch, SetStateAction } from 'react';

import { UserDetailsData } from '@/redux/utils/interfaces/user.interface';
import { ASSET_STATUS, STATUS } from '@helpers/constants/asset-status';
import { DOCUMENT_TYPE } from '@helpers/constants/document-types';

export type DocumentTypes =
  | DOCUMENT_TYPE.LAB_REPORTS
  | DOCUMENT_TYPE.CERTIFICATES
  | DOCUMENT_TYPE.LEGAL_HEIR_CERTIFICATES
  | DOCUMENT_TYPE.AWARDS
  | DOCUMENT_TYPE.PROOF_OF_OWNERSHIP
  | DOCUMENT_TYPE.NOC
  | DOCUMENT_TYPE.OTHERS;

export interface Document {
  _id: string;
  type: DocumentTypes;
  documentName: string;
  assetId: string;
  documentUrl: string;
  status: Status;
}
export type Status = STATUS.APPROVED | STATUS.PENDING | STATUS.REJECTED;

type AssetStatus =
  | ASSET_STATUS.LIVE
  | ASSET_STATUS.GOING_LIVE
  | ASSET_STATUS.NEWLY_ADDED
  | ASSET_STATUS.RE_SUBMITTED
  | ASSET_STATUS.SOLD
  | ASSET_STATUS.HOLD
  | ASSET_STATUS.DE_LISTED
  | ASSET_STATUS.DELETED
  | ASSET_STATUS.REJECTED
  | ASSET_STATUS.SUBMITTED
  | ASSET_STATUS.APPROVED;

interface SellerId {
  _id: string;
  firstName: string;
  lastName: string;
  walletAddress: string;
  stripeAccountId: string;
  createdAt: string;
}
interface Category {
  category: string;
  _id: string;
}

export interface PriceHistory {
  _id: string;
  assetId: string;
  year: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingInterface {
  _id: string;
  assetId: string;
  sellerId: UserDetailsData;
  tokenPrice: number;
  tokens: number;
  createdTokens: number;
  createdTokenPrice: number;
  userAsset?: boolean;
  createdAt: string;
  deletedAt: string;
  listingStatus?: string;
}

export interface OwnershipInterface {
  name: string;
  tokenCount: number;
  purchasedDate: string;
}

export interface AssetData {
  _id: string;
  assetId: string;
  name: string;
  description: string;
  price: number;
  priceHistory: PriceHistory[];
  sellerId: SellerId;
  category: Category;
  images: string[];
  coverImage: string;
  status: AssetStatus;
  country: string;
  state: string;
  address: string;
  pincode: string;
  locationUrl?: string;
  isVerified: boolean;
  tokens: number;
  adminRemarks?: string;
  listedDate: string;
  documents: Document[];
  __v: number;
  favourites?: number;
  city: string;
  createdAt: string;
  updatedAt: string;
  verificationDate?: string;
  sold?: boolean;
  soldAt?: Date;
  isAdminAsset: boolean;
  tokensBought: number;
  isFeaturedAsset: boolean;

  soldTokens: number;
  likesCount: number;
  isLiked: boolean;
  listings: ListingInterface[];
  listingActivity: ListingInterface[];
  availableTokens: number;
  listingId?: string;
  ContractListingId?: string;
  tokenAssetId?: string;
  availableListingTokens: number;
  assetOwners: OwnershipInterface[];
  contractTokenId: string;
  arweaveMetadataUrl: string;
  initialSeller: string;
}

export interface AssetDetailProps {
  assetData: AssetData;
  refetch?: () => Promise<unknown>;
}

export interface LeftSectionProps {
  images: string[];
  assetId: string;
  isLiked: boolean;
  refetch?: () => Promise<unknown>;
  likesCount: number;
}

export interface RightSectionProps {
  assetData: AssetData;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  selectedDocument: Document | null;
  setSelectedDocument: Dispatch<SetStateAction<Document | null>>;
  assetRefetch?: () => Promise<unknown>;
  getViewsCount?: {
    response: {
      count: number;
    };
  };
}

export interface PriceChartProps {
  priceHistory: PriceHistory[];
  onChange?: (value: string) => void;
  isLoading?: boolean;
}

interface PriceData {
  radius: [number, number, number, number];
  dataKey: string;
  name: string;
  color: string;
  value: number;
  payload: {
    year: string;
    price: string;
  };
  stroke: string;
  strokeWidth: string;
  hide: boolean;
}
export interface PriceChartPayload {
  active?: boolean;
  payload?: PriceData[];
  label?: string;
}

export interface AssetCardProps {
  asset: AssetData;
  isGrid: boolean;
  isFeatureAsset?: boolean;
  hasExclusiveAccess?: boolean;
  priceHistories?: PriceHistory[];
  fetchThePriceHistory?: () => void;
  handleGetExclusiveAccess?: (assetId: string) => void;
  isOne?: boolean;
}
