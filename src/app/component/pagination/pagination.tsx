'use client';

import { Pagination, Select } from 'antd';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

import { PAGINATION_DATA_TYPE } from './pagination.constant';
import { PaginationInterface } from './pagination.interface';

export const PaginationComponent: FC<PaginationInterface> = ({ totalDataCount, page, size, updatePagination }) => {
  const pathName = usePathname();

  const dataType = PAGINATION_DATA_TYPE[pathName] ?? PAGINATION_DATA_TYPE.ASSETS;

  return (
    <div className="d-flex align-center justify-space-between bg-white m-b-20  m-x-20 m-t-10">
      <p className="f-14-16-500-secondary">{`Showing ${(Number(page) - 1) * Number(size) + 1} - ${Math.min(Number(page) * Number(size), totalDataCount ?? 1)} of ${totalDataCount} ${dataType}`}</p>
      <div className="d-flex align-center justify-center">
        <Pagination
          current={Number(page)}
          pageSize={Number(size)}
          showSizeChanger={false}
          total={totalDataCount}
          onChange={(page, pageSize) => updatePagination({ page, size: pageSize })}
        />
        <Select
          value={Number(size)}
          onChange={(e) => {
            updatePagination({ page: Number(page), size: e });
          }}
        >
          <Select.Option value={10}>10 / page</Select.Option>
          <Select.Option value={20}>20 / page</Select.Option>
          <Select.Option value={50}>50 / page</Select.Option>
          <Select.Option value={100}>100 / page</Select.Option>
        </Select>
      </div>
    </div>
  );
};
