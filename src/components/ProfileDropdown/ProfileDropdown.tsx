'use client';

import { Avatar, Divider, Popover, Drawer } from 'antd';
import { X as Close, CircleAlert, LogOut } from 'lucide-react';
import { IconName } from 'lucide-react/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { KYC_STATUS } from '@/helpers/constants/user-status';
import { isKycVerified } from '@/helpers/services/kyc-verification';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useUserListener } from '@/hooks/useUserListener';
import { useLazyGetStripeLoginLinkQuery } from '@/redux/apis/payment.api';
import DynamicIcon from '@components/dynamic-lucide-icons/dynamic-lucide-icons';
import { PROFILE_CONTEXT } from '@components/ProfileDropdown/constants';
import './styles.scss';
import { mobileSections } from '@helpers/constants/profile-drawer';

import NotificationPopOver from '../drawer/notification-popover';

export const ProfileDropdown = ({
  onLogout,
  open,
  setOpen,
  setNotificationOpen,
  notificationOpen,
  userId,
}: {
  onLogout: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  notificationOpen?: boolean;
  setNotificationOpen?: React.Dispatch<SetStateAction<boolean>>;
  userId?: string;
}) => {
  const router = useRouter();
  const isMobileView = useMediaQuery('mobile');
  const user = useUserListener();
  const [kycStatus, setKycStatus] = useState<string | undefined>('');
  const [getStripeLoginLink] = useLazyGetStripeLoginLinkQuery();

  // REMOVED: Managed by useUserListener
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  const handleLogout = () => {
    onLogout();
    setOpen(false);
    router.replace('/');
  };

  const handleClick = (child: { label: string; href: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    if (child.label !== 'Notifications') {
      router.push(`${child.href}`);
    } else {
      setNotificationOpen?.(true);
    }
  };

  const handleRoute = async (child: { LUCIDE_ICON: string; NAME: string; PATH: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    if (child.PATH === '/sell') {
      if (!isKycVerified(user)) return;
      else {
        router.push(child.PATH);
      }
    } else if (child.PATH === '/login-to-stripe') {
      const stripeResponse = await getStripeLoginLink(user?.stripeAccountId).unwrap();

      window.location.href = stripeResponse.response.url;
    } else {
      router.push(child.PATH);
    }
  };

  useEffect(() => {
    setKycStatus(user?.kycVerificationStatus || KYC_STATUS.PENDING);
  }, [user]);

  const content = (
    <div className="border-primary-1 radius-4 bg-white m-t-10 w-200 profile-content-container">
      <div className="p-y-8">
        {PROFILE_CONTEXT.filter((values) => {
          if (!values.TITLE.includes('STRIPE') || (values.TITLE === 'STRIPE' && user?.stripeAccountId)) {
            return true;
          }

          return false;
        }).map((values) => (
          <div key={values.TITLE}>
            <h4 className="f-12-16-400-tertiary p-x-18 p-y-10">{values.TITLE}</h4>
            {values.CHILDREN.map((child) => (
              <div
                className="btn btn-primary-text menu width-100 radius-0 d-flex align-center justify-flex-start p-x-18 p-y-10 cursor-pointer"
                key={child.NAME}
                onClick={(e) => handleRoute(child, e)}
              >
                <DynamicIcon name={child.LUCIDE_ICON as IconName} className="icon-2-primary m-r-8 w-20 h-20" />
                <p className="f-14-16-400-primary align-center">
                  {child.NAME}{' '}
                  {child.NAME === 'Profile' && kycStatus !== KYC_STATUS.VERIFIED ? (
                    <span className="f-10-12-500-warning-secondary bg-warning text-uppercase p-x-8 p-y-4 m-l-2">
                      {`KYC ${kycStatus === KYC_STATUS.RESUBMIT ? 'RESUBMIT' : kycStatus?.toUpperCase()}`}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        ))}
        <Divider className="custom-divider" />
        <button
          className="btn btn-primary-text menu width-100 radius-0 d-flex align-center justify-flex-start p-x-18 p-y-10 cursor-pointer"
          onClick={handleLogout}
        >
          <DynamicIcon name={'log-out' as IconName} className="icon-2-primary m-r-8 w-20 h-20" />
          <p className="f-14-16-400-primary">Sign out</p>
        </button>
      </div>
    </div>
  );

  const mobileContent = (
    <div className="d-flex flex-column p-x-16">
      {mobileSections.map((section, idx) => (
        <section key={idx}>
          <p className="f-12-14-400-tertiary p-y-8">{section.name}</p>
          {section.children.map((child) => (
            <div
              key={child.label}
              className="d-flex align-center gap-2 p-y-8 cursor-pointer"
              onClick={(e) => handleClick(child, e)}
            >
              <div className="icon-20-primary h-20 w-20">{child.icon}</div>
              <p className="f-14-16-400-primary">{child.label}</p>
            </div>
          ))}
        </section>
      ))}
      <Divider className="custom-divider-one" />
      <button
        className="bg-white border-primary-0 d-flex align-center gap-2 p-y-20 p-x-0 cursor-pointer"
        onClick={handleLogout}
      >
        <LogOut size={20} /> Log Out
      </button>
    </div>
  );

  return (
    <>
      <Popover
        content={content}
        open={!isMobileView && open}
        onOpenChange={setOpen}
        className="cursor-pointer profile-popover"
        trigger="click"
        style={{ zIndex: '1100' }}
        placement="bottomLeft"
        arrow={false}
      >
        <Avatar size="large" className="custom-ant-avatar cursor-pointer d-flex align-center justify-center">
          <Image
            src={user?.profilePic ? user?.profilePic : '/profile.svg'}
            alt="Profile Picture"
            width={70}
            height={70}
            style={{ borderRadius: '100%', objectFit: 'cover' }}
          />
        </Avatar>
      </Popover>

      <Drawer
        open={isMobileView && open}
        size={'large'}
        closable={false}
        className="mobile-view-profile-drawer"
        placement="left"
      >
        <section className="d-flex align-center justify-space-between border-bottom-primary-1 p-16">
          <div>
            <Image src="/rareagora-logo.svg" alt="rareagora logo" width={200} height={36} />
          </div>
          <div className="p-6" onClick={() => setOpen(false)}>
            <Close size={20} />
          </div>
        </section>
        <section className="p-x-16 p-y-12">
          <div className="bg-secondary p-8 radius-6 d-flex align-center">
            <div className="position-relative">
              <Avatar className="custom-ant-avatar cursor-pointer kyc-pending-highlight">
                <Image
                  src={user?.profilePic ? user?.profilePic : '/Profile.svg'}
                  alt="Profile Picture"
                  width={200}
                  height={200}
                  style={{ borderRadius: '100%' }}
                />
              </Avatar>
              <CircleAlert size={20} className="position-absolute kyc-pending-alert-icon" />
            </div>
            <div className="m-l-12">
              <p className="f-14-20-600-primary m-b-4">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="f-12-14-400-tertiary">{user?.email}</p>
            </div>
          </div>
        </section>
        <section className="profile-drawer-content">{mobileContent}</section>

        {notificationOpen && setNotificationOpen && userId && (
          <NotificationPopOver open={notificationOpen} setOpen={setNotificationOpen} userId={userId} />
        )}
      </Drawer>
    </>
  );
};
