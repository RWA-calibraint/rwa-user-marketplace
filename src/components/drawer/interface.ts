import { SetStateAction } from 'react';

import { Transaction } from '@/redux/utils/interfaces/payment-api.interface';

export interface DrawerProps {
  open: boolean;
  loading?: boolean;
  assetId?: string;
  closable?: boolean;
  handleClose: () => void;
  order: Transaction;
}

export interface NotificationDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  userId: string;
}
