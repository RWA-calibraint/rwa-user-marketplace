import { API_METHODS, END_POINTS } from '../utils/constants';

import { baseApi } from '.';

export const createAssetApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createAsset: builder.mutation({
      query: (data) => ({
        url: END_POINTS.createAsset,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    uploadDocument: builder.mutation({
      query: (data) => ({
        url: END_POINTS.uploadDocuments,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    updateAsset: builder.mutation({
      query: ({ assetId, formData }) => ({
        url: END_POINTS.updateAsset(assetId),
        method: API_METHODS.POST,
        body: formData,
      }),
    }),
    deleteAsset: builder.mutation({
      query: (assetId) => ({
        url: END_POINTS.deleteAsset(assetId),
        method: API_METHODS.DELETE,
      }),
    }),
    assetsDraft: builder.mutation({
      query: (data) => ({
        url: END_POINTS.assetsDraft,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateAssetMutation,
  useUploadDocumentMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useAssetsDraftMutation,
} = createAssetApi;
