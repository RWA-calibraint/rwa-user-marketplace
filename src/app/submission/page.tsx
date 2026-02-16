'use client';

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Input,
  Row,
  Select,
  TableColumnsType,
  Tooltip,
  Tag as AntdTag,
  Empty,
} from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { ChevronLeft, Ellipsis, LayoutGrid, List, ListFilter } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { GridViewCard } from '@/components/Grid-card/grid-card';
import { ActionType } from '@/components/Modal/interface';
import StyledModal from '@/components/Modal/Modal';
import { TableComponent } from '@/components/table/table';
import { isKycVerified } from '@/helpers/services/kyc-verification';
import { useUserListener } from '@/hooks/useUserListener';
import { SearchBox } from '@app/component/search-box/search-box';
import { AssetData } from '@components/asset-details/interface';
import DropdownComponent from '@components/drop-down/drop-down';
import { NoDataFound } from '@components/no-data-found/no-data-found';
import AntdTabs from '@components/Tabs/Tabs';
import { ASSET_STATUS, ASSSET_ACTION, STATUS_TYPE, SUBMISSION_TYPE } from '@helpers/constants/asset-status';
import { COLLECTION_VIEW_TYPE, STATUS_KEYS } from '@helpers/constants/constants';
import { SUCCESS_MESSAGES } from '@helpers/constants/success.message';
import { useToast } from '@helpers/notifications/toast.notification';
import { dateFormatter } from '@helpers/services/date-formatter';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { getMenuItems } from '@helpers/services/get-menuItems';
import { capitalizeFirstLetter } from '@helpers/services/text-formatter';
import { useDebouncedSearch } from '@hooks/useDebouncedSearch';
import {
  useDeleteDraftMutation,
  useGetAssetDraftQuery,
  useGetAssetListByStatusQuery,
  useGetBadgeCountQuery,
  useGetCategoriesListQuery,
  useGetSoldAssetListQuery,
} from '@redux/apis/asset.api';
import { useDeleteAssetMutation } from '@redux/apis/create-asset.api';
import { BadgeCount } from '@redux/apis/interface';

import '../collections/collection.scss';

import { PaginationComponent } from '../component/pagination/pagination';

