import { Card, Steps } from 'antd';
import { FC } from 'react';

import { SellAssetMenuInterface } from './interface';

export const SellAssetMenuComponent: FC<SellAssetMenuInterface> = ({ currentForm }) => {
  return (
    <div className="d-flex align-center position-relative flex-column">
      <Card className="width-100 overflow-auto max-h-610 p-0">
        <h3 className="f-12-16-400-secondary p-y-8">ASSET</h3>
        <Steps
          direction="vertical"
          size="small"
          current={currentForm - 1}
          items={[
            { title: 'Details' },
            {
              title: 'Documents',
            },
            {
              title: 'Location',
            },
          ]}
        />
      </Card>
    </div>
  );
};
