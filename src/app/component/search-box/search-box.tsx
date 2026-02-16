import { Input } from 'antd';
import { Search, X } from 'lucide-react';
import { FC } from 'react';

import { SearchBoxProps } from './search-box.interface';

export const SearchBox: FC<SearchBoxProps> = ({
  placeHolder,
  className = '',
  value = '',
  autoFocus = true,
  onChange,
  onClear,
  onKeyDown,
}) => {
  return (
    <Input
      value={value}
      autoFocus={autoFocus}
      className={`${className} bg-white`}
      placeholder={placeHolder}
      onChange={({ target: { value } }) => onChange(value)}
      prefix={<Search />}
      suffix={
        value.length > 0 ? (
          <X
            className="cursor-pointer"
            onClick={() => {
              onClear?.();
            }}
          />
        ) : null
      }
      onKeyDown={({ key }) => onKeyDown?.(key)}
    />
  );
};
