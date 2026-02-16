import { Badge } from 'antd';
import { ColumnGroupType } from 'antd/es/table';

import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menu/table-menu';

export const StatusTab = ({
  key,
  label,
  badgeCount,
  tableData,
  columns,
  handleRowClick,
}: {
  key: string;
  label: string;
  badgeCount: number;
  tableData: Record<string, unknown>[];
  columns: ColumnGroupType<Record<string, unknown>>[];
  handleRowClick: (record: Record<string, unknown>) => void;
}) => {
  return {
    key,
    label: (
      <span>
        {label}
        <Badge
          count={badgeCount}
          style={{
            backgroundColor: '#175675',
            width: 21,
            height: 20,
            lineHeight: '20px',
            fontSize: '12px',
          }}
        />
      </span>
    ),
    children: (
      <>
        <TableMenuComponents
          selectList={[
            {
              title: 'Category',
              className: 'custom-select w-165 m-l-12 h-44 table-menu',
              options: [
                { label: 'Painting', value: 'painting' },
                { label: 'Art', value: 'art' },
              ],
              onChange: () => {},
            },
          ]}
          datePickerOptions={{ enable: true, onChange: () => {} }}
          value={''}
          onSearchValueChange={() => {}}
        />
        <div className="flex-column m-x-20 m-y-20">
          <TableComponent
            data={tableData}
            rowKey={'assetId'}
            columns={columns}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            handleTableChange={() => {}}
          />
        </div>
      </>
    ),
  };
};
