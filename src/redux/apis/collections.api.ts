import { API_METHODS, END_POINTS } from '../utils/constants';
import {
  CollectionsCountResponse,
  CollectionsListResponse,
  FavouritesResponse,
} from '../utils/interfaces/collections-api.interface';

import { ListParams, FavouritesParams } from './interface';

import { baseApi } from '.';

export const collectionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCollectionsCount: builder.query<CollectionsCountResponse, string>({
      query: () => ({
        url: END_POINTS.getCollectionsCount,
        method: API_METHODS.GET,
      }),
    }),
    getCollectionsList: builder.query<CollectionsListResponse, ListParams>({
      query: ({ type, filterValues, paginationInfo }) => ({
        url:
          END_POINTS.getCollectionsList +
          `?type=${type}&filters=${JSON.stringify(filterValues)}&pagination=${JSON.stringify(paginationInfo)}`,
        method: API_METHODS.GET,
      }),
    }),
    getFavouritesList: builder.query<FavouritesResponse, FavouritesParams>({
      query: ({ filterValues, paginationInfo }) => ({
        url:
          END_POINTS.getFavourites +
          `?filters=${JSON.stringify(filterValues)}&pagination=${JSON.stringify(paginationInfo)}`,
        method: API_METHODS.GET,
      }),
    }),
  }),
});

export const { useGetCollectionsCountQuery, useGetCollectionsListQuery, useGetFavouritesListQuery } = collectionsApi;
