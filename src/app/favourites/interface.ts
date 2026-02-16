import { AssetData } from '@/components/asset-details/interface';
import { CollectionListInterface } from '@/redux/utils/interfaces/collections-api.interface';

export interface GridProps {
  item: CollectionListInterface | AssetData;
  showWishList: boolean;
  refetch?: () => Promise<unknown>;
}
