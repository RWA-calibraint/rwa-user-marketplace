export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  categories?: string;
  searchValue?: string;
  from: string;
  to: string;
  paymentStatus?: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  transactionId: string;
  paymentStatus: string;
  paymentMethod: string;
  quantity: number;
  assetId: string;
  sellerId: string;
  buyerId: string;
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
  asset: Asset;
  category: Category;
  orderType: string;
  rewardPoints: number;
}

interface Asset {
  _id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  category: string;
  coverImage: string;
  images: string[];
  status: string;
  country: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  qrCode: string | null;
  tag: string | null;
  tokens: number;
  isVerified: boolean;
  verifiedBy: string | null;
  updatedBy: string | null;
  verificationDate: string | null;
  listedDate: string | null;
  isAdminAsset: boolean;
  assetId: string;
  createdAt: string;
  updatedAt: string;
  sold: boolean;
}

export interface Category {
  _id: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersDetailsResponse {
  response_code: number;
  response_status: string;
  response: {
    data: Transaction[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface BuyAssetBodyData {
  assetId: string;
  currency: string;
  tokenCount: string;
  listingId?: string;
}

export interface BuyAssetApiResponse {
  response_code: number;
  response_status: string;
  response: string;
  response_error: string;
}

export interface CreateStripeResponse {
  response_code: number;
  response_status: string;
  response: {
    url: string;
  };
  response_error: string;
}

export interface createStripeApi {
  email: string;
}
