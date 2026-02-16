import { SelectProps } from 'antd';
import { Dispatch, SetStateAction } from 'react';

import { DateRange } from '../date-picker/date-picker.interface';

export interface TableMenuComponentInterface {
  value: string;
  setSearchValue?: Dispatch<SetStateAction<string>>;
  onSearchBoxClear?: () => void;
  selectList: SelectOptions[];
  datePickerOptions: {
    enable?: boolean;
    onChange: (data: DateRange) => void;
  };
  onSearchValueChange: (value: string) => void;
  onResetClick?: () => void;
  loading?: boolean;
  className?: string;
}
export interface SelectOptions {
  title: string;
  className: string;
  options: SelectProps['options'];
  onChange: (categoryIds: string[]) => void;
}
