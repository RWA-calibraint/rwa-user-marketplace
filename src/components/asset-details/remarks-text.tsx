import { Info } from 'lucide-react';

import { ASSET_STATUS } from '@helpers/constants/asset-status';
interface RemarksProps {
  remarks: string;
  status: ASSET_STATUS;
}
const RemarksText = ({ remarks, status }: RemarksProps) => {
  return (
    <div
      className={`d-flex align-center gap-2 p-x-12 p-y-12 radius-4 ${status === ASSET_STATUS.HOLD ? 'bg-hold-secondary' : 'bg-error-secondary'}`}
    >
      <div className="h-20 w-20 d-flex align-center">
        <Info size={20} className={`${status === ASSET_STATUS.HOLD ? 'f-14-20-400-hold' : 'f-14-20-400-error-s'}`} />
      </div>
      <p>{remarks}</p>
    </div>
  );
};

export default RemarksText;
