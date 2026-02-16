import { Dispatch, SetStateAction } from 'react';

export interface AuthModalProps {
  isOpen: boolean;
  setEmail: Dispatch<SetStateAction<string>>;
  type: 'login' | 'register' | 'forgot' | 'reset' | 'confirmSignup' | null;
  setModalType: Dispatch<SetStateAction<'login' | 'register' | 'forgot' | 'confirmSignup' | 'reset' | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface PasswordModalProps {
  isOpen: boolean;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  type: 'login' | 'register' | 'forgot' | 'reset' | 'confirmSignup' | null;
  setModalType: Dispatch<SetStateAction<'login' | 'register' | 'forgot' | 'confirmSignup' | 'reset' | null>>;
}

export interface AuthModalFormProps {
  open: boolean;
  setEmail: Dispatch<SetStateAction<string>>;
  type: 'login' | 'register' | 'forgot' | 'reset' | 'confirmSignup' | null;
  setModalType: Dispatch<SetStateAction<'login' | 'register' | 'forgot' | 'confirmSignup' | 'reset' | null>>;
  email: string;
  showDrawer?: () => void;
  onClose?: () => void;
}
