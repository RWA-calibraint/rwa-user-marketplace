import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { ENV_CONFIGS } from '@/helpers/constants/configs/env-vars';
import { triggerLoginRequired, removeCookie, removeUser } from '@/helpers/services/eventlistners';

import { ERROR_MESSAGE } from '../utils/constants';

const baseQuery = fetchBaseQuery({
  baseUrl: ENV_CONFIGS.API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    removeCookie('token');
    removeUser('user');
    triggerLoginRequired();
    result.error = {
      ...result.error,
      data: { message: ERROR_MESSAGE.SESSION_EXPIRED },
    };
  } else if (result.error?.status === 500) {
    window.location.replace('/serverError');
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});
