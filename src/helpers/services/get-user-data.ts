import Cookies from 'js-cookie';

export const getUserFromCookies = () => {
  try {
    const userCookie = Cookies.get('user');

    return userCookie ? JSON.parse(userCookie) : null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching user data from Cookies:', err);

    return null;
  }
};
