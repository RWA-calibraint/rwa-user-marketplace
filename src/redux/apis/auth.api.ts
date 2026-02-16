import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { setCookies } from '@/helpers/services/eventlistners';
import { ENV_CONFIGS } from '@helpers/constants/configs/env-vars';

import { API_METHODS, END_POINTS } from '../utils/constants';

const baseQuery = fetchBaseQuery({
  baseUrl: ENV_CONFIGS.API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');

    return headers;
  },
  credentials: 'include',
  responseHandler: async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    socialSignin: builder.query({
      query: () => END_POINTS.socialSignin,
    }),
    confirmSocialSignin: builder.query({
      query: (code) => END_POINTS.confirmSocialSignin(code),
      async onQueryStarted(_args, { queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data?.response?.accessToken) {
          setCookies('token', data?.response?.accessToken);
        }
      },
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: END_POINTS.signup,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: END_POINTS.signin,
        method: API_METHODS.POST,
        body: data,
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data?.accessToken) {
          setCookies('token', data.accessToken);
        }
      },
    }),
    confirmSignup: builder.mutation({
      query: (data) => ({
        url: END_POINTS.confirmSignup,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: END_POINTS.forgetPassword,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: END_POINTS.resetPassword,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: END_POINTS.logout,
        method: API_METHODS.POST,
        body: data,
      }),
    }),
  }),
});

export const {
  useLazySocialSigninQuery,
  useLazyConfirmSocialSigninQuery,
  useSignupMutation,
  useSigninMutation,
  useConfirmSignupMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
