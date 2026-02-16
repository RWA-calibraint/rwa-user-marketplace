import { AssetData } from '@components/asset-details/interface';
import { ASSET_STATUS } from '@helpers/constants/asset-status';

interface CollectionsCountInterface {
  AssetCollected: number;
  AssetListed: number;
  AssetSold: number;
}

export interface CollectionListInterface {
  [key: string]: unknown;
  images: string[];
  name: string;
  tokens: number;
  price: number;
  assetId: string;
  asset: AssetData;
  status: ASSET_STATUS;
}

export interface CollectionsCountResponse {
  response_code: number;
  response_status: string;
  response: CollectionsCountInterface;
  response_error: string;
}

export interface CollectionsListResponse {
  response_code: number;
  response_status: string;
  response: {
    assets: CollectionListInterface[];
    totalAssets: number;
  };
  response_error: string;
}

export interface FavouritesResponse {
  response_code: number;
  response_status: string;
  response: {
    assets: CollectionListInterface[];
    totalAssets: number;
  };
  response_error: string;
}
