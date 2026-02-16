import Cookies from 'js-cookie';
import { useEffect } from 'react';

import { useGetUserDetailsQuery } from '@/redux/apis/user.api';

import { useCookieListener } from './useCookieListener';

export const useUserListener = (refetch = false) => {
  const isTokenAdded = useCookieListener();
  const { data: userResponse } = useGetUserDetailsQuery(
    {},
    {
      skip: !isTokenAdded,
      refetchOnMountOrArgChange: refetch,
    },
  );

  const userData = userResponse?.response;

  useEffect(() => {
    if (userData) {
      Cookies.set('user', JSON.stringify(userData));
      window.dispatchEvent(new Event('userAdded'));
    }
  }, [userData]);

  return userData || null;
};
