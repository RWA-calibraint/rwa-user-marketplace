export enum ASSET_STATUS {
  REJECTED = 'Rejected',
  SOLD = 'Sold',
  NEWLY_ADDED = 'Newly added',
  SUBMITTED = 'Submitted',
  DE_LISTED = 'Delisted',
  RE_SUBMITTED = 'Re-submitted',
  HOLD = 'Hold',
  GOING_LIVE = 'Going Live',
  DELETED = 'Deleted',
  LIVE = 'Live',
  APPROVED = 'Approved',
}

export enum STATUS {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  REMOVED = 'Removed',
}

export enum STATUS_TYPE {
  SUBMITTED = 'submitted',
  ADJUSTMENT_REQUIRED = 'adjustmentRequired',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SOLD = 'sold',
  HOLD = 'hold',
  DE_LIST = 'delist',
  DRAFT = 'draft',
}

export enum SUBMISSION_TYPE {
  EDIT = 'edit',
  DELETE = 'delete',
  VIEW = 'view',
}

export enum ASSET_TYPE {
  DELETE = 'delete',
}

export enum KYC {
  INITIATE = 'initiate',
  REVIEW = 'review',
}

export enum COLLECTION_TYPE {
  AssetCollected = 'AssetCollected',
  AssetSold = 'AssetSold',
  AssetListed = 'AssetListed',
}

export enum ASSSET_ACTION {
  SELL = 'sell',
  BUY = 'buy',
}
