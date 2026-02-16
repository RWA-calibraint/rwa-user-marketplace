import { Dispatch, SetStateAction } from 'react';

export interface SearchBoxProps {
  placeHolder: string;
  autoFocus?: boolean;
  className?: string;
  value?: string;
  setSearchValue?: Dispatch<SetStateAction<string>>;
}
