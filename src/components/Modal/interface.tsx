import { SetStateAction } from 'react';

import { ASSET_TYPE, ASSSET_ACTION, KYC, SUBMISSION_TYPE } from '@helpers/constants/asset-status';

export type ActionType =
  | SUBMISSION_TYPE.EDIT
  | SUBMISSION_TYPE.DELETE
  | SUBMISSION_TYPE.VIEW
  | ASSET_TYPE.DELETE
  | KYC.INITIATE
  | KYC.REVIEW;

export type ActionContent = {
  heading: string;
  description: string | ((name: string) => string);
};

export type ModalTypeContent = {
  [key: string]: ActionContent;
};

export interface ModalContent {
  Submission: {
    delete: ActionContent;
  };
  Asset: {
    delete: ActionContent;
  };
  KYC: {
    initiate: ActionContent;
    review: ActionContent;
  };
}

export interface ModalProps {
  type: string;
  isOpen: boolean;
  setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
  actionType: ActionType;
  className?: string;
  name?: string;
  closable?: boolean;
  setRemarksText?: React.Dispatch<SetStateAction<string>>;
  setTokens?: React.Dispatch<SetStateAction<string>>;
  listedDate?: Date | null;
  setListedDate?: React.Dispatch<SetStateAction<Date | null>>;
  handleConfirm: () => void;
  handleCancel: () => void;
  assetId?: string;
  hideCancelButton?: boolean;
}

export interface AssetModalProps {
  type: ASSSET_ACTION.BUY | ASSSET_ACTION.SELL;
  isOpen: boolean;
  className?: string;
  handleCancel: () => void;
  handleConfirm: () => void;
  closable?: boolean;
  price: number;
  tokens: number;
  setTokens: React.Dispatch<SetStateAction<number>>;
  availableListingTokens: number;
  availableTokens: number;
  setPrice: React.Dispatch<SetStateAction<number>>;
  totalTokens: number;
  assetPrice: number;
  paymentMethod: string;
  isTxLoading: boolean;
  setPaymentMethod: React.Dispatch<SetStateAction<string>>;
}

export interface BuyModalProps {
  isOpen: boolean;
  className?: string;
  handleCancel: () => void;
  handleConfirm: () => void;
  closable?: boolean;
  price: number;
  tokens: number;
  assetTokens: number;
  availableTokens: number;
}
