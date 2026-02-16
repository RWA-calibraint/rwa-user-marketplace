'use client';
import { Badge, Collapse, Col, Row, Select, Checkbox, Input, Tag as AntdTag, Pagination, MenuProps, Empty } from 'antd';
import { Eye, Ellipsis, List, LayoutGrid, ListFilter, Tag, ChevronLeft, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

import DropdownComponent from '@/components/drop-down/drop-down';
import { GridViewCard } from '@/components/Grid-card/grid-card';
import { NoDataFound } from '@/components/no-data-found/no-data-found';
import TabsPanel from '@/components/TabsPanel/tabsPanel';
import { ASSSET_ACTION, COLLECTION_TYPE } from '@/helpers/constants/asset-status';
import { COLLECTION_TABLE_MENU_OPTIONS, COLLECTION_TABS } from '@/helpers/constants/constants';
import { SUCCESS_MESSAGES } from '@/helpers/constants/success.message';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { SearchBox } from '@app/component/search-box/search-box';
import Button from '@components/button/button';
import { TableComponent } from '@components/table/table';
import { useToast } from '@helpers/notifications/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { useDeleteListingsMutation, useGetCategoriesListQuery } from '@redux/apis/asset.api';
import { useGetCollectionsCountQuery, useGetCollectionsListQuery } from '@redux/apis/collections.api';
import { CollectionListInterface } from '@redux/utils/interfaces/collections-api.interface';

import './collection.scss';

export default function Collections() {
  const collectionsViewValues = {
    list: 'list',
    grid: 'grid',
  };
  const [activeKey, setActiveKey] = useState<COLLECTION_TABS>(COLLECTION_TABS.COLLECTED);
  const [type, setType] = useState(COLLECTION_TYPE.AssetCollected);
  const [priceFilter, setPriceFilter] = useState({
    min: 0,
    max: 0,
  });
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
    sortBy: '',
    tokenValue: 'Select',
  });
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    assetPerPage: 10,
    totalAssets: 0,
  });
  const debouncedValue = useDebouncedSearch(filterValues.searchValue, 500);

  const [collectionsView, setCollectionsView] = useState(collectionsViewValues.list);
  const [openFilter, setOpenFilter] = useState(false);

  const memoizedFilterValues = useMemo(
    () => ({
      categories: filterValues.categories,
      searchValue: filterValues.searchValue,
      min: filterValues.min,
      max: filterValues.max,
      sortBy: filterValues.sortBy,
      tokenValue: filterValues.tokenValue,
    }),
    [filterValues],
  );

  const memoizedPaginationInfo = useMemo(
    () => ({
      currentPage: paginationInfo.currentPage,
      assetPerPage: paginationInfo.assetPerPage,
      totalAssets: paginationInfo.totalAssets,
    }),
    [paginationInfo.currentPage, paginationInfo.assetPerPage, paginationInfo.totalAssets],
  );

  const queryParams = useMemo(
    () => ({
      type,
      filterValues: memoizedFilterValues,
      paginationInfo: memoizedPaginationInfo,
    }),
    [type, memoizedFilterValues, memoizedPaginationInfo],
  );

  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesListQuery();
  const { data: collectionsCount, isLoading: isCollectionsCountLoading } = useGetCollectionsCountQuery('', {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: collectionsList,
    refetch,
    isLoading: categoriesListLoading,
    isFetching: categoriesListFetching,
  } = useGetCollectionsListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteListings, { isLoading: deleteListingsLoading }] = useDeleteListingsMutation();

  const isLoading = useMemo(
    () => categoriesListLoading || categoriesListFetching || deleteListingsLoading,
    [categoriesListLoading, categoriesListFetching, deleteListingsLoading],
  );

  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useToast();

  const handleDeleteListings = async (id: string) => {
    try {
      await deleteListings(id);
      showSuccessToast(SUCCESS_MESSAGES.LISTING_DELETED);
    } catch (error) {
      showErrorToast(error, getErrorMessage(error));
    }
  };

  useEffect(() => {
    setFilterValues((prev) => ({ ...prev, searchValue: debouncedValue }));
  }, [debouncedValue]);

  useEffect(() => {
    if (collectionsList?.response?.assets) {
      setPaginationInfo((prev) => ({
        ...prev,
        totalAssets: collectionsList?.response?.totalAssets,
      }));
    }
    refetch();
  }, [collectionsList]);

  const resetFilters = () => {
    setFilterValues({
      categories: [],
      searchValue: '',
      min: 0,
      max: 0,
      sortBy: '',
      tokenValue: 'Select',
    });
    setPriceFilter({ min: 0, max: 0 });
    setOpenFilter(false);
  };

  const TABLE_MENU_ITEMS = {
    [COLLECTION_TABS.COLLECTED]: [
      {
        key: COLLECTION_TABLE_MENU_OPTIONS.VIEW_DETAILS,
        label: <span>View Details</span>,
        icon: <Eye size={16} />,
      },
      {
        key: COLLECTION_TABLE_MENU_OPTIONS.LIST_TOKENS,
        label: <span>List Tokens</span>,
        icon: <Tag size={16} />,
      },
    ],
    [COLLECTION_TABS.FOR_SALE]: [
      {
        key: COLLECTION_TABLE_MENU_OPTIONS.VIEW_DETAILS,
        label: <span>View Details</span>,
        icon: <Eye size={16} />,
      },
      {
        key: COLLECTION_TABLE_MENU_OPTIONS.CANCEL_LISTING,
        label: <span>Cancel Listing</span>,
        icon: <XCircle size={16} />,
      },
    ],
    [COLLECTION_TABS.SOLD]: [
      {
        key: COLLECTION_TABLE_MENU_OPTIONS.VIEW_DETAILS,
        label: <span>View Details</span>,
        icon: <Eye size={16} />,
      },
    ],
  };

  const tableMenuOptions: MenuProps['items'] = TABLE_MENU_ITEMS[activeKey];

  const homePageTabs = [
    {
      key: COLLECTION_TABS.COLLECTED,
      label: (
        <span>
          Collected
          <Badge
            count={collectionsCount?.response?.AssetCollected || 0}
            className={
              activeKey === COLLECTION_TABS.COLLECTED ? 'collection-active-badge' : 'collection-inactive-badge'
            }
          />
        </span>
      ),
      children: <></>,
    },
    {
      key: COLLECTION_TABS.FOR_SALE,
      label: (
        <span>
          For Sale
          <Badge
            count={collectionsCount?.response?.AssetListed || 0}
            className={activeKey === COLLECTION_TABS.FOR_SALE ? 'collection-active-badge' : 'collection-inactive-badge'}
          />
        </span>
      ),
      children: <></>,
    },
    {
      key: COLLECTION_TABS.SOLD,
      label: (
        <span>
          Sold
          <Badge
            count={collectionsCount?.response?.AssetSold || 0}
            className={activeKey === COLLECTION_TABS.SOLD ? 'collection-active-badge' : 'collection-inactive-badge'}
          />
        </span>
      ),
      children: <></>,
    },
  ];

  const recentlyBoughtOptions = [
    { value: 'recently-bought', label: 'Recently bought' },
    { value: 'price-high-to-low', label: 'Price high to low' },
    { value: 'price-low-to-high', label: 'Price low to high' },
  ];
  // const tokenValuesOptions = [
  //   {
  //     value: 'Increased',
  //     label: (
  //       <span className="d-flex align-center">
  //         <TrendingUp className="m-r-4" size={16} />
  //         Increased
  //       </span>
  //     ),
  //   },
  //   {
  //     value: 'Decreased',
  //     label: (
  //       <span className="d-flex align-center">
  //         <TrendingDown className="m-r-4" size={16} />
  //         Decreased
  //       </span>
  //     ),
  //   },
  // ];

  const collapseItems = [
    {
      key: '1',
      label: 'Price',
      children: (
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if ((priceFilter.min === 0 && priceFilter.max === 0) || priceFilter.min < priceFilter.max) {
              setPaginationInfo({ ...paginationInfo, currentPage: 1 });
              setFilterValues((prev) => ({ ...prev, min: priceFilter.min, max: priceFilter.max }));
              refetch();
            } else if (priceFilter.min >= priceFilter.max) {
              return showErrorToast('', 'Minimum price should lesser than maximum price.');
            }
          }}
        >
          <Select
            key={''}
            showSearch={false}
            style={{ width: '100%' }}
            placeholder={'USD'}
            className="h-44 f-14-16-500-secondary"
            options={[]}
          />
          <div className="d-flex align-center justify-space-between m-t-12">
            <div>
              <Input
                className="w-98 p-y-12"
                value={priceFilter.min === 0 ? '' : `${priceFilter.min}`}
                onChange={(e) => {
                  if (!Number.isNaN(parseInt(e.target.value || '0'))) {
                    setPriceFilter((prev) => ({ ...prev, min: parseInt(e.target.value || '0') }));
                  }
                }}
                placeholder="Min"
                required={false}
              />
            </div>
            <div>To</div>
            <div>
              <Input
                value={priceFilter.max === 0 ? '' : `${priceFilter.max}`}
                className="w-98 p-y-12"
                onChange={(e) => {
                  if (!Number.isNaN(parseInt(e.target.value || '0'))) {
                    setPriceFilter((prev) => ({ ...prev, max: parseInt(e.target.value || '0') }));
                  }
                }}
                placeholder="Max"
                required={false}
              />
            </div>
          </div>

          <Button type="submit" className="width-100 m-t-12 bg-primary">
            Apply
          </Button>
        </form>
      ),
    },
    {
      key: '2',
      label: 'Category',
      children: (
        <div className="collapse-category-container">
          {!isCategoryLoading && (
            <Checkbox.Group
              value={filterValues?.categories}
              onChange={(e: string[]) => {
                setPaginationInfo({ ...paginationInfo, currentPage: 1 });
                setFilterValues((prev) => ({ ...prev, categories: e }));
              }}
            >
              {categories?.response?.map(({ category, _id }, index) => (
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

  const TableAssetView = (name: string, record: CollectionListInterface, index: number) => (
    <div className="d-flex align-center gap-5 w-300" key={index}>
      <div>
        <Image src={record.images[0]} alt="Asset Image" width={50} height={50} />
      </div>
      <div className="text-ellipsis">{name}</div>
    </div>
  );

  const tabChangeHandler = (key: string) => {
    setActiveKey(key as COLLECTION_TABS);
    resetFilters();
    switch (key) {
      case COLLECTION_TABS.COLLECTED:
        setType(COLLECTION_TYPE.AssetCollected);
        break;
      case COLLECTION_TABS.FOR_SALE:
        setType(COLLECTION_TYPE.AssetListed);
        break;
      case COLLECTION_TABS.SOLD:
        setType(COLLECTION_TYPE.AssetSold);
        break;

      default:
        break;
    }
  };

  const onShowSizeChange = (pageSize: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      assetPerPage: pageSize,
    }));
  };
  const paginationHandler = (page: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const currentTabHasNoData = () => {
    if (!collectionsCount?.response) return true;

    switch (activeKey) {
      case COLLECTION_TABS.COLLECTED:
        return collectionsCount.response.AssetCollected === 0;
      case COLLECTION_TABS.FOR_SALE:
        return collectionsCount.response.AssetListed === 0;
      case COLLECTION_TABS.SOLD:
        return collectionsCount.response.AssetSold === 0;
      default:
        return true;
    }
  };

  return (
    <div className=" d-flex align-center justify-center">
      <div className="xl p-y-32">
        <h2 className="f-24-26-600-secondary m-b-24">My Collections</h2>
        {!isCollectionsCountLoading && (
          <TabsPanel tabs={homePageTabs} activeKey={activeKey} onTabChange={tabChangeHandler} className="custom-tab" />
        )}
        {!isCollectionsCountLoading && currentTabHasNoData() ? (
          <NoDataFound
            className="h-400"
            title={`No Collections Found`}
            description="There's nothing to display here yet. Check back later!"
          />
        ) : (
          <>
            <Row gutter={10} className="m-t-20 m-b-10">
              <Col span={2}>
                <Button
                  className="border-secondary-1 gap-0 collection-filter-button"
                  onClick={() => setOpenFilter(!openFilter)}
                >
                  <span className="d-flex align-center">
                    {!openFilter ? (
                      <ChevronLeft size={20} className="m-r-4" />
                    ) : (
                      <ListFilter size={20} className="m-r-4" />
                    )}
                    Filters
                  </span>
                </Button>
              </Col>
              {/* <Col span={3}>
                <Select
                  key={''}
                  value={filterValues.tokenValue}
                  showSearch={false}
                  style={{ width: '100%' }}
                  placeholder={'Token Value'}
                  className="h-44 f-14-16-500-secondary"
                  options={tokenValuesOptions}
                  onSelect={(e) => setFilterValues((prev) => ({ ...prev, tokenValue: e }))}
                />
              </Col> */}
              <Col span={17}>
                <SearchBox
                  placeHolder="Search Assets"
                  className="h-44 radius-2"
                  value={filterValues.searchValue}
                  autoFocus={false}
                  onChange={(e) => {
                    setPaginationInfo({ ...paginationInfo, currentPage: 1 });
                    setFilterValues((prev) => ({ ...prev, searchValue: e }));
                  }}
                  onClear={() => {
                    setPaginationInfo({ ...paginationInfo, currentPage: 1 });
                    setFilterValues((prev) => ({ ...prev, searchValue: '' }));
                  }}
                />
              </Col>
              <Col span={3}>
                <Select
                  key={''}
                  showSearch={false}
                  style={{ width: '100%' }}
                  placeholder={'Recently Bought'}
                  className="h-44 f-14-16-500-secondary"
                  onChange={(e) => {
                    setPaginationInfo({ ...paginationInfo, currentPage: 1 });
                    setFilterValues((prev) => ({ ...prev, sortBy: e }));
                  }}
                  options={recentlyBoughtOptions}
                />
              </Col>
              <Col span={2}>
                <div className="border-secondary-1 p-x-8 p-y-8 radius-6">
                  <div className="d-flex align-center justify-center gap-1">
                    <span
                      className={`${collectionsView === collectionsViewValues.list ? 'bg-secondary' : 'bg-white'} p-4 d-flex align-center cursor-pointer`}
                      onClick={() => setCollectionsView(collectionsViewValues.list)}
                    >
                      <List size={20} />
                    </span>
                    <span
                      className={`${collectionsView === collectionsViewValues.grid ? 'bg-secondary' : 'bg-white'} p-4 d-flex align-center cursor-pointer`}
                      onClick={() => setCollectionsView(collectionsViewValues.grid)}
                    >
                      <LayoutGrid size={20} />
                    </span>
                  </div>
                </div>
              </Col>
            </Row>

            <div>
              <Row gutter={10}>
                <Col span={openFilter ? 0 : 5}>
                  <div className="collection-collapse-container">
                    <Collapse
                      items={collapseItems}
                      className="d-block"
                      defaultActiveKey={['1']}
                      expandIconPosition="end"
                    />
                  </div>
                </Col>
                <Col span={openFilter ? 24 : 19}>
                  {filterValues?.categories && (
                    <Row wrap={true} gutter={[8, 8]}>
                      {filterValues?.categories?.map((item, index) => (
                        <div key={index} className="m-b-10 collections-tags-container">
                          <AntdTag
                            closable
                            onClose={(e) => {
                              e.preventDefault();
                              setFilterValues((prev) => ({
                                ...prev,
                                categories: prev?.categories?.filter((prev_cat) => prev_cat !== item),
                              }));
                            }}
                            className="p-8"
                          >
                            {item}
                          </AntdTag>
                        </div>
                      ))}
                    </Row>
                  )}
                  <div className="collection-view-container">
                    {collectionsView === collectionsViewValues.list ? (
                      <TableComponent
                        rowKey={(record) => `${record._id}-${Math.random().toString(36).slice(2, 9)}`}
                        columns={[
                          {
                            title: 'Asset',
                            dataIndex: 'name',
                            key: 'name',
                            render: TableAssetView,
                            width: 300,
                          },
                          {
                            title: 'Category',
                            dataIndex: 'category',
                            key: 'category',
                            align: 'center',
                          },
                          {
                            title: 'Available Tokens',
                            dataIndex: 'tokensBought',
                            key: 'noOfTokens',
                            align: 'center',
                            width: 150,
                            render: (value) => (
                              <p className="d-flex align-center justify-center">
                                {activeKey !== COLLECTION_TABS.SOLD ? value : '-'}
                              </p>
                            ),
                          },
                          // {
                          //   title: 'Total Token Value',
                          //   dataIndex: 'totalValue',
                          //   key: 'totalValue',
                          //   align: 'center',
                          //   render: (value, record, index) => {
                          //     return (
                          //       <Popover
                          //         arrow={false}
                          //         trigger={['hover']}
                          //         content={<NoOfTokensView value={value} record={record} index={index} />}
                          //       >
                          //         {String(value).startsWith('-') ? (
                          //           <TrendingDown className="icon-18-red position-relative top-8 m-r-8" />
                          //         ) : (
                          //           <TrendingUp className="icon-18-success position-relative top-8 m-r-8" />
                          //         )}
                          //         {value}
                          //       </Popover>
                          //     );
                          //   },
                          // },
                          {
                            title: '',
                            dataIndex: null,
                            key: 'options',
                            width: 62,
                            onCell: () => ({ className: 'hover-container' }),
                            render: (record) => {
                              return (
                                <DropdownComponent
                                  menuItems={tableMenuOptions}
                                  label={
                                    <div className="bg-secondary hover-cell p-y-8 d-flex align-center justify-center radius-100">
                                      <Ellipsis className="img-16" />
                                    </div>
                                  }
                                  handleClick={(params) => {
                                    if (params.key === COLLECTION_TABLE_MENU_OPTIONS.VIEW_DETAILS) {
                                      router.push(`/asset/${record.assetId}`);
                                    } else if (params.key === COLLECTION_TABLE_MENU_OPTIONS.LIST_TOKENS) {
                                      router.push(`/asset/${record.assetId}?type=${ASSSET_ACTION.SELL}`);
                                    } else {
                                      handleDeleteListings(record._id);
                                    }
                                  }}
                                  dropdownPlacement="bottom"
                                  triggerAction={['hover']}
                                />
                              );
                            },
                          },
                        ]}
                        data={collectionsList?.response?.assets ?? []}
                        pagination={false}
                        onRowClick={(record: CollectionListInterface) => {
                          if (activeKey === COLLECTION_TABS.COLLECTED) {
                            router.push(`/asset/${record.assetId}?type=${ASSSET_ACTION.SELL}`);
                          } else {
                            router.push(`/asset/${record.asset.assetId}?type=${ASSSET_ACTION.SELL}`);
                          }
                        }}
                        loading={isLoading}
                      />
                    ) : (
                      <section
                        className={`collection-grid-view-container d-grid ${openFilter ? 'grid-cols-4' : collectionsList?.response && collectionsList?.response?.assets?.length > 0 ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}
                      >
                        {collectionsList?.response.assets && collectionsList?.response?.assets?.length > 0 ? (
                          collectionsList?.response?.assets?.map((list: CollectionListInterface, index) => (
                            <div key={index}>
                              <GridViewCard item={list} showWishList={true} />
                            </div>
                          ))
                        ) : (
                          <div className="d-flex width-100 align-center justify-center">
                            <Empty />
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                  {collectionsList?.response && collectionsList?.response?.totalAssets >= 10 ? (
                    <section className="d-flex align-center justify-space-between m-t-20 collection-pagination-container">
                      <div>
                        <p>
                          Showing {(paginationInfo.currentPage - 1) * paginationInfo.assetPerPage + 1} -
                          {paginationInfo.currentPage * paginationInfo.assetPerPage > paginationInfo.totalAssets
                            ? paginationInfo.totalAssets
                            : paginationInfo.currentPage * paginationInfo.assetPerPage}{' '}
                          of {paginationInfo.totalAssets} assets
                        </p>
                      </div>
                      <div className="d-flex align-center justify-center">
                        <Pagination
                          showSizeChanger={false}
                          current={paginationInfo.currentPage}
                          pageSize={paginationInfo.assetPerPage}
                          total={paginationInfo.totalAssets}
                          onChange={paginationHandler}
                        />
                        <Select value={paginationInfo.assetPerPage} onChange={onShowSizeChange}>
                          <Select.Option value={10}>10 / page</Select.Option>
                          <Select.Option value={20}>20 / page</Select.Option>
                          <Select.Option value={50}>50 / page</Select.Option>
                          <Select.Option value={100}>100 / page</Select.Option>
                        </Select>
                      </div>
                    </section>
                  ) : null}
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
