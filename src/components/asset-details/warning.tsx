import { Info } from 'lucide-react';

const Warning = () => {
  return (
    <div className="bg-warning p-x-12 p-y-12 width-100 d-flex gap-2 m-b-10 radius-6">
      <Info className="f-14-22-400-warning-secondary" size={30} />
      <div className="d-flex flex-column">
        <p className="f-14-22-400-secondary">We are enthusiastic about supporting more purchases, please contact</p>
        <span className="f-14-22-500-warning-secondary">support@rareagora.com</span>
      </div>
    </div>
  );
};

export default Warning;
