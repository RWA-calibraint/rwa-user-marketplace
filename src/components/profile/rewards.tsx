import Image from 'next/image';
import React from 'react';

import { dateFormatter } from '@/helpers/constants/date-formatter';
import { RewardsListInterface } from '@/redux/apis/interface';

const Rewards = ({ rewardList }: { rewardList: RewardsListInterface[] }) => {
  const total =
    Array.isArray(rewardList) && rewardList.length > 0 && rewardList.reduce((a, c) => a + c.rewardPoints, 0);

  return (
    <div className="d-flex flex-column gap-5">
      {/* Balance Section */}
      <div className="d-flex width-100 h-120 bg-hold-secondary gap-4 align-center p-18">
        <Image src="/icons/flash-circle.svg" alt="flash-icon" width={80} height={80} />
        <div className="d-flex flex-column  gap-1">
          <div className="f-24-26-700-hold">{total}</div>
          <div className="f-14-20-400-tertiary">Available balance</div>
        </div>
      </div>
      <div className="d-flex flex-column gap-5">
        <div className="f-14-16-400-tertiary">Recently Earned</div>

        {Array.isArray(rewardList) &&
          rewardList.length > 0 &&
          rewardList?.map((reward) => (
            <div className="d-flex gap-3 align-center" key={reward.assetId._id}>
              <Image
                src={reward.assetId.images[0]}
                alt="reward-image"
                width={80}
                height={80}
                className="radius-4 border-primary-1"
              />

              <div className="d-flex flex-column justify-center gap-2 w-700">
                <div className="f-14-16-500-primary">{reward.assetId.name}</div>
                <div className="f-14-16-400-tertiary">{dateFormatter(reward.createdAt)}</div>
              </div>

              <div className="d-flex flex-1 justify-end">
                <div className="f-16-18-600-green">+{reward.rewardPoints}</div>
              </div>
            </div>
          ))}

        <div className="width-100 border-secondary-1"></div>
      </div>
    </div>
  );
};

export default Rewards;
