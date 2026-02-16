import { ASSET_STATUS, STATUS_TYPE } from '@/helpers/constants/asset-status';
import { AssetData, PriceHistory } from '@components/asset-details/interface';

interface CategoryInterface {
  _id: string;
  category: string;
}
export interface AssetInterface {
  _id: string;
  assetId: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  category: CategoryInterface;
  listedDate: string;
  images: string[];
  coverImage: string;
  documents: Document[];
  status: string;
  country: string;
  state: string;
  pincode: string;
  qrCode: string | null;
  tag: string | null;
  tokens: number;
  isVerified: boolean;
  verifiedBy: string | null;
  verificationDate: string | null;
  verificationRemarks: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  adminRemarks: string;
  rejectionCount: number;
}

interface assetData {
  data: AssetInterface[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface AssetsResponse {
  response_code: number;
  response_status: string;
  response: assetData;
  response_error: null;
}

export interface InitialAssetsState {
  approvedAssets: AssetInterface[];
  pendingAssets: AssetInterface[];
  rejectedAssets: AssetInterface[];
}

export interface CategoryData {
  _id: string;
  category: string;
}
export interface CategoryResponse {
  response_code: number;
  response_status: string;
  response: CategoryData[];
  response_error: null;
  approvedAssets: AssetInterface[];
  pendingAssets: AssetInterface[];
  rejectedAssets: AssetInterface[];
}

export interface VerifyAsset {
  bodyData: {
    assetId: string;
    status: ASSET_STATUS;
    remarks?: string;
    listedDate?: Date | null;
    tokens?: number;
  };
}

export interface AssetDraft {
  name: string;
  category: string;
  description: string;
  price: string;
  country: string;
  state: string;
  address: string;
  pincode: string;
  city: string;
  images: [];
  draftedDocuments: [];
}

export interface UpdateAssetApiResponse {
  response_code: number;
  response_status: string;
  response: string;
  response_error: null;
}

export interface UpdatedDocsList {
  name: string;
  url: string;
}

export interface AssetResponse {
  response_code: number;
  response_status: string;
  response: AssetData;
  response_error: null;
}

export interface AssetListResponse {
  response_code: number;
  response_status: string;
  response: {
    data: AssetData[];
    page: string;
    total: number;
    limit: string;
    totalPages: number;
  };
  response_error: null;
}

export interface AssetListStatusParams {
  status: STATUS_TYPE;
  search: string;
  category: string;
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  min: string;
  max: string;
  sortBy: string;
}

export interface AssetListParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  min: string;
  max: string;
  sortBy: string;
}

export interface BadgeCount {
  status: string;
  count: number;
}

interface Category {
  _id: string;
  category: string;
}

export interface BadgeCountResponse {
  response_code: number;
  response_status: string;
  response: BadgeCount[];
  response_error: null;
}

export interface CategoryListResponse {
  response_code: number;
  response_status: string;
  response: Category[];
  response_error: null;
}

export interface ExclusiveAccess {
  _id: string;
  userId: string;
  assetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExclusiveAssetResponse {
  response_code: number;
  response_status: string;
  response: ExclusiveAccess;
  response_error: null;
}

export interface PriceHistoryResponse {
  response_code: number;
  response_status: string;
  response: PriceHistory[];
  response_error: null;
}

export interface AssetDraftResponse {
  response_code: number;
  response_status: string;
  response: {
    data: AssetDraft[];
    total: number;
  };
  response_error: null;
}

export interface Notification {
  _id: string;
  receiverId: string;
  message: string;
  url: string;
  __v: number;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  response_code: number;
  response_status: string;
  response: Notification[];
  response_error: null;
}
export type userId = string;
export type id = string;
export type NotificationsParams = userId | id;

export interface CountResponse {
  response_code: number;
  response_status: string;
  response: { count: number };
  response_error: null;
}

export interface AssetId {
  id: string;
}

export interface FavouritesResponse {
  response_code: number;
  response_status: string;
  response: AssetData[];
  response_error: null;
}

export interface ListParams {
  type?: string;
  filterValues: Record<string, unknown>;
  paginationInfo: Record<string, unknown>;
}

export interface FavouritesParams {
  type?: string;
  filterValues: Record<string, unknown>;
  paginationInfo: Record<string, unknown>;
}

export interface AssetListingInterface {
  assetId: string;
  tokens: number;
  tokenPrice: number;
}

export interface AssetListingResponse {
  response_code: number;
  response_status: string;
  response: unknown;
  response_error: null;
}

export interface RewardsListInterface {
  assetId: AssetData;
  buyerId: string;
  rewardPoints: number;
  createdAt: string;
}

export interface createApplicantInterface {
  firstName: string;
  lastName: string;
  email: string;
}
export interface CreateApplicantResponse {
  response: {
    applicant_id: string;
  };
}

export interface verificationInterface {
  applicantId: string;
}

export interface verificationResponse {
  response: {
    form_id: string;
    form_url: string;
    verification_id: string;
    form_token: string;
    verification_attempts_left: number | null;
  };
}

export interface KycDocument {
  document_id: string;
  type: string;
  provider: string;
  status: string;
  document_number: string;
  additional_number: string | null;
  issue_date: string;
  expiry_date: string;
  issuing_authority: string;
  income_sources: unknown[];
  annual_income: string | null;
  transaction_amount: string | null;
  transaction_currency: string | null;
  transaction_datetime: string | null;
  transaction_purpose: string | null;
  origin_funds: string | null;
  card_number: string | null;
  account_number: string | null;
  portrait: string;
  front_side_id: string;
  front_side: string;
  front_side_size: number;
  front_side_signature: string | null;
  back_side_id: string;
  back_side: string;
  back_side_size: number;
  back_side_signature: string | null;
  other_side_1_id: string | null;
  other_side_1: string | null;
  other_side_1_size: number | null;
  origin_other_side_1: string | null;
  origin_other_side_1_size: number | null;
  other_side_1_signature: string | null;
  other_side_2_id: string | null;
  other_side_2: string | null;
  other_side_2_size: number | null;
  origin_other_side_2: string | null;
  origin_other_side_2_size: number | null;
  other_side_2_signature: string | null;
  other_side_3_id: string | null;
  other_side_3: string | null;
  other_side_3_size: number | null;
  origin_other_side_3: string | null;
  origin_other_side_3_size: number | null;
  other_side_3_signature: string | null;
  created_at: string;
  decline_reasons: string[];
}

export interface KycProfile {
  response: {
    applicant_id: string;
    external_applicant_id: string;
    type: string;
    created_at: string;
    profile_status: string;
    profile_comment: string | null;
    first_name: string;
    origin_first_name: string | null;
    middle_name: string;
    origin_middle_name: string | null;
    last_name: string;
    origin_last_name: string | null;
    residence_country: string;
    nationality: string | null;
    dob: string;
    gender: string;
    email: string;
    phone: string | null;
    phone_status: string | null;
    wallet_address: string | null;
    telegram_username: string | null;
    pep: string | null;
    custom_field_1: string | null;
    custom_field_2: string | null;
    custom_field_3: string | null;
    custom_field_4: string | null;
    custom_field_5: string | null;
    decline_reasons: string[];
    addresses: unknown[];
    documents: KycDocument[];
    questionnaires: unknown[];
    verification_status: string;
    verifications_count: string;
  };
}
