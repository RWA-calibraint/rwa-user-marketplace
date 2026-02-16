import { PriceHistory } from '../asset-details/interface';

interface Option {
  price: string;
  year: string;
}

export interface LineChartProps {
  options?: Option[];
  data: PriceHistory[];
  onChange?: (value: string) => void;
  dropDownChange?: (value: boolean) => void;
  open?: boolean;
}
