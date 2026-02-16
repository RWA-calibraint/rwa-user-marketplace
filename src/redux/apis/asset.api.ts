import { API_METHODS, END_POINTS } from '../utils/constants';
import { SubmitExclusiveAssetBodyData } from '../utils/interfaces/asset-api.interface';

import {
  AssetListParams,
  AssetListResponse,
  AssetListStatusParams,
  AssetResponse,
  BadgeCountResponse,
  CategoryListResponse,
  CategoryResponse,
  ExclusiveAssetResponse,
  PriceHistoryResponse,
  AssetDraftResponse,
  CountResponse,
  AssetId,
  FavouritesResponse,
  AssetListingResponse,
  AssetListingInterface,
} from './interface';

import { baseApi } from '.';

export const assetApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAsset: builder.query<AssetResponse, string>({
      query: (assetId) => ({
        url: END_POINTS.getAssetById(assetId),
        method: API_METHODS.GET,
      }),
    }),

    getSoldAssetList: builder.query<AssetListResponse, AssetListParams>({
      query: ({ search, category, page = 1, limit = 10, startDate, endDate, min = '', max = '', sortBy = '' }) => {
        let url = END_POINTS.getAssetList(page, limit);

        if (search) url = `${url}&searchValue=${search}`;

        if (category) url = `${url}&categories=${category}`;
        if (startDate && endDate) url = `${url}&from=${startDate}&to=${endDate}`;
        url = `${url}&min=${min}&max=${max}&sortBy=${sortBy}`;

        return {
          url,
          method: API_METHODS.GET,
        };
      },
    }),

    getAssetListByStatus: builder.query<AssetListResponse, AssetListStatusParams>({
      query: ({
        status,
        search,
        category,
        page = 1,
        limit = 10,
        startDate = '',
        endDate = '',
        min = '',
        max = '',
        sortBy = '',
      }) => ({
        url: END_POINTS.getAssetByStatus(status, search, category, page, limit, startDate, endDate, min, max, sortBy),
        method: API_METHODS.GET,
      }),
    }),

    getLiveAssetsList: builder.query<AssetListResponse, void>({
      query: () => ({
        url: END_POINTS.getLiveAssetsList,
        method: API_METHODS.GET,
      }),
    }),

    getCategoriesList: builder.query<CategoryListResponse, void>({
      query: () => ({
        url: END_POINTS.getCategoryList,
        method: API_METHODS.GET,
      }),
    }),

    getBadgeCount: builder.query<BadgeCountResponse, void>({
      query: () => ({
        url: END_POINTS.getBadgeCount,
        method: API_METHODS.GET,
      }),
    }),
    featureAsset: builder.query({
      query: () => ({
        url: END_POINTS.getFeatureAsset,
        method: API_METHODS.GET,
      }),
    }),
    getExclusiveAccess: builder.query<ExclusiveAssetResponse, string>({
      query: (assetId) => ({
        url: `${END_POINTS.getExclusiveAccess}/${assetId}`,
        method: API_METHODS.GET,
      }),
    }),
    submitExclusiveAccess: builder.mutation<ExclusiveAssetResponse, SubmitExclusiveAssetBodyData>({
      query: (submitExclusiveAccessBody) => ({
        url: END_POINTS.submitExclusiveAccess,
        method: API_METHODS.POST,
        body: submitExclusiveAccessBody,
      }),
    }),
    getPriceHistory: builder.query<PriceHistoryResponse, string>({
      query: (assetId) => ({
        url: END_POINTS.getPriceHistory(assetId),
        method: API_METHODS.GET,
      }),
    }),
    getAssetCategories: builder.query<CategoryResponse, void>({
      query: () => END_POINTS.getCategoryList,
    }),

    assetPartialSearch: builder.query({
      query: (searchValue) => `${END_POINTS.assetPartialSearch}?searchValue=${searchValue}`,
    }),

    getAssetDraft: builder.query<AssetDraftResponse, void>({
      query: () => ({
        url: END_POINTS.getAssetDraft,
        method: API_METHODS.GET,
      }),
    }),
    getImageAnalysis: builder.mutation({
      query: ({ data }) => ({
        url: END_POINTS.imageAnalysis,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    getAllFavourites: builder.query<FavouritesResponse, void>({
      query: () => ({
        url: END_POINTS.getFavourites,
        method: API_METHODS.GET,
      }),
    }),
    getFavouritesCount: builder.query<CountResponse, AssetId>({
      query: ({ id }) => ({
        url: END_POINTS.getFavouritesCount(id),
        method: API_METHODS.GET,
      }),
    }),
    addFavourite: builder.mutation({
      query: (data) => ({
        url: END_POINTS.addfavourite,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    getAllViews: builder.query<CountResponse, AssetId>({
      query: ({ id }) => ({
        url: END_POINTS.getViewsCount(id),
        method: API_METHODS.GET,
      }),
    }),
    addViews: builder.mutation<CountResponse, AssetId>({
      query: ({ id }) => ({
        url: END_POINTS.addViews(id),
        method: API_METHODS.POST,
      }),
    }),
    listAssets: builder.mutation<AssetListingResponse, AssetListingInterface>({
      query: (data) => ({
        url: END_POINTS.listAsset,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    deleteListings: builder.mutation<AssetListingResponse, string>({
      query: (listingId) => ({
        url: END_POINTS.deleteListings(listingId),
        method: API_METHODS.DELETE,
      }),
    }),
    deleteDraft: builder.mutation<AssetListResponse, string>({
      query: (assetId: string) => ({
        url: END_POINTS.deleteDraft(assetId),
        method: API_METHODS.DELETE,
      }),
    }),
  }),
});

export const {
  useGetAssetQuery,
  useGetSoldAssetListQuery,
  useGetAssetListByStatusQuery,
  useGetBadgeCountQuery,
  useGetCategoriesListQuery,
  useFeatureAssetQuery,
  useSubmitExclusiveAccessMutation,
  useGetExclusiveAccessQuery,
  useGetPriceHistoryQuery,
  useGetAssetCategoriesQuery,
  useAssetPartialSearchQuery,
  useLazyAssetPartialSearchQuery,
  useGetAssetDraftQuery,
  useGetImageAnalysisMutation,
  useGetAllViewsQuery,
  useGetAllFavouritesQuery,
  useGetFavouritesCountQuery,
  useAddFavouriteMutation,
  useAddViewsMutation,
  useLazyGetPriceHistoryQuery,
  useLazyGetExclusiveAccessQuery,
  useGetLiveAssetsListQuery,
  useListAssetsMutation,
  useDeleteListingsMutation,
  useDeleteDraftMutation,
} = assetApi;
