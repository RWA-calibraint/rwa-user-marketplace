import Cookies from 'js-cookie';

export const getUserFromCookies = () => {
  try {
    const userCookie = Cookies.get('user');

    return userCookie ? JSON.parse(userCookie) : null;
  } catch (err) {
    return null;
  }
};
