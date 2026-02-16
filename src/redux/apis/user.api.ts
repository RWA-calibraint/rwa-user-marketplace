import { API_METHODS, END_POINTS } from '../utils/constants';
import { updateWalletAddress, VerifyCryptoAddressResponse } from '../utils/interfaces/user.interface';

import {
  createApplicantInterface,
  CreateApplicantResponse,
  verificationResponse,
  verificationInterface,
  KycProfile,
} from './interface';

import { baseApi } from '.';

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => END_POINTS.getUserDetail,
    }),

    updateUser: builder.mutation({
      query: (updatedData) => {
        const formData = new FormData();

        if (updatedData?.file) {
          formData.append('file', updatedData?.file);
        }

        formData.append('updatedData', JSON.stringify(updatedData?.updatedData));
        formData.append('update_type', updatedData?.update_type);

        return {
          url: END_POINTS.updateUser,
          method: API_METHODS.POST,
          body: formData,
        };
      },
    }),

    getUserRewards: builder.query({
      query: () => END_POINTS.userRewards,
    }),

    createApplicant: builder.mutation<CreateApplicantResponse, createApplicantInterface>({
      query: (bodyParams) => ({
        url: END_POINTS.createApplicant,
        method: API_METHODS.POST,
        body: bodyParams,
      }),
    }),

    getVerificationUrl: builder.query<verificationResponse, verificationInterface>({
      query: ({ applicantId }) => END_POINTS.getVerificationUrl(applicantId),
    }),

    getApplicantDetails: builder.query<KycProfile, verificationInterface>({
      query: ({ applicantId }) => END_POINTS.getApplicantDetails(applicantId),
    }),

    updateWalletAddress: builder.mutation<void, updateWalletAddress>({
      query: (bodyData) => ({ url: END_POINTS.updateWalletAddress, method: API_METHODS.POST, body: bodyData }),
    }),
    sendContactEmail: builder.mutation({
      query: (contactDetails) => {
        return {
          url: END_POINTS.sendContactEmail,
          method: API_METHODS.POST,
          body: contactDetails,
        };
      },
    }),

    verifyCryptoAddress: builder.mutation<VerifyCryptoAddressResponse, { walletAddress: string }>({
      query: (bodyData) => ({
        url: END_POINTS.verifyCryptoAddress,
        method: API_METHODS.POST,
        body: bodyData,
      }),
    }),

    aadhaarGenerateOtp: builder.mutation<
      { response: { referenceId: string; message: string } },
      { aadhaarNumber: string; reason: string }
    >({
      query: (bodyData) => ({
        url: END_POINTS.aadhaarGenerateOtp,
        method: API_METHODS.POST,
        body: bodyData,
      }),
    }),

    aadhaarVerifyOtp: builder.mutation<
      {
        response: {
          status: string;
          message: string;
          name: string;
          dateOfBirth: string;
          gender: string;
          address: string;
        };
      },
      { referenceId: string; otp: string }
    >({
      query: (bodyData) => ({
        url: END_POINTS.aadhaarVerifyOtp,
        method: API_METHODS.POST,
        body: bodyData,
      }),
    }),
    diditCreateSession: builder.mutation<
      {
        response_code: number;
        response_status: string;
        response: { url: string; sessionId: string; sessionToken: string };
      },
      void
    >({
      query: () => ({
        url: END_POINTS.diditCreateSession,
        method: API_METHODS.POST,
      }),
    }),

    diditGetDecision: builder.query<unknown, { sessionId: string }>({
      query: ({ sessionId }) => END_POINTS.diditGetDecision(sessionId),
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useLazyGetUserDetailsQuery,
  useUpdateUserMutation,
  useGetUserRewardsQuery,
  useCreateApplicantMutation,
  useLazyGetVerificationUrlQuery,
  useGetApplicantDetailsQuery,
  useLazyGetApplicantDetailsQuery,
  useUpdateWalletAddressMutation,
  useSendContactEmailMutation,
  useVerifyCryptoAddressMutation,
  useAadhaarGenerateOtpMutation,
  useAadhaarVerifyOtpMutation,
  useDiditCreateSessionMutation,
  useLazyDiditGetDecisionQuery,
} = userApi;
