import { Divider } from 'antd';

import { useUsdToPolConverter } from '@/hooks/useUsdToPol';

interface NoOfTokensViewProps {
  value: number;
  record: Record<string, unknown>;
  index: number;
}

export const NoOfTokensView: React.FC<NoOfTokensViewProps> = ({ value, index }) => {
  const { convertUsdToPol } = useUsdToPolConverter();

  return (
    <div
      className={`position-absolute bg-white z-index-1051 p-12 token-view-popup radius-6 w-170 text-center left--44 ${index < 2 ? 'top-40' : 'top--160'}`}
    >
      <p className="f-12-16-400-tertiary m-b-6">Current Value</p>
      <h3 className="f-14-16-600-primary">${convertUsdToPol(value)} POL</h3>
      <Divider className="m-y-12" />
      <p className="f-12-16-400-tertiary m-b-6">purchased Value</p>
      <h3 className="f-14-16-600-primary m-b-12">${convertUsdToPol(value)} POL</h3>
      <h3
        className={`p-6 ${value < 0 ? 'f-14-16-500-err-text bg-status-outer-red' : 'f-14-16-500-success bg-secondary'} text-center radius-4`}
      >
        {value > 0 ? '+' : ''}
        {convertUsdToPol(value)} POL
      </h3>
    </div>
  );
};
