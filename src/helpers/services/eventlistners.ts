import Cookies from 'js-cookie';

// Dispatch custom events safely in the browser
const dispatchCookieEvent = (eventName: string) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(eventName);

    window.dispatchEvent(event);
  }
};

export const setCookies = (cookieName: string, cookieValue: string) => {
  Cookies.set(cookieName, cookieValue, { expires: 1, secure: true, sameSite: 'Strict' });
  dispatchCookieEvent('cookieAdded');
};

export const removeCookie = (cookieName: string) => {
  Cookies.remove(cookieName);
  dispatchCookieEvent('cookieDeleted');
};

export const triggerLoginRequired = () => {
  dispatchCookieEvent('loginRequired');
};

export const setUser = (cookieName: string, cookieValue: string) => {
  Cookies.set(cookieName, cookieValue, { expires: 1, secure: true, sameSite: 'Strict' });
  dispatchCookieEvent('userAdded');
};

export const removeUser = (cookieName: string) => {
  Cookies.remove(cookieName);
  dispatchCookieEvent('userDeleted');
};
