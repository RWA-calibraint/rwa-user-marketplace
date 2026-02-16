'use client';

import { Card, Col, Row, TableColumnsType } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { BoxIcon, CircleX, Ellipsis, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { NoDataFound } from '@/components/no-data-found/no-data-found';
import { dateFormatter, toLocalISOString } from '@/helpers/services/date-formatter';
import { capitalizeFirstLetter, truncateString } from '@/helpers/services/text-formatter';
import { useUrlSearchParams } from '@/hooks/useUrlSearchParams';
import { useUsdToPolConverter } from '@/hooks/useUsdToPol';
import { useGetAssetCategoriesQuery } from '@/redux/apis/asset.api';
import { CategoryData } from '@/redux/apis/interface';
import { useGetOrdersQuery } from '@/redux/apis/payment.api';
import { Transaction } from '@/redux/utils/interfaces/payment-api.interface';
import DrawerComponent from '@components/drawer/drawer';
import DropdownComponent from '@components/drop-down/drop-down';
import { Menu } from '@components/menu';
import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menu/table-menu';
import { PAYMENT_STATUS } from '@helpers/constants/payment-status';

import { PaginationComponent } from '../component/pagination/pagination';

const CancelledOrders = () => {
  const cancelledOrdersColumns: TableColumnsType<Transaction> = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'assetName',
      render: (value) => (
        <div className="d-flex align-center">
          <Image src={value.images[0]} className="radius-6" alt="assets" height={40} width={40} />
          <h3 className="f-14-16-600-primary m-l-14">{capitalizeFirstLetter(value.name)}</h3>
        </div>
      ),
      fixed: 'left',
      width: 350,
    },
    {
      title: 'Asset ID',
      dataIndex: 'asset',
      key: 'assetId',
      render: (value) => <p className="f-14-16-500-primary">{value.assetId}</p>,
      width: 180,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value) => <p className="f-14-16-500-t-d">{capitalizeFirstLetter(value.category)}</p>,
      width: 180,
    },
    {
      title: 'Tokens brought',
      dataIndex: 'quantity',
      key: 'price',
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
      width: 180,
    },
    {
      title: 'Total Amount',
      dataIndex: 'amount',
      key: 'price',
      render: (value) => <p className="f-14-16-500-t-d">${convertUsdToPol(value)} POL</p>,
      width: 200,
    },
    {
      title: 'Order On',
      dataIndex: 'createdAt',
      key: 'Ordered date',
      render: (value) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
      width: 180,
    },
    {
      title: 'Order ID',
      dataIndex: 'transactionId',
      key: 'Order Id',
      render: (value) => <p className="f-14-16-500-t-d">#{truncateString(value, 16, '....')}</p>,
      width: 200,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (value: string) => (
        <div
          className={`d-flex align-center justify-center radius-6 table-chip h-32 w-98 ${
            value === PAYMENT_STATUS.COMPLETED ? 'bg-payment-success' : ''
          } ${value === PAYMENT_STATUS.PENDING ? 'bg-payment-pending' : 'bg-e-bg'}`}
        >
          <p
            className={`p-y-8 ${
              value === PAYMENT_STATUS.COMPLETED ? 'f-14-16-500-success' : ''
            } ${value === PAYMENT_STATUS.FAILED ? 'f-14-16-500-err-text' : ''} ${
              value === PAYMENT_STATUS.PENDING ? 'f-14-16-500-w-t' : ''
            }`}
          >
            {value === PAYMENT_STATUS.COMPLETED ? 'Successful' : value}
          </p>
        </div>
      ),
      width: 180,
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      key: 'payment',
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
      width: 180,
    },
    {
      dataIndex: '',
      key: 'approve-dropdown',
      title: '',
      onCell: () => ({ className: 'hover-container' }),
      render: (record) => (
        <div className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100">
          <DropdownComponent
            menuItems={[
              {
                label: 'View order',
                key: 'view-order',
                icon: <Eye size={16} />,
              },
            ]}
            label={<Ellipsis className="icon-16-primary" size={20} />}
            handleClick={(params) => {
              if (params.key === 'view-order') {
                handleViewDetails(record);
              }
            }}
            triggerAction={['hover']}
            dropdownPlacement="bottomRight"
          />
        </div>
      ),
      width: 67,
    },
  ];
  const router = useRouter();
  const { convertUsdToPol } = useUsdToPolConverter();
  const { data: assetCategoryList, isFetching: categoryListFetching } = useGetAssetCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const categoryOptions = useMemo(() => {
    if (!categoryListFetching && assetCategoryList?.response?.length)
      return assetCategoryList?.response.map(({ category, _id }: CategoryData) => ({
        label: category,
        key: _id,
        value: category,
      }));

    return [];
  }, [assetCategoryList, categoryListFetching]);
  const { getParam, updateSearchParams, deleteSearchParams } = useUrlSearchParams();

  const page = Number(getParam('page', '1'));
  const limit = Number(getParam('size', '10'));
  const categories = getParam('categories', '');
  const search = getParam('search', '');
  const from = getParam('from', '');
  const to = getParam('to', '');

  const {
    data: cancelledOrderData,
    isFetching,
    isLoading,
  } = useGetOrdersQuery({
    page,
    limit,
    searchValue: search,
    categories,
    from,
    to,
    paymentStatus: PAYMENT_STATUS.REFUNDED,
  });

  const [searchValue, setSearchValue] = useState<string>(search);
  const [hadDataBefore, setHadDataBefore] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const [assetId, setAssetId] = useState<string>();
  const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);

  useEffect(() => {
    if (cancelledOrderData?.response.data && cancelledOrderData.response.data.length > 0) {
      setHadDataBefore(true);
    }
  }, [cancelledOrderData]);

  const handleMenu = (e: { key: string }) => {
    if (e.key === 'orders') {
      router.push('/orders');
    }
  };

  const handleViewDetails = (record: Transaction) => {
    setOpen(true);
    setAssetId(record.asset.assetId);
    setSelectedOrder(record);
  };

  const handleRowClick = (record: Record<string, unknown>) => handleViewDetails(record as unknown as Transaction);

  const filtersNotApplied = () => {
    return !!searchValue?.trim() || !!categories?.trim() || !!from?.trim() || !!to?.trim();
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
                    icon: <BoxIcon />,
                    key: 'orders',
                    label: 'Orders',
                  },
                  {
                    icon: <CircleX />,
                    key: 'cancelled',
                    label: 'Cancelled',
                  },
                ],
              },
            ]}
            onClick={handleMenu}
            defaultSelectedKeys="cancelled"
          />
        </Col>

        <Col span={20}>
          <Card>
            <h1 className="f-18-30-600-primary p-l-20">Cancelled</h1>
            {(cancelledOrderData?.response.data && cancelledOrderData.response.data.length > 0) ||
            filtersNotApplied() ||
            hadDataBefore ? (
              <>
                <TableMenuComponents
                  value={searchValue}
                  selectList={[
                    {
                      title: 'Category',
                      className: 'custom-select w-165 m-l-12 h-44 table-menu text-ellipsis category-select',
                      options: [categoryOptions ?? []],
                      onChange: (value) => {
                        updateSearchParams({ categories: value.join(','), page: 1, size: 10 });
                      },
                    },
                  ]}
                  onSearchBoxClear={() => {
                    deleteSearchParams(['search']);
                    setSearchValue('');
                  }}
                  datePickerOptions={{
                    enable: true,
                    onChange: (date) => {
                      updateSearchParams({
                        from: date ? toLocalISOString(date[0]) : '',
                        to: date ? toLocalISOString(date[1]) : '',
                      });
                    },
                  }}
                  onSearchValueChange={(value) => {
                    setSearchValue(value);
                    updateSearchParams({ search: value });
                  }}
                  onResetClick={() => {
                    setSearchValue('');
                    deleteSearchParams(['search', 'categories', 'from', 'to']);
                  }}
                  className="p-l-20"
                />
                <div className="flex-column m-x-20 m-y-20">
                  <TableComponent
                    columns={cancelledOrdersColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
                    onRow={(record: Record<string, unknown>) => ({
                      onClick: () => handleRowClick(record),
                    })}
                    rowKey={'_id'}
                    data={cancelledOrderData?.response.data as unknown as Record<string, unknown>[]}
                    loading={isLoading || isFetching}
                    handleTableChange={() => {}}
                  />
                  {cancelledOrderData?.response && cancelledOrderData.response.total > 9 && (
                    <PaginationComponent
                      totalDataCount={cancelledOrderData?.response.total}
                      page={String(cancelledOrderData?.response?.page)}
                      size={String(cancelledOrderData?.response.size)}
                      updatePagination={({ page, size }) => {
                        updateSearchParams({ page, limit: size });
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              <NoDataFound
                className="h-300 width-100"
                title="No Cancelled Orders Yet"
                description="There’s nothing to display here yet. Check back later!"
              />
            )}
          </Card>
        </Col>
      </Row>
      {selectedOrder && (
        <DrawerComponent
          order={selectedOrder}
          open={open}
          assetId={assetId}
          handleClose={() => {
            setOpen(false);
            setAssetId('');
          }}
        />
      )}
    </div>
  );
};

export default CancelledOrders;
