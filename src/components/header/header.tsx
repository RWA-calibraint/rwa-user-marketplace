'use client';
import { Drawer } from 'antd';
import Cookies from 'js-cookie';
import { Search, User, ChevronDown, X as Close, Heart, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useActiveWallet, useDisconnect } from 'thirdweb/react';

import { showErrorToast } from '@/helpers/constants/toast.notification';
import { isKycVerified } from '@/helpers/services/kyc-verification';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useUserListener } from '@/hooks/useUserListener';
import { useFeatureAssetQuery, useGetLiveAssetsListQuery } from '@/redux/apis/asset.api';
import { useLazyConfirmSocialSigninQuery, useLogoutMutation } from '@/redux/apis/auth.api';
import { useLazyGetUserDetailsQuery } from '@/redux/apis/user.api';
import AuthModal from '@components/AuthModal/AuthModal';
import PasswordModal from '@components/AuthModal/PasswordModal';
import { ProfileDropdown } from '@components/ProfileDropdown/ProfileDropdown';
import { SearchBox } from '@components/search-box/search-box';
import { useToast } from '@helpers/notifications/toast.notification';
import { removeCookie } from '@helpers/services/eventlistners';
import { useCookieListener } from '@hooks/useCookieListener';
import { useUrlSearchParams } from '@hooks/useUrlSearchParams';

import { AuthDrawer } from '../AuthModal/AuthDrawer';
import WalletConnectButton from '../button/connect-wallet/WalletConnectButton';
import NotificationPopOver from '../drawer/notification-popover';

import KycModals from './Kyc-modals';
import './header.scss';

