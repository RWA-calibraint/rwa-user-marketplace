import { ReactNode } from 'react';

export interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
}
