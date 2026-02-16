import React from 'react';

import { dateFormatter } from '@/helpers/constants/date-formatter';

import { OwnershipInterface } from './interface';
import NoData from './no-data';

const Ownership = ({ ownership }: { ownership: OwnershipInterface[] }) => {
  const headers = ['Username', 'Tokens Owned', 'Date'];

  return (
    <div>
      {ownership && ownership.length > 0 ? (
        <>
          <div className="d-grid grid-cols-3 align-center">
            {headers.map((header, idx) => (
              <p key={idx} className="f-14-16-500-tertiary p-x-16 p-y-14">
                {header}
              </p>
            ))}
          </div>
          <div className="d-grid grid-cols-3 align-center">
            {ownership.map((item, idx) => (
              <React.Fragment key={idx}>
                <p className="p-y-20 p-x-16 f-14-16-500-secondary">{item.name}</p>
                <p className="p-y-20 p-x-16 f-14-16-500-secondary">{item.tokenCount}</p>
                <p className="p-y-20 p-x-16 f-14-16-500-secondary">{dateFormatter(item.purchasedDate)}</p>
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <NoData description="No Owners Yet" />
      )}
    </div>
  );
};

export default Ownership;