export const Header = () => {
  const user = Cookies.get('user');
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();
  const pathname = usePathname();
  const { deleteSearchParams } = useUrlSearchParams();
  const [logout] = useLogoutMutation();
  const [confirmSocialSign] = useLazyConfirmSocialSigninQuery();
  const [getUserDetail] = useLazyGetUserDetailsQuery();
  const { getParam } = useUrlSearchParams();
  const loginRequired = getParam('login-required', '');
  const isTokenAdded = useCookieListener();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'register' | 'confirmSignup' | 'forgot' | 'reset' | null>(null);
  const [email, setEmail] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [profileOpen, setprofileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [openSearchDrawer, setOpenSearchDrawer] = useState<boolean>(false);

  const { showSuccessToast } = useToast();
  const userData = useUserListener();
  const isMobileView = useMediaQuery('mobile');
  const { refetch: refetchFeaturedAssets } = useFeatureAssetQuery({});
  const { refetch: refetchLiveAssets } = useGetLiveAssetsListQuery();

  useEffect(() => {
    if (isClient) {
      refetchFeaturedAssets();
      refetchLiveAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, user, isTokenAdded]);

  useEffect(() => {
    const setModalTypeLogin = () => {
      setModalType('login');
    };

    window.addEventListener('loginRequired', setModalTypeLogin);

    return () => window.removeEventListener('loginRequired', setModalTypeLogin);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (loginRequired) {
      setModalType('login');
    }
    if (modalType === 'login' || modalType === 'register') {
      setIsDrawerOpen(true);
    }
  }, [loginRequired, modalType]);

  useEffect(() => {
    const code = window.location.search.includes('code');

    if (code) {
      (async () => {
        try {
          const result = await confirmSocialSign(window.location.search.split('=')[1]);

          if (result.data) {
            const userDetail = await getUserDetail({}).unwrap();

            Cookies.set('user', JSON.stringify(userDetail?.response ?? {}));
            deleteSearchParams(['code']);
            setModalType(null);
            window.dispatchEvent(new Event('userAdded'));
          }
        } catch (err) {
          showErrorToast(err);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullWidthPaths = ['/submission', '/orders', '/sold', '/cancelled-orders'];

  const renderAuthModal = () => {
    if (modalType === 'login' || modalType === 'register') {
      return (
        <AuthModal
          isOpen={modalType === 'login' || modalType === 'register'}
          type={modalType}
          setEmail={setEmail}
          setModalType={setModalType}
          setOpen={setprofileOpen}
        />
      );
    } else {
      return (
        <PasswordModal
          isOpen={modalType === 'forgot' || modalType === 'reset' || modalType === 'confirmSignup'}
          type={modalType}
          email={email}
          setEmail={setEmail}
          setModalType={setModalType}
        />
      );
    }
  };

  const handleLogout = () => {
    logout({}).unwrap();
    ['token', 'user'].forEach((cookie) => removeCookie(cookie));
    window.dispatchEvent(new Event('cookieChange'));
    window.dispatchEvent(new Event('userDeleted'));
    if (activeWallet) disconnect(activeWallet);
    showSuccessToast('You have logged out successfully');
    refetchFeaturedAssets();
    refetchLiveAssets();
  };

  const showDrawer = () => {
    setModalType('login');
    setIsDrawerOpen(true);
  };

  const onClose = () => {
    deleteSearchParams(['login-required']);
    setModalType(null);
    setIsDrawerOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('resetTabs'));
    window.location.href = '/';
  };

  const RenderLogo = () => (
    <Link className="d-flex bg-none cursor-pointer border-none icon-2-primary" href="/" onClick={handleHomeClick}>
      <Image src="/rareagora-logo.svg" alt="rareagora logo" width={isMobileView ? '135' : '200'} height={36} priority />
    </Link>
  );

  return (
    <>
      {!isMobileView ? (
        <div
          id="header"
          className="d-flex justify-center position-fixed top-0 width-100 z-index-10 bg-white hide-in-mobile-view "
        >
          {renderAuthModal()}
          <div
            className={`d-flex align-center justify-space-between p-y-20 ${fullWidthPaths.includes(pathname) ? 'p-x-80 width-100' : 'xl'}`}
          >
            <div className="d-flex align-center gap-4">
              <RenderLogo />
              <SearchBox className="flex-2 w-400" placeHolder="Search assets" autoFocus={false} />
            </div>
            <div className="d-flex flex-1 align-center justify-flex-end min-w-242 gap-7">
              <div className="d-flex align-center gap-5">
                <div className="d-flex align-center gap-1 w-82">
                  <div className="p-10 ">
                    <Heart
                      size={20}
                      className="cursor-pointer"
                      onClick={() => {
                        router.push('/favourites');
                      }}
                    />
                  </div>
                  <NotificationPopOver open={isOpen} setOpen={setIsOpen} userId={userData?._id} />
                </div>
                <button
                  className="d-flex align-center gap-1 p-10 cursor-pointer radius-360 bg-white"
                  style={{ border: '1px solid #1B7FAE' }}
                  onClick={() => {
                    if (isKycVerified(userData)) {
                      router.push('/sell');
                    } else {
                      window.dispatchEvent(new Event('openKycPopup'));
                    }
                  }}
                >
                  <Plus className="icon-20-brand-secondary" />
                  <span style={{ color: '#1B7FAE' }}>Sell Asset</span>
                </button>
                <WalletConnectButton />
                {isClient ? (
                  <>
                    <div className="min-w-70">
                      {!isTokenAdded ? (
                        <button
                          onClick={() => setModalType('login')}
                          className="btn btn-primary-default h-44 radius-360 d-flex align-center gap-2"
                        >
                          <User size={20} /> Sign in
                        </button>
                      ) : (
                        <button className="btn btn-primary-text p-x-4" onClick={() => setprofileOpen(true)}>
                          <ProfileDropdown onLogout={handleLogout} open={profileOpen} setOpen={setprofileOpen} />
                          <ChevronDown className="h-20 w-20 icon-2-primary" />
                        </button>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hide-in-desktop-view position-fixed top-0 width-100 z-index-10 bg-white mobile-view-header-container d-flex align-center justify-space-between p-y-14 p-x-24">
          {/* mobile view header */}
          {/* {renderAuthModal()} */}
          <div>
            <RenderLogo />
          </div>
          <div className="d-flex align-center">
            <div className="p-10">
              <Search size={20} onClick={() => setOpenSearchDrawer(true)} />
            </div>
            {isClient ? (
              <>
                {!isTokenAdded ? (
                  <AuthDrawer
                    open={isDrawerOpen}
                    type={modalType}
                    setEmail={setEmail}
                    setModalType={setModalType}
                    email={email}
                    onClose={onClose}
                    showDrawer={showDrawer}
                  />
                ) : (
                  <>
                    <WalletConnectButton />
                    <ProfileDropdown
                      onLogout={handleLogout}
                      open={open}
                      setOpen={setOpen}
                      notificationOpen={isOpen}
                      setNotificationOpen={setIsOpen}
                      userId={userData?._id}
                    />
                  </>
                )}
              </>
            ) : null}
          </div>
          <Drawer
            size="large"
            open={openSearchDrawer}
            closable={false}
            className="mobile-search-drawer-container"
            placement="left"
          >
            <section className="border-bottom-primary-1 d-flex align-center justify-space-between">
              <div>
                <RenderLogo />
              </div>
              <div className="p-6" onClick={() => setOpenSearchDrawer(false)}>
                <Close size={24} />
              </div>
            </section>
            <div className="p-16 position-relative">
              <SearchBox className="w-400" placeHolder="Search assets" autoFocus={false} />
            </div>
          </Drawer>
        </div>
      )}
      <KycModals />
    </>
  );
};