const Submission = () => {
  const router = useRouter();
  const userData = useUserListener();
  const [status, setStatus] = useState<STATUS_TYPE>(STATUS_TYPE.SUBMITTED);
  const [activeTab, setActiveTab] = useState(STATUS_TYPE.SUBMITTED);
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 10,
  });
  const { showSuccessToast, showErrorToast } = useToast();
  const [deleteAsset] = useDeleteAssetMutation();
  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesListQuery();
  const { data: badgeCount } = useGetBadgeCountQuery();
  const {
    data: drafts,
    refetch: refetchDrafts,
    isLoading: draftsLoading,
    isFetching: draftsFetching,
  } = useGetAssetDraftQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteDraft] = useDeleteDraftMutation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<ActionType>(SUBMISSION_TYPE.DELETE);
  const [assetId, setAssetId] = useState<string>('');

  const [collectionsView, setCollectionsView] = useState(COLLECTION_VIEW_TYPE.LIST);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<{
    categories: string[];
    searchValue: string;
    min: number;
    max: number;
    sortBy: string;
    tokenValue: string;
  }>({
    categories: [],
    searchValue: '',
    min: 0,
    max: 0,
    sortBy: 'recently-added',
    tokenValue: '',
  });

  const [price, setPrice] = useState({
    min: 0,
    max: 0,
  });

  const debouncedValue = useDebouncedSearch(filterValues.searchValue, 500);

  useEffect(() => {
    setFilterValues((prev) => ({ ...prev, searchValue: debouncedValue }));
  }, [debouncedValue]);

  const selectedCategoryIds = categories?.response
    .filter((item) => filterValues.categories.includes(item.category))
    .map((item) => item._id);

  const queryParams = useMemo(
    () => ({
      status,
      search: filterValues.searchValue,
      category:
        selectedCategoryIds && selectedCategoryIds.length > 0
          ? selectedCategoryIds.join(',')
          : ((selectedCategoryIds && selectedCategoryIds[0]) ?? ''),
      page: tableParams.current || 1,
      limit: tableParams.pageSize || 10,
      startDate: '',
      endDate: '',
      min: filterValues.min.toString(),
      max: filterValues.max.toString(),
      sortBy: filterValues.sortBy,
    }),
    [status, selectedCategoryIds, tableParams, filterValues],
  );

  const {
    data: tableData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAssetListByStatusQuery(queryParams, {
    skip: status === STATUS_TYPE.SOLD || status === STATUS_TYPE.DRAFT,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: soldAssets,
    refetch: soldAssetRefetch,
    isLoading: soldLoading,
    isFetching: soldFetching,
  } = useGetSoldAssetListQuery(
    {
      search: debouncedValue,
      category:
        selectedCategoryIds && selectedCategoryIds.length > 0
          ? selectedCategoryIds.join(',')
          : ((selectedCategoryIds && selectedCategoryIds[0]) ?? ''),
      page: tableParams.current || 1,
      limit: tableParams.pageSize || 10,
      startDate: '',
      endDate: '',
      min: filterValues.min.toString(),
      max: filterValues.max.toString(),
      sortBy: filterValues.sortBy,
    },
    { refetchOnMountOrArgChange: true },
  );
  const loading = useMemo(
    () => isLoading || isFetching || soldLoading || soldFetching || draftsLoading || draftsFetching,
    [isLoading, isFetching, soldLoading, soldFetching, draftsLoading, draftsFetching],
  );

  const approvedAssetsColumns: TableColumnsType<AssetData> = [
    {
      title: 'Asset',
      dataIndex: 'name',
      key: 'name',
      render: (value, record: AssetData) => {
        return (
          <div className="d-flex align-center">
            <Image
              src={
                record?.images[0]
                  ? !record?.images?.[0].match(/\.(mp4|webm|ogg|mov|m4v|mkv|avi)$/i)
                    ? record?.images?.[0]
                    : '/Logo.svg'
                  : '/Logo.svg'
              }
              className="radius-6"
              alt="assets"
              height={40}
              width={40}
            />
            <h3 className="f-14-16-600-primary m-l-14 text-ellipsis">
              <Tooltip title={value} placement="top">
                {capitalizeFirstLetter(value)}
              </Tooltip>
            </h3>
          </div>
        );
      },
    },
    {
      title: 'Asset ID',
      dataIndex: 'assetId',
      key: 'assetId',
      render: (value) => <p className="f-14-16-500-primary">{activeTab === STATUS_TYPE.DRAFT ? 'null' : value}</p>,
    },
    {
      title: 'Category',
      dataIndex: `${activeTab === STATUS_TYPE.DRAFT ? 'category_name' : 'category'}`,
      key: 'category',
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    },
    {
      title: 'Total Amount',
      dataIndex: 'price',
      key: 'price',
      render: (value) => <p className="f-14-16-500-t-d">{value}</p>,
    },
    ...(activeTab === STATUS_TYPE.SUBMITTED
      ? [
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value: string) => (
              <div
                className={`${value === ASSET_STATUS.NEWLY_ADDED ? 'bg-light-green' : ''} ${value === ASSET_STATUS.DE_LISTED ? 'bg-error' : ''} ${value === ASSET_STATUS.RE_SUBMITTED ? 'bg-warning' : ''} ${value === ASSET_STATUS.HOLD ? 'bg-badge-bg-blue' : ''} radius-6 w-120 d-flex align-center justify-center`}
              >
                <p
                  className={`${value === ASSET_STATUS.NEWLY_ADDED ? 'f-14-16-500-green' : ''} ${value === ASSET_STATUS.DE_LISTED ? 'f-14-16-500-error' : ''} ${value === ASSET_STATUS.RE_SUBMITTED ? 'f-14-16-500-warning' : ''} ${value === ASSET_STATUS.HOLD ? 'f-14-16-500-badge-hold' : ''} p-y-8`}
                >
                  {capitalizeFirstLetter(value)}
                </p>
              </div>
            ),
          },
          {
            title: 'Submitted Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: string) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
          },
        ]
      : []),

    ...(activeTab === STATUS_TYPE.ADJUSTMENT_REQUIRED
      ? [
          {
            title: 'Submitted Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: string) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
          },
          {
            title: 'Rejected Documents',
            dataIndex: 'rejectedDocuments',
            key: 'rejectedDocuments',
            render: (value: string) => <p className="f-14-16-500-t-d">{value}</p>,
          },
        ]
      : []),
    ...(activeTab === STATUS_TYPE.APPROVED
      ? [
          {
            title: 'Issued Tokens',
            dataIndex: 'tokens',
            key: 'tokens',
            render: (value: string) => <p className="f-14-16-500-t-d">{value}</p>,
          },
          {
            title: 'Tokens sold',
            dataIndex: 'tokenSold',
            key: 'tokenSold',
            render: (value: string) => <p className="f-14-16-500-t-d">{value}</p>,
          },
          {
            title: 'Price per token',
            dataIndex: 'tokenPrice',
            key: 'tokenPrice',
            render: (value: string) => <p className="f-14-16-500-t-d">{value}</p>,
          },
          {
            title: 'Approved Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: string) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
          },
        ]
      : []),
    ...(activeTab === STATUS_TYPE.REJECTED
      ? [
          {
            title: 'Rejected Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: string) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
          },
        ]
      : []),
    ...(activeTab === STATUS_TYPE.HOLD
      ? [
          {
            title: 'Hold Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: string) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
          },
        ]
      : []),
    ...(activeTab === STATUS_TYPE.DE_LIST
      ? [
          {
            title: 'Delisted Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value: string) => <p className="f-14-16-500-t-d">{dateFormatter(value)}</p>,
          },
        ]
      : []),
    {
      dataIndex: '',
      key: 'approve-dropdown',
      title: '',
      onCell: () => ({ className: 'hover-container' }),
      render: (record) => (
        <div
          className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownComponent
            menuItems={getMenuItems(activeTab)}
            label={<Ellipsis className="icon-16-primary" />}
            handleClick={({ key }) => {
              if (key === SUBMISSION_TYPE.EDIT) {
                if (activeTab === STATUS_TYPE.DRAFT) {
                  router.push(`/sell/?type=draft`);
                } else {
                  router.push(`/sell/?assetId=${record.assetId}`);
                }
              } else if (key === SUBMISSION_TYPE.VIEW) {
                router.push(`/asset/${record.assetId}`);
              } else {
                setAssetId(activeTab === STATUS_TYPE.DRAFT ? record._id : record.assetId);
                setActionType(key as SUBMISSION_TYPE);
                setIsOpen(true);
              }
            }}
            triggerAction={['hover']}
            dropdownPlacement="bottomRight"
          />
        </div>
      ),
    },
  ];

  const recentlyAddedOptions = [
    { value: 'recently-added', label: 'Recently Added' },
    { value: 'price-high-to-low', label: 'Price high to low' },
    { value: 'price-low-to-high', label: 'Price low to high' },
  ];

  const collapseItems = [
    {
      key: 'price',
      label: 'Price',
      children: (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if ((price.min === 0 && price.max === 0) || price.min < price.max) {
              setTableParams({ ...tableParams, current: 1 });
              setFilterValues((prev) => ({ ...prev, min: price.min, max: price.max }));
              if (activeTab === STATUS_TYPE.SOLD) {
                soldAssetRefetch();
              } else {
                refetch();
              }
            } else if (price.min >= price.max) {
              return showErrorToast('', 'Minimum price should lesser than maximum price.');
            }
          }}
        >
          <Select
            key={'select-1'}
            showSearch={false}
            style={{ width: '100%' }}
            placeholder={'USD'}
            className="h-44 f-14-16-500-secondary"
            options={[]}
          />
          <div className="d-flex align-center justify-space-between m-t-12 width-100 gap-4">
            <div>
              <Input
                className="width-40 p-y-12"
                value={price.min === 0 ? '' : `${price.min}`}
                onChange={(e) => {
                  if (!Number.isNaN(parseInt(e.target.value || '0'))) {
                    setPrice((prev) => ({ ...prev, min: parseInt(e.target.value || '0') }));
                  }
                }}
                placeholder="Min"
                required={false}
              />
            </div>
            <div>To</div>
            <div>
              <Input
                value={price.max === 0 ? '' : `${price.max}`}
                className="width-40 p-y-12"
                onChange={(e) => {
                  if (!Number.isNaN(parseInt(e.target.value || '0'))) {
                    setPrice((prev) => ({ ...prev, max: parseInt(e.target.value || '0') }));
                  }
                }}
                placeholder="Max"
                required={false}
              />
            </div>
          </div>

          <Button className="width-100 m-t-12" type="primary" htmlType="submit">
            Apply
          </Button>
        </form>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      children: (
        <div className="collapse-category-container">
          {!isCategoryLoading && (
            <Checkbox.Group
              value={filterValues?.categories}
              onChange={(e: string[]) => {
                setTableParams({ ...tableParams, current: 1 });
                setFilterValues((prev) => ({ ...prev, categories: e }));
              }}
            >
              {categories?.response?.map(({ category }, index) => (
                <div className="categories" key={index}>
                  <Checkbox value={category}>{category}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          )}
        </div>
      ),
    },
  ];

  const handleRowClick = (record: Record<string, unknown>) => {
    if (activeTab === STATUS_TYPE.ADJUSTMENT_REQUIRED) {
      router.push(`/sell/?assetId=${record.assetId}`);
    } else if (activeTab === STATUS_TYPE.DRAFT) {
      router.push(`/sell/?type=draft`);
    } else {
      router.push(`/asset/${record.assetId}?type=${ASSSET_ACTION.SELL}`);
    }
  };

  const [tabDataCounts, setTabDataCounts] = useState({
    draft: 0,
    submitted: 0,
    adjustmentRequired: 0,
    resubmitted: 0,
    approved: 0,
    delist: 0,
    hold: 0,
    rejected: 0,
    sold: 0,
  });

  const AssetList =
    activeTab === STATUS_TYPE.SOLD
      ? soldAssets?.response
      : activeTab === STATUS_TYPE.DRAFT
        ? { ...drafts?.response, total: drafts?.response.data.length || 0 }
        : tableData?.response;

  const handlePaginationChange = ({ page, size }: { page: number; size: number }) => {
    setTableParams({
      current: page,
      pageSize: size,
    });
  };

  useEffect(() => {
    if (!badgeCount?.response) return;

    const updatedCounts = badgeCount.response.reduce(
      (acc, { status, count }: BadgeCount) => {
        const normalizedStatus = status.toLowerCase();
        const statusKey = STATUS_TYPE[normalizedStatus.toUpperCase() as keyof typeof STATUS_TYPE];

        if (normalizedStatus === STATUS_TYPE.ADJUSTMENT_REQUIRED.toLocaleLowerCase()) {
          acc[STATUS_TYPE.ADJUSTMENT_REQUIRED] = count;
        }
        if (statusKey || normalizedStatus === STATUS_TYPE.DE_LIST) {
          acc[normalizedStatus as keyof typeof tabDataCounts] = count;
        }

        return acc;
      },
      { ...tabDataCounts },
    );

    updatedCounts.sold = soldAssets?.response?.data.length ?? 0;
    updatedCounts.draft = drafts?.response.data.length ?? 0;

    if (JSON.stringify(tabDataCounts) !== JSON.stringify(updatedCounts)) {
      setTabDataCounts({ ...updatedCounts });
    }
  }, [badgeCount, soldAssets, drafts, tabDataCounts]);

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    if (actionType === SUBMISSION_TYPE.DELETE) {
      if (activeTab === STATUS_TYPE.DRAFT) {
        try {
          await deleteDraft(assetId);
          showSuccessToast(SUCCESS_MESSAGES.DRAFT_DELETED);
          refetchDrafts();
        } catch (error) {
          showErrorToast(error, getErrorMessage(error));
        }
      } else {
        try {
          await deleteAsset(assetId);
          showSuccessToast(SUCCESS_MESSAGES.ASSET_DELETED);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failure';

          showErrorToast(errorMessage, errorMessage);
        }
      }
    }
    refetch();
  };

  const isAllFiltersEmpty = useMemo(() => {
    return (
      filterValues.categories.length === 0 &&
      filterValues.searchValue === '' &&
      filterValues.min === 0 &&
      filterValues.max === 0 &&
      filterValues.sortBy === 'recently-added'
    );
  }, [filterValues]);

  const shouldShowContent = (tabValue: string) => {
    if (isLoading || isFetching) return true;

    const badgeCount = tabDataCounts[tabValue as keyof typeof tabDataCounts] || 0;

    if (badgeCount === 0) return false;

    if (!isAllFiltersEmpty) return true;

    return AssetList?.data && AssetList?.data.length > 0;
  };

  return (
    <div className="bg-secondary p-x-80 p-y-32 height-100">
      <Row gutter={20}>
        <Col span={30}>
          <Card>
            <div className="d-flex align-center justify-space-between">
              <h1 className="f-24-26-600-secondary m-b-24">My Listings</h1>
            </div>
            <AntdTabs
              className="custom-tab"
              onChange={(key) => {
                setStatus(key as STATUS_TYPE);
                setActiveTab(key as STATUS_TYPE);
                setOpenFilter(false);
              }}
              tabs={STATUS_KEYS.map((status) => ({
                key: status.value,
                label: (
                  <span className="tab-text">
                    {status.key}
                    <Badge
                      count={tabDataCounts[status.value as keyof typeof tabDataCounts]}
                      style={{
                        marginLeft: '5px',
                        backgroundColor: status.value === activeTab ? '#175675' : '#E4E4E7',
                        width: 21,
                        height: 20,
                        lineHeight: '20px',
                        fontSize: '12px',
                        color: status.value === activeTab ? '#fff' : '#71717A',
                      }}
                      showZero
                    />
                  </span>
                ),
                children: shouldShowContent(status.value) ? (
                  <>
                    <div className="d-flex align-center justify-space-between gap-3 m-y-10">
                      <div>
                        <Button
                          type="link"
                          className="border-secondary-1 gap-0 collection-filter-button"
                          onClick={() => setOpenFilter(!openFilter)}
                        >
                          {!openFilter ? <ChevronLeft size={20} /> : <ListFilter size={20} />} <span>Filters</span>
                        </Button>
                      </div>
                      <div className="width-70">
                        <SearchBox
                          placeHolder="Search Assets"
                          className="width-100 h-44"
                          value={filterValues.searchValue}
                          autoFocus={false}
                          onChange={(e) => {
                            setTableParams({ ...tableParams, current: 1 });
                            setFilterValues((prev) => ({ ...prev, searchValue: e }));
                          }}
                          onClear={() => {
                            setTableParams({ ...tableParams, current: 1 });
                            setFilterValues((prev) => ({ ...prev, searchValue: '' }));
                          }}
                        />
                      </div>

                      <div>
                        <Select
                          key={''}
                          value={filterValues.sortBy}
                          showSearch={false}
                          style={{ width: '100%' }}
                          placeholder={'Recently Added'}
                          className="h-44 f-14-16-500-secondary"
                          onChange={(e) => {
                            setTableParams({ ...tableParams, current: 1 });
                            setFilterValues((prev) => ({ ...prev, sortBy: e }));
                          }}
                          options={recentlyAddedOptions}
                        />
                      </div>

                      <div className="border-secondary-1 p-x-8 p-y-8 radius-6">
                        <div className="d-flex align-center gap-1">
                          <span
                            className={`${collectionsView === COLLECTION_VIEW_TYPE.LIST ? 'bg-secondary' : 'bg-white'} p-4 d-flex align-center cursor-pointer`}
                            onClick={() => setCollectionsView(COLLECTION_VIEW_TYPE.LIST)}
                          >
                            <List size={20} />
                          </span>
                          <span
                            className={`${collectionsView === COLLECTION_VIEW_TYPE.GRID ? 'bg-secondary' : 'bg-white'} p-4 d-flex align-center cursor-pointer`}
                            onClick={() => setCollectionsView(COLLECTION_VIEW_TYPE.GRID)}
                          >
                            <LayoutGrid size={20} />
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          if (isKycVerified(userData)) {
                            router.push('/sell');
                          } else {
                            window.dispatchEvent(new Event('openKycPopup'));
                          }
                        }}
                        className="btn"
                        type="primary"
                      >
                        Submit new asset
                      </Button>
                    </div>
                    <Row gutter={30}>
                      <Col span={openFilter ? 0 : 5}>
                        <div className="collection-collapse-container">
                          <Collapse
                            accordion={true}
                            items={collapseItems}
                            className="d-block"
                            defaultActiveKey={['price']}
                          />
                        </div>
                      </Col>
                      <Col span={openFilter ? 24 : 19}>
                        <div className="m-b-10">
                          {filterValues?.categories &&
                            filterValues?.categories?.map((item, index) => (
                              <AntdTag
                                key={index}
                                closable
                                onClose={(e) => {
                                  e.preventDefault();
                                  setFilterValues((prev) => ({
                                    ...prev,
                                    categories: prev?.categories?.filter((prev_cat) => prev_cat !== item),
                                  }));
                                }}
                              >
                                {item}
                              </AntdTag>
                            ))}
                        </div>
                        <div className="flex-column m-y-20 width-100">
                          {collectionsView === COLLECTION_VIEW_TYPE.LIST ? (
                            <>
                              <TableComponent
                                loading={loading}
                                data={AssetList?.data as unknown as Record<string, unknown>[]}
                                rowKey={'assetId'}
                                columns={approvedAssetsColumns as unknown as ColumnGroupType<Record<string, unknown>>[]}
                                onRowClick={handleRowClick}
                                handleTableChange={() => {}}
                              />
                            </>
                          ) : (
                            <>
                              {AssetList?.data && AssetList?.data?.length > 0 ? (
                                <section
                                  className={`collection-grid-view-container d-grid ${openFilter ? 'grid-cols-4' : 'grid-cols-3'} gap-4 width-100`}
                                >
                                  {AssetList?.data.map((item, index) => (
                                    <GridViewCard key={index} item={item as AssetData} showWishList={false} />
                                  ))}
                                </section>
                              ) : (
                                <div className="d-flex align-center justify-center">
                                  <Empty />
                                </div>
                              )}
                            </>
                          )}
                          {AssetList?.data && AssetList.total >= 10 ? (
                            activeTab === STATUS_TYPE.SOLD ? (
                              <PaginationComponent
                                totalDataCount={soldAssets?.response?.total}
                                page={soldAssets?.response?.page ?? '1'}
                                size={soldAssets?.response?.limit ?? '10'}
                                updatePagination={handlePaginationChange}
                              />
                            ) : (
                              <PaginationComponent
                                totalDataCount={tableData?.response?.total}
                                page={tableData?.response?.page ?? '1'}
                                size={tableData?.response?.limit ?? '10'}
                                updatePagination={handlePaginationChange}
                              />
                            )
                          ) : null}
                          <StyledModal
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            className="max-w-460"
                            type="Submission"
                            actionType={actionType as ActionType}
                            handleCancel={handleCancel}
                            handleConfirm={handleConfirm}
                          />
                        </div>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <NoDataFound
                    className="h-400"
                    title="No Listings Found"
                    description="There’s nothing to display here yet. Check back later!"
                  />
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Submission;
