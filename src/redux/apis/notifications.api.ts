import { API_METHODS, END_POINTS } from '../utils/constants';

import { NotificationsParams, NotificationsResponse } from './interface';

import { baseApi } from '.';

export const notificationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({
        url: END_POINTS.getNotifications,
        method: API_METHODS.GET,
      }),
    }),
    readAllNotifications: builder.mutation<NotificationsResponse, void>({
      query: () => ({
        url: END_POINTS.readAllNotifications,
        method: API_METHODS.POST,
      }),
    }),
    readSingleNotification: builder.mutation<NotificationsResponse, NotificationsParams>({
      query: (id) => ({
        url: END_POINTS.readOneNotification(id),
        method: API_METHODS.POST,
      }),
    }),
  }),
});

export const { useGetAllNotificationsQuery, useReadAllNotificationsMutation, useReadSingleNotificationMutation } =
  notificationsApi;
