import { Plus } from 'lucide-react';

import './styles.scss';
import { EmptyStateProps } from './interface';

const EmptyState = ({ title, subtitle, buttonText, onButtonClick, icon, hasPlus }: EmptyStateProps) => {
  return (
    <div className="">
      <div className="width-80 d-flex align-center justify-center main-container gap-5">
        <div className="p-12 gap-3 radius-100 bg-hold-secondary">{icon}</div>
        <div className="gap-2 d-flex flex-column align-center justify-center">
          <div className="f-18-20-600-primary">{title}</div>
          <div className="f-16-20-400-tertiary text-center">{subtitle}</div>
        </div>
        <button
          className="d-flex align-center justify-center bg-brand-color radius-6 h-44 w-200 d-flex items-center gap-4 p-x-16 p-y-8 border-none cursor-pointer"
          onClick={onButtonClick}
        >
          {hasPlus && <Plus className="w-16 h-16 icon-2-white" fill="#FAFAFA" />}
          <div className="f-14-24-500-text-white">{buttonText}</div>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
