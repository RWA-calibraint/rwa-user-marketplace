import { Dispatch, SetStateAction } from 'react';

export interface ProfileDropdownProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

type VerificationStatus = {
  verified: boolean;
  comment: string;
  decline_reasons: unknown[];
};

export type VerificationsType = {
  profile?: VerificationStatus;
  document?: VerificationStatus;
  facial?: VerificationStatus;
};
