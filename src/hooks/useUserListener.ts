import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { getUserFromCookies } from '@/helpers/services/get-user-data';
import { useLazyGetUserDetailsQuery } from '@/redux/apis/user.api';

export const useUserListener = (refetch = false) => {
  const [userData, setUserData] = useState(() => getUserFromCookies() || null);
  const [getUserDetail] = useLazyGetUserDetailsQuery();

  useEffect(() => {
    const handleUserAdded = async () => {
      let user = null;

      if (refetch) {
        const userDetail = await getUserDetail({}).unwrap();

        user = userDetail?.response;
        Cookies.set('user', JSON.stringify(userDetail?.response ?? {}));
      } else {
        user = getUserFromCookies();
      }

      setUserData(user || null);
    };

    const handleUserDeleted = () => {
      setUserData(null);
    };

    window.addEventListener('userAdded', handleUserAdded);
    window.addEventListener('userDeleted', handleUserDeleted);

    return () => {
      window.removeEventListener('userAdded', handleUserAdded);
      window.removeEventListener('userDeleted', handleUserDeleted);
    };
  }, [refetch]);

  return userData;
};
