'use client';

import { Select } from 'antd';
import { X } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import './style.scss';

import { SearchBox } from '@app/component/search-box/search-box';
import DateRangePicker from '@components/date-picker/date-picker';

import { DateRange } from '../date-picker/date-picker.interface';

import { TableMenuComponentInterface } from './table.menu.interface';

export const TableMenuComponents: FC<TableMenuComponentInterface> = ({
  value,
  selectList,
  datePickerOptions,
  onSearchValueChange,
  onSearchBoxClear,
  onResetClick,
  className,
}) => {
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);

  useMemo(() => {
    setFiltersApplied(
      value.length > 0 ||
        Object.values(selectedValues).some((values) => values.length > 0) ||
        (selectedDate !== null && selectedDate.some((date) => date !== null)),
    );
  }, [value, selectedValues, selectedDate]);

  const handleSelectChange = (title: string, values: string[]) => {
    setSelectedValues((prev) => ({ ...prev, [title]: values }));
  };

  const handleReset = () => {
    setSelectedValues({});
    setSelectedDate(null);
    setFiltersApplied(false);
    onResetClick?.();
  };

  return (
    <div className={`d-flex flex-row justify-space-between align-center m-t-20 gap-3 flex-wrap-wrap ${className}`}>
      <div className="d-flex align-center gap-3">
        <SearchBox
          placeHolder="Search"
          className="w-300 h-44"
          value={value}
          autoFocus={false}
          onChange={(value) => {
            onSearchValueChange(value);
          }}
          onClear={onSearchBoxClear}
        />
        {selectList.map((select) => (
          <Select
            key={select.title}
            showSearch={false}
            maxTagCount={2}
            mode="multiple"
            style={{ width: '100%' }}
            className={select.className}
            placeholder={select.title}
            value={selectedValues[select.title] || []}
            onChange={(values) => {
              handleSelectChange(select.title, values);
              select.onChange(values);
            }}
            tokenSeparators={[',']}
            options={select.options}
          />
        ))}
        {datePickerOptions.enable && (
          <DateRangePicker
            onChange={(date) => {
              setSelectedDate(date);
              datePickerOptions.onChange(date);
            }}
            value={selectedDate}
            className="h-44"
          />
        )}
        {filtersApplied && (
          <button
            className="main-button bg-white d-flex align-center border-primary-1 h-44 radius-2"
            onClick={handleReset}
          >
            <p className="f-14-20-500-primary p-l-12 m-r-8  p-y-8 ">Reset </p> <X className="h-16 w-16 m-r-12" />
          </button>
        )}
      </div>
    </div>
  );
};
