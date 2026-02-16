import { Info } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface AlertBoxProps {
  children: ReactNode;
}

export const CustomAlertBox: FC<AlertBoxProps> = ({ children }) => (
  <div className="bg-brand radius-8 p-y-14 p-x-16" style={{ marginBottom: '16px' }}>
    <div className="text-sm f-14-16-500-b-s d-flex align-center">
      <Info className="img-16 m-r-8" />
      {children}
    </div>
  </div>
);
