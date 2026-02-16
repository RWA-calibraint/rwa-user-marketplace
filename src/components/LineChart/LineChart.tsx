'use client';

import { FC } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';

import { formatNumber } from '@/helpers/services/number-formatter';

import { LineChartProps } from './LineChart.interface';

const LineChartComponent = ({ data }: LineChartProps) => {
  const chartHeight = 264;

  const CustomTooltip: FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="p-8 bg-white border-1 radius-8 border-primary-1 d-flex align-center">
          <div className="w-10 h-10 bg-brand-secondary m-r-8 radius-2"></div>

          <p className="f-12-14-400-primary">
            <span className="f-12-14-400-tertiary">{payload[0].payload.month}</span> &nbsp;$
            {payload[0]?.value ? payload[0].value / 1000 + 'K' : '0K'}
          </p>
        </div>
      );
    }

    return null;
  };

  const prices = data.map((item) => Number(item.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    <div className="p-20 bg-brand radius-12 height-100 width-100 d-flex flex-column justify-space-between">
      <div className="d-flex align-center justify-space-between m-b-4">
        <h3 className="f-18-30-600-">Asset Value Over Time</h3>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data}>
          <XAxis
            dataKey="year"
            tickLine={false}
            tick={{ fontSize: '12px', fill: '#01012E', color: '#60646C', fontWeight: '400' }}
            axisLine={{ stroke: 'white' }}
            padding={{ left: 10, right: 10 }}
            tickMargin={20}
          />
          <YAxis
            dataKey="price"
            tickFormatter={(value) => formatNumber(value)}
            hide={false}
            tickLine={false}
            axisLine={{ stroke: 'white' }}
            tick={{
              color: '#60646C',
              fontSize: '12px',
              fontWeight: '400',
            }}
            domain={[min, max]}
            label={{
              value: 'USD $',
              angle: -90,
              position: 'insideLeft',
              color: '#3F3F46',
              fontWeight: '600',
              style: {
                textAnchor: 'middle',
                fill: '#3F3F46',
                fontSize: 12,
              },
            }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ddd', strokeWidth: 1 }} />
          <CartesianGrid vertical={false} />
          <Line
            type="linear"
            dataKey="price"
            stroke="#1B7FAE"
            strokeWidth={2}
            dot={false}
            style={{ cursor: 'pointer' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
