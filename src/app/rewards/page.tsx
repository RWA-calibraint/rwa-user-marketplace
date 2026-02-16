'use client';

import { Typography, Table, Col } from 'antd';

import { rewardPointsData } from '@/helpers/constants/reward-points-data';

import { RewardPointsData } from './interface';
import RewardBanner from './rewardBanner';

const { Title, Paragraph } = Typography;

export default function RewardPoints() {
  const data: RewardPointsData = rewardPointsData;

  const columns = data.pointsTable.headers.map((header, index) => ({
    title: header,
    dataIndex: index,
    key: index,
    render: (text: string) => <span>{text}</span>,
  }));

  const dataSource = data.pointsTable.rows.map((row, index) => {
    const record: Record<number, string> = {};

    row.forEach((cell, i) => {
      record[i] = cell;
    });

    return { key: index, ...record };
  });

  return (
    <div className="d-flex flex-column align-center justify-center bg-secondary p-x-80 p-y-60 gap-6">
      <div className="w-700 h-146 radius-8 bg-brand-bg">
        <RewardBanner />
      </div>

      <div className="w-700 h-863 radius-8 p-28 bg-white d-flex flex-column gap-5">
        {data.intro.map((item, idx) => (
          <div key={idx} className="d-flex flex-column gap-2">
            <Title className="f-16-20-500-primary" level={4}>
              {item.title}
            </Title>
            <Paragraph style={{ whiteSpace: 'pre-line' }} className="f-14-26-400-secondary">
              {item.content}
            </Paragraph>
          </div>
        ))}

        <Title className="f-14-20-400-secondary" level={5}>
          Points for user when they purchase tokens.
        </Title>
        <Table columns={columns} dataSource={dataSource} pagination={false} className="custom-table" />

        <div>
          <Title className="f-16-22-500-primary" level={4}>
            {data.levelUp.title}
          </Title>
          <div className="d-flex gap-2">
            {data.levelUp.levels.map((level, index) => (
              <Col className="d-flex w-290 h-120 bg-brand p-16 radius-8 gap-3" key={index}>
                <div className="d-flex flex-column gap-2">
                  <div className="f-15-22-500-primary">{level.title}</div>
                  <div className="f-14-26-400-secondary">{level.description}</div>
                </div>
              </Col>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
