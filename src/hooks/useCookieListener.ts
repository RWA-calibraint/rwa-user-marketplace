import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

export const useCookieListener = () => {
  const [accessTokenAdded, setAccessTokenAdded] = useState<boolean>(!!Cookie.get('token'));

  useEffect(() => {
    window.addEventListener('cookieAdded', () => setAccessTokenAdded(true));
    window.addEventListener('cookieDeleted', () => setAccessTokenAdded(false));
  }, []);

  return accessTokenAdded;
};
