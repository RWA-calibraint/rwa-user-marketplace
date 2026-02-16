import { ASSET_STATUS } from '@/helpers/constants/asset-status';
import { dateFormatter } from '@/helpers/services/date-formatter';

interface AddressSectionProps {
  country: string;
  city: string;
  pincode: string;
  submittedDate?: string;
  otherDateType?: string;
  otherDate?: string;
  showDates?: boolean;
}

const AddressSection = ({
  country,
  city,
  pincode,
  showDates,
  submittedDate,
  otherDateType,
  otherDate,
}: AddressSectionProps) => {
  return (
    <div className="p-y-20 d-flex flex-column gap-3">
      <h3 className="f-14-22-600-primary">Asset Details</h3>
      <div className="p-t-8 d-grid grid-cols-3 gap-6">
        <div className="d-flex flex-column gap-1">
          <p className="f-12-20-400-tertiary">COUNTRY</p>
          <p className="f-14-22-600-secondary">{country}</p>
        </div>
        <div className="d-flex flex-column gap-1">
          <p className="f-12-20-400-tertiary">TOWN/CITY</p>
          <p className="f-14-22-600-secondary">{city}</p>
        </div>
        <div className="d-flex flex-column gap-1">
          <p className="f-12-20-400-tertiary">POSTAL CODE</p>
          <p className="f-14-22-600-secondary">{pincode}</p>
        </div>
        {showDates && (
          <div>
            <p className="f-12-20-400-tertiary">SUBMITTED DATE</p>
            {submittedDate && <p className="f-14-22-600-secondary">{dateFormatter(submittedDate)}</p>}
          </div>
        )}
        {showDates &&
          (otherDateType !== ASSET_STATUS.SUBMITTED.toUpperCase() ||
            otherDateType !== ASSET_STATUS.LIVE.toUpperCase()) && (
            <div>
              {otherDateType?.toUpperCase() !== 'NEWLY ADDED' && (
                <p className="f-12-20-400-tertiary">{otherDateType}&nbsp;DATE</p>
              )}
              {otherDate && <p className="f-14-22-600-secondary">{dateFormatter(otherDate)}</p>}
            </div>
          )}
      </div>
    </div>
  );
};

export default AddressSection;
