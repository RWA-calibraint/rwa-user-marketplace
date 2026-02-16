import { Button as AntdButton } from 'antd';
import { FC } from 'react';

import '../styles.scss';

import { ButtonProps } from '../button.interface';

const CancelButton: FC<ButtonProps & { loading?: boolean }> = ({
  onClick,
  children,
  className = '',
  loading = false,
}) => {
  return (
    <AntdButton
      type="link"
      htmlType="submit"
      onClick={onClick}
      className={`cancel-button ${className}`}
      disabled={loading}
      loading={loading}
      tabIndex={0}
    >
      {children}
    </AntdButton>
  );
};

export default CancelButton;
