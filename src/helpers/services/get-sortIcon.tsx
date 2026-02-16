import { SortOrder } from 'antd/es/table/interface';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
interface SortProps {
  sortOrder: SortOrder;
}
export const getSortIcon = ({ sortOrder }: SortProps) => {
  return sortOrder === 'ascend' ? (
    <ArrowUp className="img-16" />
  ) : sortOrder === 'descend' ? (
    <ArrowDown className="img-16" />
  ) : (
    <ArrowUpDown className="img-16" />
  );
};
