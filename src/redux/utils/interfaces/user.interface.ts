export interface UserDetailsData {
  _id?: string;
  email?: string;
  pasword?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  building?: string;
  postalCode?: string;
  stripeAccountId?: string;
  rewardPoints?: number;
  firstName?: string;
  lastName?: string;
  applicantId?: string;
  kycVerified?: string;
  kytServiceRequest?: string;
  kycVerificationDetails?: string;
}

export interface updateWalletAddress {
  walletAddress: string;
}

export interface VerifyCryptoAddressResponse {
  requestPublicId: string;
}

export interface ErrorResponse {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: any;
    response: null | string;
    response_code: number;
    response_error: string;
    response_status: string;
  };
  status: number;
}
