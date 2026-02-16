import { KYC_STATUS } from '../constants/user-status';

export const isKycVerified = (user: { kycVerificationStatus?: string } | null | undefined) => {
  if (!user) return false;

  return user.kycVerificationStatus === KYC_STATUS.VERIFIED;
};
