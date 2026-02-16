'use client';

import { Card, Col, MenuProps, Row, TableColumnsType, Tooltip } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { BoxIcon, CircleX, Ellipsis, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import PaymentModal from '@/components/Modal/payment-modal';
import { NoDataFound } from '@/components/no-data-found/no-data-found';
import { useUsdToPolConverter } from '@/hooks/useUsdToPol';
import DrawerComponent from '@components/drawer/drawer';
import DropdownComponent from '@components/drop-down/drop-down';
import { Menu } from '@components/menu';
import { TableComponent } from '@components/table/table';
import { TableMenuComponents } from '@components/table-menu/table-menu';
import { PAYMENT_STATUS } from '@helpers/constants/payment-status';
import { dateFormatter, toLocalISOString } from '@helpers/services/date-formatter';
import { capitalizeFirstLetter, truncateString } from '@helpers/services/text-formatter';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';
import { useGetAssetCategoriesQuery } from '@redux/apis/asset.api';
import { CategoryData } from '@redux/apis/interface';
import { useGetOrdersQuery } from '@redux/apis/payment.api';
import { Transaction } from '@redux/utils/interfaces/payment-api.interface';

import { PaginationComponent } from '../component/pagination/pagination';
import './orders.scss';

const Orders = () => {
  const router = useRouter();
  const { convertUsdToPol } = useUsdToPolConverter();

  const { getParam, updateSearchParams, deleteSearchParams } = useUrlSearchParams();
  const { data: assetCategoryList, isFetching: categoryListFetching } = useGetAssetCategoriesQuery();

  const categoryOptions = useMemo(() => {
    if (!categoryListFetching && assetCategoryList?.response?.length)
      return assetCategoryList.response.map(({ category, _id }: CategoryData) => ({
        label: category,
        key: _id,
        value: category,
      }));

    return [];
  }, [assetCategoryList, categoryListFetching]);

  const page = Number(getParam('page', '1'));
  const limit = Number(getParam('size', '10'));
  const categories = getParam('categories', '');
  const search = getParam('search', '');
  const from = getParam('from', '');
  const to = getParam('to', '');
  const payment = getParam('payment', '') as 'success' | 'failed' | '';

  const {
    data: orderData,
    isFetching,
    isLoading,
  } = useGetOrdersQuery({ page, limit, searchValue: search, categories, from, to });

  const [searchValue, setSearchValue] = useState<string>(search);
  const [hadDataBefore, setHadDataBefore] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const [paymentModal, setPaymentModal] = useState<boolean>(false);
  const [assetId, setAssetId] = useState<string>();
  const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);

  useEffect(() => {
    setPaymentModal(!!payment);
  }, []);

  useEffect(() => {
    if (orderData?.response.data && orderData.response.data.length > 0) {
      setHadDataBefore(true);
    }
  }, [orderData]);

  const handleClick = () => {
    setPaymentModal(false);
    if (payment === PAYMENT_STATUS.SUCCESS) {
      router.replace('/collections');
    }
  };

  const handleMenu = (e: { key: string }) => {
    if (e.key === 'cancelled') {
      router.push('/cancelled-orders');
    }
  };

  const handleViewDetails = (record: Transaction) => {
    setOpen(true);
    setAssetId(record.asset.assetId);
    setSelectedOrder(record);
  };
  const handleRowClick = (record: Record<string, unknown>) => {
    handleViewDetails(record as unknown as Transaction);
  };

  const filtersNotApplied = () => {
    return !!searchValue?.trim() || !!categories?.trim() || !!from?.trim() || !!to?.trim() || !!payment?.trim();
  };

  const orderDetailsColumns: TableColumnsType<Transaction> = [
    {
      title: 'Asset',
      dataIndex: 'asset.name',
      key: 'assetName',
      render: (_, record: Transaction) => (
        <div className="d-flex align-center">
          <Image src={record.asset.images[0]} className="radius-6" alt="assets" height={40} width={40} />
          <h3 className="f-14-16-600-primary m-l-14 text-ellipsis">
            <Tooltip title={capitalizeFirstLetter(record.asset.name)} placement="top">
              {capitalizeFirstLetter(record.asset.name)}
            </Tooltip>
          </h3>
        </div>
      ),
      fixed: 'left',
      width: 350,
    },
    {
      title: 'Asset ID',
      dataIndex: 'asset.assetId',
      key: 'assetId',
      render: (_, record) => <p className="f-14-16-500-primary">{record.asset.assetId}</p>,
      width: 180,
    },
    {
      title: 'Category',
      dataIndex: 'category.category',
      key: 'category',
      render: (_, record) => <p className="f-14-16-500-t-d">{capitalizeFirstLetter(record.category.category)}</p>,
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
      render: (value) => (
        <p className="f-14-16-500-t-d">
          ${value} / {convertUsdToPol(value)} POL
        </p>
      ),
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
      title: 'Order Type',
      dataIndex: 'transactionId',
      key: 'Order Id',
      render: (_, record) => <p className="f-14-16-500-t-d">{record.orderType}</p>,
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
            className={`${
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
      render: (record: Transaction) => {
        const menuItems: MenuProps['items'] = [
          {
            label: 'View order',
            key: '1',
            icon: <Eye size={16} />,
          },
        ];

        if (record.paymentStatus === PAYMENT_STATUS.PENDING)
          menuItems.push({
            label: 'Cancel order',
            key: '2',
            icon: <CircleX size={16} />,
          });

        return (
          <div className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100">
            <DropdownComponent
              menuItems={menuItems}
              label={<Ellipsis className="icon-16-primary" size={20} />}
              handleClick={(params) => {
                if (params.key === '1') {
                  handleViewDetails(record);
                }
              }}
              triggerAction={['hover']}
              dropdownPlacement="bottomRight"
            />
          </div>
        );
      },
      width: 67,
    },
  ];

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
            defaultSelectedKeys="orders"
          />
        </Col>

        <Col span={20}>
          <Card>
            <h1 className="f-18-30-600-primary p-x-20">Orders</h1>
            {(orderData?.response?.data && orderData?.response?.data?.length > 0) ||
            filtersNotApplied() ||
            hadDataBefore ? (
              <>
                <TableMenuComponents
                  value={searchValue}
                  selectList={[
                    {
                      title: 'Category',
                      className: 'custom-select w-240 m-l-12 h-44 table-menu text-ellipsis category-select',
                      options: categoryOptions ?? [],
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
                        from: date ? toLocalISOString(date[0])?.split('T')[0] : '',
                        to: date ? toLocalISOString(date[1])?.split('T')[0] : '',
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
                    data={orderData?.response?.data as unknown as Record<string, unknown>[]}
                    loading={isLoading || isFetching}
                    rowKey={'_id'}
                    columns={orderDetailsColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
                    onRow={(record: Record<string, unknown>) => ({
                      onClick: () => handleRowClick(record),
                    })}
                    handleTableChange={() => {}}
                  />
                  {orderData?.response && orderData.response.total > 9 && (
                    <PaginationComponent
                      totalDataCount={orderData?.response.total}
                      page={String(orderData?.response?.page)}
                      size={String(orderData?.response.size)}
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
                title="No Orders Yet"
                description="There’s nothing to display here yet. Check back later!"
              />
            )}
          </Card>
        </Col>
      </Row>

      {selectedOrder && (
        <DrawerComponent
          open={open}
          assetId={assetId}
          order={selectedOrder}
          handleClose={() => {
            setOpen(false);
            setAssetId('');
          }}
        />
      )}

      <PaymentModal
        isOpen={paymentModal}
        handleClick={() => handleClick()}
        handleCancel={() => setPaymentModal(false)}
        type={payment === PAYMENT_STATUS.SUCCESS ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED}
      />
    </div>
  );
};

export default Orders;
