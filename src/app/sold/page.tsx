'use client';

import { Card, Col, Row, TableColumnsType } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { Package, TagIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AssetData } from '@components/asset-details/interface';
import { Menu } from '@components/menu';
import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menu/table-menu';
import { dateFormatter, toLocalISOString } from '@helpers/services/date-formatter';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';
import { useGetCategoriesListQuery, useGetSoldAssetListQuery } from '@redux/apis/asset.api';

import { PaginationComponent } from '../component/pagination/pagination';

const soldAssetColumns: TableColumnsType<AssetData> = [
  {
    title: 'Asset',
    dataIndex: 'name',
    key: 'name',
    render: (value, record: AssetData) => (
      <div className="d-flex align-center">
        <Image src={record.images[0]} className="radius-6" alt="assets" height={40} width={40} />
        <h3 className="f-14-16-600-primary m-l-14">{value}</h3>
      </div>
    ),
    width: 350,
    fixed: 'left',
  },
  {
    title: 'Asset ID',
    dataIndex: 'assetId',
    key: 'assetId',
    render: (value) => <p className="f-14-16-500-primary">{value}</p>,
    width: 170,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (value) => <p className="f-14-16-500-t-d">{value.category}</p>,
    width: 170,
  },
  {
    title: 'Total Amount',
    dataIndex: 'price',
    key: 'price',
    render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    width: 200,
  },
  {
    title: 'Issued Tokens',
    dataIndex: 'tokens',
    key: 'issuedToken',
    render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    width: 160,
  },
  {
    title: 'Tokens Sold',
    dataIndex: 'soldTokens',
    key: 'tokenSold',
    render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    width: 160,
  },
  {
    title: 'Price per token',
    dataIndex: 'price',
    key: 'price',
    render: (_, record) => <p className="f-14-16-500-t-d">{(record.price / record.tokens).toFixed(2)}</p>,
    width: 200,
  },
  {
    title: 'Sold Date',
    dataIndex: 'soldAt',
    key: 'soldDate',
    render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
    width: 180,
  },
];

const Sold = () => {
  const router = useRouter();
  const { data: categoryList } = useGetCategoriesListQuery();

  const { getParam, updateSearchParams, deleteSearchParams } = useUrlSearchParams();

  const page = Number(getParam('page', '1'));
  const limit = Number(getParam('size', '10'));
  const category = getParam('categories', '');
  const search = getParam('search', '');
  const startDate = getParam('from', '');
  const endDate = getParam('to', '');

  const [searchValue, setSearchValue] = useState<string>(search);

  const {
    data: assetList,
    isLoading,
    isFetching,
  } = useGetSoldAssetListQuery({
    search,
    category,
    page,
    limit,
    startDate,
    endDate,
    min: '',
    max: '',
    sortBy: '',
  });

  const handleMenu = (e: { key: string }) => {
    if (e.key === 'cancelled') {
      soldAssetColumns[soldAssetColumns.length - 1] = {};
      // router.push("/sold");
    } else {
      router.push('/submission');
    }
  };

  const handleRowClick = (record: Record<string, unknown>) => {
    router.push(`/asset/${record.assetId}`);
  };

  return (
    <div className="bg-secondary p-x-80 p-y-32 height-100">
      <Row gutter={20}>
        <Col span={4}>
          <Menu
            items={[
              {
                key: 'menu',
                label: 'Menu',
                type: 'group',
                children: [
                  {
                    icon: <Package />,
                    key: 'submissions',
                    label: 'Submissions',
                  },
                  {
                    icon: <TagIcon />,
                    key: 'sold',
                    label: 'Sold',
                  },
                ],
              },
            ]}
            onClick={handleMenu}
            defaultSelectedKeys="sold"
          />
        </Col>

        <Col span={20}>
          <Card>
            <h1 className="f-18-30-600-primary">Sold</h1>
            <>
              <TableMenuComponents
                value={searchValue}
                selectList={[
                  {
                    title: 'Category',
                    className: 'custom-select w-165 m-l-12 h-44 table-menu',
                    options: categoryList
                      ? categoryList.response.map((category) => ({
                          label: category.category,
                          value: category.category,
                        }))
                      : [],
                    onChange: (value) => {
                      updateSearchParams({ categories: value.join(','), page: 1, size: 10 });
                    },
                  },
                ]}
                onSearchValueChange={(value) => {
                  setSearchValue(value);
                  updateSearchParams({ search: value });
                }}
                onSearchBoxClear={() => {
                  deleteSearchParams(['search']);
                  setSearchValue('');
                }}
                datePickerOptions={{
                  enable: true,
                  onChange: (date) => {
                    updateSearchParams({
                      from: date ? toLocalISOString(date[0])?.split('T')[0] : '',
                      to: date ? toLocalISOString(date[1])?.split('T')[0] : '',
                    });
                  },
                }}
                onResetClick={() => {
                  setSearchValue('');
                  deleteSearchParams(['search', 'category', startDate, endDate]);
                }}
              />
              <div className="flex-column m-y-20">
                <TableComponent
                  data={assetList?.response.data as unknown as Record<string, unknown>[]}
                  rowKey={'_id'}
                  onRow={(record: Record<string, unknown>) => ({
                    onClick: () => handleRowClick(record),
                  })}
                  columns={soldAssetColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
                  handleTableChange={() => {}}
                  loading={isLoading || isFetching}
                />
                {assetList?.response && assetList.response.total > 9 && (
                  <PaginationComponent
                    totalDataCount={assetList?.response?.total}
                    page={assetList?.response?.page ?? '1'}
                    size={assetList?.response?.limit ?? '10'}
                    updatePagination={({ page, size }) => {
                      updateSearchParams({ page, limit: size });
                    }}
                  />
                )}
              </div>
            </>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Sold;
