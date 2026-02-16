import Cookies from 'js-cookie';

export const isKycVerified = () => {
  const user = JSON.parse(Cookies.get('user') || '{}');

  if (!user || user === '') return false;

  if (user?.kycVerificationStatus === 'completed') {
    return true;
  }

  window.dispatchEvent(new Event('openKycPopup'));

  return false;
};
