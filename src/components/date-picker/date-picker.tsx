'use client';

import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarDays } from 'lucide-react';

import { DateRange, DateRangeProps } from './date-picker.interface';

const DateRangePicker = ({
  onChange,
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  className = '',
  value,
  ...restProps
}: DateRangeProps) => {
  const { RangePicker } = DatePicker;

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (onChange) {
      const convertedDates: DateRange = dates ? [dates[0]?.toDate() || null, dates[1]?.toDate() || null] : null;

      onChange(convertedDates);
    }
  };

  return (
    <RangePicker
      className={className}
      value={value ? [value[0] ? dayjs(value[0]) : null, value[1] ? dayjs(value[1]) : null] : null}
      placeholder={[startPlaceholder, endPlaceholder]}
      onChange={handleDateChange}
      suffixIcon={<CalendarDays className="f-14-20-400-secondary img-16" />}
      inputReadOnly
      {...restProps}
    />
  );
};

export default DateRangePicker;
