import React from 'react';

import { dateFormatter } from '@/helpers/constants/date-formatter';

import { ListingInterface } from './interface';
import NoData from './no-data';

const Activity = ({ activity }: { activity: ListingInterface[] }) => {
  const headers = ['Event', 'Token Price', 'Tokens', 'Date'];

  return (
    <div>
      {activity && activity.length > 0 ? (
        <>
          <div className="d-grid grid-cols-4 align-center">
            {headers.map((header, idx) => (
              <p key={idx} className="f-14-16-500-tertiary p-x-16 p-y-14">
                {header}
              </p>
            ))}
          </div>
          <div className="d-grid grid-cols-4 align-center">
            {activity.map((item, idx) => (
              <React.Fragment key={idx}>
                <p className="p-y-20 p-x-16 f-14-16-500-secondary">{item.deletedAt ? 'Sale' : 'List'} </p>
                <p className="p-y-20 p-x-16 f-14-16-500-secondary">${item.createdTokenPrice}</p>
                <p className="p-y-20 p-x-16 f-14-16-500-secondary">{item.createdTokens}</p>
                <p className="p-y-20 p-x-16 f-14-16-500-secondary">{dateFormatter(item.createdAt)}</p>
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <NoData description="No Activity Yet" />
      )}
    </div>
  );
};

export default Activity;
