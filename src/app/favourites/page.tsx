'use client';
import {
  Collapse,
  Col,
  Row,
  Select,
  Checkbox,
  Input,
  MenuProps,
  Tag as AntdTag,
  Pagination,
  Empty,
  Popover,
} from 'antd';
import { Eye, Ellipsis, List, LayoutGrid, ListFilter, TrendingUp, ChevronLeft, HeartOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { NoDataFound } from '@/components/no-data-found/no-data-found';
import { NoOfTokensView } from '@/components/token-view/token-view';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { SearchBox } from '@app/component/search-box/search-box';
import Button from '@components/button/button';
import DropdownComponent from '@components/drop-down/drop-down';
import { GridViewCard } from '@components/Grid-card/grid-card';
import { TableComponent } from '@components/table/table';
import { useToast } from '@helpers/notifications/toast.notification';
import { useGetCategoriesListQuery } from '@redux/apis/asset.api';
import { useGetFavouritesListQuery } from '@redux/apis/collections.api';
import { CollectionListInterface } from '@redux/utils/interfaces/collections-api.interface';

import '../collections/collection.scss';

export default function Collections() {
  const router = useRouter();
  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesListQuery();

  const collectionsViewValues = {
    list: 'list',
    grid: 'grid',
  };
  const [collectionsView, setCollectionsView] = useState(collectionsViewValues.list);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterValues, setFilterValues] = useState<{ categories: string[]; sortBy: string }>({
    categories: [],
    sortBy: '',
  });
  const [price, setPrice] = useState({
    min: 0,
    max: 0,
  });
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    assetPerPage: 10,
    totalAssets: 0,
  });
  const [searchValue, setSearchValue] = useState('');
  const [hadDataBefore, setHadDataBefore] = useState(false);
  const debouncedValue = useDebouncedSearch(searchValue, 500);
  const { showErrorToast } = useToast();

  useEffect(() => {
    setFilterValues((prev) => ({ ...prev, searchValue: debouncedValue }));
    setPaginationInfo({ ...paginationInfo, currentPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const {
    data: favourites,
    isLoading,
    refetch,
    isFetching,
  } = useGetFavouritesListQuery({ filterValues, paginationInfo }, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (favourites?.response?.assets && favourites?.response?.assets.length > 0) {
      setHadDataBefore(true);
    }
  }, [favourites?.response?.assets]);

  useEffect(() => {
    if (favourites?.response?.assets) {
      setPaginationInfo((prev) => ({
        ...prev,
        totalAssets: favourites?.response?.totalAssets,
      }));
    }
  }, [favourites]);

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
              setPaginationInfo({ ...paginationInfo, currentPage: 1 });
              setFilterValues((prev) => ({ ...prev, min: price.min, max: price.max }));
              refetch();
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
          <div className="d-flex align-center justify-space-between m-t-12">
            <div>
              <Input
                className="w-98 p-y-12"
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
                className="w-98 p-y-12"
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

          <Button className="width-100 m-t-12 bg-primary">Apply</Button>
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
                setPaginationInfo({ ...paginationInfo, currentPage: 1 });
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

  const tableMenuOptions: MenuProps['items'] = [
    {
      key: 'view',
      label: <span>View asset</span>,
      icon: <Eye size={16} />,
    },
    {
      key: 'remove',
      label: <span>Remove</span>,
      icon: <HeartOff size={16} />,
    },
  ];

  const TableAssetView = (name: string, record: Record<string, unknown>, index: number) => (
    <div className="d-flex align-center gap-5 w-300" key={index}>
      <div>
        <Image src={(record as CollectionListInterface).images[0]} alt="Asset Image" width={50} height={50} />
      </div>
      <div className="text-ellipsis">{name}</div>
    </div>
  );

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

  const isFiltersEmpty = useMemo(
    () =>
      filterValues.categories.length === 0 &&
      !filterValues.sortBy &&
      !searchValue &&
      price.min === 0 &&
      price.max === 0,
    [filterValues, searchValue, price],
  );

  return (
    <div className=" d-flex align-center justify-center">
      <div className="xl p-y-32">
        <h2 className="f-24-26-600-secondary m-b-24">Favourites</h2>
        {(favourites?.response?.assets && favourites?.response?.assets.length > 0) ||
        hadDataBefore ||
        !isFiltersEmpty ||
        isLoading ||
        isFetching ? (
          <>
            <div className="d-flex align-center justify-space-between gap-3 m-y-20">
              <div>
                <Button
                  className="border-secondary-1 gap-0 collection-filter-button"
                  onClick={() => setOpenFilter(!openFilter)}
                >
                  {!openFilter ? <ChevronLeft size={20} /> : <ListFilter size={20} />} <span>Filters</span>
                </Button>
              </div>
              <div className="width-75">
                <SearchBox
                  placeHolder="Search Assets"
                  className="width-100 h-44 radius-6"
                  value={searchValue}
                  autoFocus={false}
                  onChange={(e) => {
                    setSearchValue(e);
                  }}
                  onClear={() => setSearchValue('')}
                />
              </div>

              <div>
                <Select
                  key={'select-2'}
                  showSearch={false}
                  style={{ width: '100%' }}
                  placeholder={'Recently Added'}
                  className="h-44 f-14-16-500-secondary"
                  onChange={(e) => {
                    setPaginationInfo({ ...paginationInfo, currentPage: 1 });
                    setFilterValues((prev) => ({ ...prev, sortBy: e }));
                  }}
                  options={recentlyAddedOptions}
                />
              </div>

              <div className="border-secondary-1 p-x-8 p-y-8 radius-6">
                <div className="d-flex align-center gap-1">
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
            </div>

            <div>
              <Row gutter={10}>
                <Col span={openFilter ? 0 : 5}>
                  <div className="collection-collapse-container">
                    <Collapse
                      accordion={true}
                      items={collapseItems}
                      className="d-block"
                      defaultActiveKey={['price']}
                      expandIconPosition="end"
                    />
                  </div>
                </Col>
                <Col span={openFilter ? 24 : 19}>
                  {filterValues?.categories &&
                    filterValues?.categories?.map((item, index) => (
                      <div key={index} className="m-b-10">
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
                            title: 'Price Per Token',
                            dataIndex: 'price',
                            key: 'price',
                            align: 'center',
                            render: (value, record, index) => {
                              return (
                                <Popover
                                  arrow={false}
                                  trigger={['hover']}
                                  content={<NoOfTokensView value={value} record={record} index={index} />}
                                >
                                  <TrendingUp className="icon-18-success position-relative top-8 m-r-8" /> {value}
                                </Popover>
                              );
                            },
                          },
                          {
                            key: 'dropdown',
                            title: '',
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
                                    if (params.key === 'view') {
                                      router.push(`/asset/${record.assetId}`);
                                    } else {
                                    }
                                  }}
                                  triggerAction={['hover']}
                                  dropdownPlacement="bottomRight"
                                />
                              );
                            },
                          },
                        ]}
                        data={favourites?.response?.assets ?? []}
                        loading={isLoading || isFetching}
                        pagination={false}
                        onRowClick={(record: Record<string, unknown>) => {
                          router.push(`/asset/${record.assetId}`);
                        }}
                      />
                    ) : (
                      <section
                        className={`collection-grid-view-container d-grid ${openFilter ? 'grid-cols-4' : favourites?.response && favourites?.response?.assets?.length > 0 ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}
                      >
                        {favourites?.response?.assets && favourites?.response?.assets.length > 0 ? (
                          favourites?.response?.assets &&
                          favourites?.response?.assets?.map((item: CollectionListInterface, index) => (
                            <GridViewCard key={index} item={item} showWishList={true} refetch={refetch} />
                          ))
                        ) : (
                          <div className="d-flex width-100 align-center justify-center">
                            <Empty />
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                  {favourites?.response?.assets && favourites?.response?.totalAssets >= 10 ? (
                    <section className="d-flex align-center justify-space-between m-t-20 collection-pagination-container">
                      <div>
                        <p>
                          Showing {(paginationInfo.currentPage - 1) * paginationInfo.assetPerPage + 1} -
                          {paginationInfo.currentPage * paginationInfo.assetPerPage > paginationInfo.totalAssets
                            ? paginationInfo.totalAssets
                            : paginationInfo.currentPage * paginationInfo.assetPerPage}
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
        ) : (
          <NoDataFound
            className="h-400"
            title="No Favourites Found"
            description="There’s nothing to display here yet. Check back later!"
          />
        )}
      </div>
    </div>
  );
}
