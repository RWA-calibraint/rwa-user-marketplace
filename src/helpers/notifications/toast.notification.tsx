'use client';

import { notification } from 'antd';
import { CheckCircle2, CircleAlert } from 'lucide-react';
import { createContext, ReactNode, useContext, useRef } from 'react';

export interface ToastContextType {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: unknown, fallback: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  const isErrorThrottled = useRef(false);
  const isSuccessThrottled = useRef(false);

  const showSuccessToast = (message: string) => {
    if (isSuccessThrottled.current) return;

    api.success({
      message,
      placement: 'top',
      duration: 5,
      icon: <CheckCircle2 size={20} />,
      style: {
        height: 'auto',
        minHeight: 'fit-content',
      },
    });

    isSuccessThrottled.current = true;

    setTimeout(() => {
      isSuccessThrottled.current = false;
    }, 5000);
  };

  const showErrorToast = (error: unknown, fallbackMsg = 'Something went wrong') => {
    let errorMessage: string | undefined;

    if (isErrorThrottled.current) return;

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      if ('data' in error && typeof error.data === 'object' && error.data !== null) {
        errorMessage = (error.data as { message?: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    }

    api.error({
      message: errorMessage || fallbackMsg,
      placement: 'top',
      duration: 5,
      type: 'info',
      icon: <CircleAlert size={20} />,
      style: {
        height: 'auto',
        minHeight: 'fit-content',
      },
    });

    isErrorThrottled.current = true;
    setTimeout(() => {
      isErrorThrottled.current = false;
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showSuccessToast, showErrorToast }}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
