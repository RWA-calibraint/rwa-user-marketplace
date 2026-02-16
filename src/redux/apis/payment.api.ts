import { API_METHODS, END_POINTS } from '../utils/constants';
import {
  BuyAssetApiResponse,
  BuyAssetBodyData,
  createStripeApi,
  GetOrdersDetailsResponse,
  PaymentQueryParams,
  CreateStripeResponse,
} from '../utils/interfaces/payment-api.interface';

import { baseApi } from '.';

export const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOrders: builder.query<GetOrdersDetailsResponse, PaymentQueryParams>({
      query: ({ page = 1, limit = 10, searchValue, categories, from, to, paymentStatus }) => {
        let url = END_POINTS.getCanceledOrder(page, limit);

        if (searchValue) url = `${url}&searchValue=${searchValue}`;

        if (categories) url = `${url}&categories=${categories}`;
        if (from && to) url = `${url}&from=${from}&to=${to}`;
        if (paymentStatus) url = `${url}&paymentStatus=${paymentStatus}`;

        return {
          url,
          method: API_METHODS.GET,
        };
      },
    }),

    buyAsset: builder.mutation<BuyAssetApiResponse, BuyAssetBodyData>({
      query: (bodyData) => ({ url: END_POINTS.buyToken, method: API_METHODS.POST, body: bodyData }),
    }),

    createStripeAccount: builder.mutation<CreateStripeResponse, createStripeApi>({
      query: (bodyData) => ({ url: END_POINTS.createStripeAccount, method: API_METHODS.POST, body: bodyData }),
    }),

    getStripeLoginLink: builder.query({
      query: (accountId) => ({
        url: END_POINTS.getStripeLoginLink(accountId),
        method: API_METHODS.GET,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useBuyAssetMutation,
  useCreateStripeAccountMutation,
  useLazyGetStripeLoginLinkQuery,
} = paymentApi;
