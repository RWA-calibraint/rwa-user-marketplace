'use client';

import { DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { CalendarDays, Trash2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import { AssetHistoryType, EditAssetHistoryProps } from './interface';

const EditAssetHistory: FC<EditAssetHistoryProps> = ({ form, rows, setRows }) => {
  const pathname = usePathname();
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  useEffect(() => {
    if (rows.length === 0) {
      setRows([{ key: 1, listedDate: null, price: 0, hasAddedRow: false }]);
    }
  }, [rows, setRows]);

  useEffect(() => {
    const initialValues = rows.reduce(
      (acc, row) => {
        acc[`listedDate-${row.key}`] = row.listedDate ? dayjs(row.listedDate, 'YYYY') : null;
        acc[`price-${row.key}`] = row.price;

        return acc;
      },
      {} as Record<string, unknown>,
    );

    if (form) form.setFieldsValue(initialValues);

    const years = rows.filter((row) => row.listedDate).map((row) => row.listedDate!);

    setSelectedYears(years);
  }, [rows, form]);

  const addRow = (key: number) => {
    if (rows.length < 100) {
      const newRow = {
        key: rows.length + 1,
        listedDate: null,
        price: 0,
        hasAddedRow: false,
      };

      setRows((prevRows) => prevRows.map((row) => (row.key === key ? { ...row, hasAddedRow: true } : row)));
      setRows((prevRows: AssetHistoryType[]) => [...prevRows, newRow]);
    }
  };

  const removeRow = (key: number) => {
    if (rows.length > 1) {
      const index = rows.findIndex((row) => row.key === key);

      if (index > 0) {
        const updatedRows = rows.map((row, i) => (i === index - 1 ? { ...row, hasAddedRow: false } : row));

        setRows(updatedRows.filter((row) => row.key !== key));
      } else {
        setRows(rows.filter((row) => row.key !== key));
      }
    }
  };

  const disabledDate = (current: dayjs.Dayjs | null) => {
    if (!current) {
      return false;
    }
    const year = current.format('YYYY');

    return selectedYears.some((selectedYear) => selectedYear === year) || year >= String(new Date().getFullYear());
  };

  return (
    <div
      className={`w-662 border-none-0 radius-8 bg-white p-x-24 ${pathname.includes('/create-asset') ? 'v-h-65' : 'v-h-72'}`}
    >
      {rows.map((row) => (
        <div key={row.key} className="d-flex align-center width-100">
          <Form.Item
            label={
              <span>
                Year <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name={`listedDate-${row.key}`}
            rules={[{ required: true, message: 'Please select a year' }]}
            className="width-100 m-b-16"
          >
            <DatePicker
              value={row.listedDate ? dayjs(row.listedDate, 'YYYY') : null}
              onOpenChange={(open) => {
                if (!open && !row.hasAddedRow && row.listedDate && row.price) {
                  addRow(row.key);
                }
              }}
              inputReadOnly
              onChange={(date) => {
                if (date && dayjs(date).isValid()) {
                  const updatedRows = rows.map((r) =>
                    r.key === row.key ? { ...r, listedDate: date.format('YYYY') } : r,
                  );

                  setRows(updatedRows);
                  if (form) form.setFieldsValue({ [`listedDate-${row.key}`]: date });

                  const years = updatedRows.filter((row) => row.listedDate).map((row) => row.listedDate!);

                  setSelectedYears(years);
                }
              }}
              picker="year"
              className="p-x-12 p-y-12 radius-6 width-100 border-primary-1"
              suffixIcon={<CalendarDays className="img-16" />}
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Price in USD ($) <span className="f-14-16-500-status-red">*</span>
              </span>
            }
            name={`price-${row.key}`}
            rules={[{ required: true, message: 'Please enter price' }]}
            className="width-100 m-x-16 m-b-16"
          >
            <Input
              placeholder="Amount"
              min={0}
              type="number"
              value={row.price}
              onPressEnter={() => {
                if (!row.hasAddedRow && row.listedDate && row.price) {
                  addRow(row.key);
                }
              }}
              onChange={({ target: { value } }) => {
                const updatedRows = rows.map((r) =>
                  r.key === row.key
                    ? {
                        ...r,
                        price: Number(value) || 0,
                        hasAddedRow: false,
                      }
                    : r,
                );

                setRows(updatedRows);
                if (form) form.setFieldsValue({ [`price-${row.key}`]: Number(value) || 0 });
              }}
              className="p-x-10 p-y-10 radius-6 width-100"
            />
          </Form.Item>

          {row.key > 1 && <Trash2 onClick={() => removeRow(row.key)} className="width-5 h-20 cursor-pointer" />}
        </div>
      ))}
    </div>
  );
};

export default EditAssetHistory;
