import { notification } from 'antd';
import { CheckCircle2Icon, CircleAlert } from 'lucide-react';

import { ERROR_MESSAGE } from './error-message';

export const showSuccessToast = (message: string) => {
  notification.error({
    message: message,
    icon: <CheckCircle2Icon style={{ color: 'green' }} />,
    placement: 'top',
    duration: 5,
    style: {
      textAlign: 'center',
      width: 350,
      borderRadius: '4px',
    },
  });
};

export const showErrorToast = (error: unknown) => {
  let errorMessage;

  if (error && typeof error === 'object') {
    if ('data' in error && typeof error.data === 'object' && error.data !== null) {
      errorMessage = (error.data as { message?: string }).message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
  }
  notification.error({
    message: errorMessage ?? ERROR_MESSAGE.DEFAULT,
    icon: <CircleAlert style={{ color: 'red' }} />,
    placement: 'top',
    duration: 5,
    style: {
      textAlign: 'center',
      width: 350,
      borderRadius: '4px',
      backgroundColor: '#FFF1F1',
    },
  });
};
