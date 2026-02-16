import { Dispatch, SetStateAction } from 'react';

export interface TimerInterface {
  date: string;
  className?: string;
  setIsExpired: Dispatch<SetStateAction<boolean>>;
  labelClassName?: string;
}
