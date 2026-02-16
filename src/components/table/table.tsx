import { Skeleton, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { JSX, ReactNode, useMemo } from 'react';

import { TableComponentProps } from './table.interface';

export const TableComponent = <T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  handleTableChange,
  className = '',
  pagination = false,
  onRow,
  onRowClick,
}: TableComponentProps<T>): JSX.Element => {
  const memoizedColumns = useMemo(() => {
    return columns.map((column) => {
      const newColumn: ColumnType<T> = { ...column };

      newColumn.render = (value: unknown, record: T, index: number) => {
        if (loading) {
          return <Skeleton key={`skeleton-${String(column.key)}-${index}`} title active paragraph={false} />;
        }

        if (column.render) {
          return column.render(value, record, index);
        }

        return value as ReactNode;
      };

      return newColumn;
    });
  }, [columns, loading]);

  return (
    <Table<T>
      pagination={pagination}
      scroll={{ y: 'calc(100vh - 320px)' }}
      onChange={handleTableChange}
      rowKey={rowKey}
      onRow={(record) => ({
        ...(onRow ? onRow(record) : {}),
        style: { cursor: 'pointer' },
        onClick: (e) => {
          if ((e.target as HTMLElement).closest('.no-row-click')) {
            return;
          }
          onRowClick?.(record);
        },
      })}
      columns={memoizedColumns}
      dataSource={data}
      className={className}
      // locale={{
      //   emptyText: (
      //     <NoDataFound
      //       className="h-500"
      //       title="No Data Found"
      //       description="Try adjusting your search or filters to find relevant results."
      //     />
      //   ),
      // }}
    />
  );
};
