'use client';

import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatNumber } from '@helpers/services/number-formatter';

import { PriceChartPayload, PriceChartProps } from './interface';

const CustomTooltip = ({ active, payload, label }: PriceChartPayload) => {
  if (active && payload?.length) {
    return (
      <div
        className="d-flex align-center gap-3 p-x-12 p-y-8 border-primary-1 radius-8 justify-space-between bg-white"
        style={{ boxShadow: '3px 2px 2px rgba(0,0,0,0.1)' }}
      >
        <span className="h-10 w-10 radius-2 bg-tooltip-blue" />
        <p className="f-12-20-400-tertiary">{label}</p>
        <p>
          <span className="f-12-20-400-primary">${formatNumber(Number(payload[0]?.payload?.price))}</span>
        </p>
      </div>
    );
  }

  return null;
};

const PriceChartComponent = ({ priceHistory }: PriceChartProps) => {
  const [chartHeight, setChartHeight] = useState(170);

  useEffect(() => {
    const updateHeight = () => {
      const dynamicHeight = (170 / 880) * window.innerHeight;

      setChartHeight(dynamicHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const prices = priceHistory.map((item) => Number(item.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    <div className="p-y-20">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={priceHistory}>
          <XAxis
            dataKey="year"
            tickLine={false}
            tick={{
              fontSize: '12px',
              fill: '#01012E',
              color: '#60646C',
              fontWeight: '400',
            }}
            axisLine={{ stroke: 'white' }}
            padding={{ left: 10, right: 10 }}
            tickMargin={20}
          />
          <YAxis
            dataKey="price"
            hide={false}
            tickLine={false}
            axisLine={{ stroke: 'white' }}
            tick={{
              color: '#60646C',
              fontSize: '12px',
              fontWeight: '400',
            }}
            tickFormatter={(value) => formatNumber(value)}
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

export default PriceChartComponent;
