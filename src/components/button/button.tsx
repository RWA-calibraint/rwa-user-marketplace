import { Button as AntdButton } from 'antd';
import { FC } from 'react';

import './styles.scss';

import { ButtonProps } from './button.interface';

const Button: FC<ButtonProps & { loading?: boolean }> = ({
  onClick,
  children,
  className = '',
  loading = false,
  htmlType = 'submit',
  disabled,
}) => {
  return (
    <AntdButton
      type="primary"
      htmlType={htmlType}
      onClick={onClick}
      className={`sign-in-button ${className}`}
      disabled={loading || disabled}
      loading={loading}
      tabIndex={0}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
