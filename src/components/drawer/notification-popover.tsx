import { Badge, Empty, Popover, Drawer } from 'antd';
import Cookies from 'js-cookie';
import { Bell, CheckCheck, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ERROR_MESSAGE } from '@/helpers/constants/error-message';
import { SUCCESS_MESSAGES } from '@/helpers/constants/success.message';
import { useCookieListener } from '@/hooks/useCookieListener';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useToast } from '@helpers/notifications/toast.notification';
import { getErrorMessage } from '@helpers/services/get-error-message';
import { timeAgo } from '@helpers/services/time-ago';
import {
  useGetAllNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadSingleNotificationMutation,
} from '@redux/apis/notifications.api';

import '../ProfileDropdown/styles.scss';
import { NotificationDrawerProps } from './interface';

import './styles.scss';

const NotificationPopOver = ({ open, setOpen, userId }: NotificationDrawerProps) => {
  const router = useRouter();
  const accessTokenAdded = useCookieListener();
  const { data: notifications, refetch } = useGetAllNotificationsQuery(undefined, {
    pollingInterval: 60000,
    skip: !accessTokenAdded,
  });
  const [readAllNotifications] = useReadAllNotificationsMutation();
  const [readSingleNotification] = useReadSingleNotificationMutation();

  const showMarkAll = notifications?.response.some((item) => !item.isRead);

  const { showSuccessToast, showErrorToast } = useToast();

  const isMobileView = useMediaQuery('mobile');

  const handleClick = async (type: 'single' | 'all', id?: string) => {
    try {
      if (type === 'single') {
        await readSingleNotification(id as string);
      } else {
        await readAllNotifications();
      }
      refetch();
      showSuccessToast(SUCCESS_MESSAGES.NOTIFICATION_VIEWED);
    } catch (error) {
      refetch();
      showErrorToast(error, getErrorMessage(error) ?? ERROR_MESSAGE.VIEW_NOTIFICATION);
    }
  };
  const toggleOpen = () => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/?login-required=true');
    } else {
      setOpen((prev) => !prev);
    }
  };
  const count = notifications?.response.filter((item) => !item.isRead);

  const Content = (
    <div className="border-primary-1 radius-6 bg-white d-flex w-450 max-h-500 flex-column notification-content-container">
      <div
        className={`p-y-20 d-flex align-center gap-5 justify-space-between bg-white border-primary-1 ${isMobileView ? 'p-x-16' : 'p-x-24'} header`}
      >
        <p className="f-16-20-500-primary">
          <ChevronLeft size={20} className={`m-r-10 ${isMobileView ? 'd-block' : 'd-none'}`} />
          Notifications
        </p>
        {notifications?.response && notifications?.response.length > 0 && showMarkAll && (
          <div
            className="d-flex align-center gap-2 cursor-pointer"
            onClick={() => {
              handleClick('all', userId);
            }}
          >
            <CheckCheck size={16} className="f-14-16-400-secondary" />
            <p className="f-14-16-400-secondary">Mark all as read</p>
          </div>
        )}
      </div>
      <div className="overflow-y-scroll d-flex flex-column">
        {notifications?.response && notifications?.response?.length > 0 ? (
          notifications?.response.map((item) => (
            <div
              key={item._id}
              className={`p-r-32 p-l-16 p-y-20 d-flex gap-2 border-primary-1 ${item.isRead ? 'bg-white' : 'bg-brand'} cursor-pointer`}
              onClick={() => {
                handleClick('single', item._id);
              }}
            >
              {!item.isRead && <div className="min-w-10 min-h-10 w-10 h-10 radius-100 bg-brand-secondary m-t-6" />}
              <div className="d-flex flex-column gap-6">
                <p className="f-14-20-400-primary notification-message">
                  <span>
                    {item.message.split('"').map((msg, index) =>
                      (index + 1) % 2 === 0 ? (
                        <strong className="m-x-6" key={index}>
                          [{msg}]
                        </strong>
                      ) : (
                        <React.Fragment key={index}>{msg}</React.Fragment>
                      ),
                    )}
                  </span>
                </p>
                <p className="f-12-16-400-tertiary">{timeAgo(item.createdAt)}</p>
              </div>
            </div>
          ))
        ) : (
          <div
            className="p-10 d-flex align-center justify-center"
            style={{ height: isMobileView ? 'calc(100vh - 62px)' : '' }}
          >
            <Empty imageStyle={{ width: '70px', height: '70px' }} />
          </div>
        )}
      </div>
    </div>
  );

  const ContentComponent = () => Content;

  return (
    <Popover
      content={Content}
      open={!isMobileView && open}
      onOpenChange={toggleOpen}
      trigger="click"
      style={{ zIndex: '10', width: '450px', maxHeight: '500px' }}
      placement="bottomRight"
      arrow={false}
    >
      <div className={`p-10 ${open ? 'bg-brand' : 'bg-white'} radius-100`}>
        <Bell className={`${open ? 'icon-20-brand-secondary' : 'icon-20-primary'} cursor-pointer`} size={20} />
        <Badge
          count={count?.length ?? 0}
          style={{
            backgroundColor: '#ED1515',
            width: 20,
            height: 20,
            lineHeight: '20px',
            fontSize: '12px',
            color: '#fff',
            position: 'absolute',
            top: '-30px',
            right: '-7px',
            padding: '0',
          }}
        />
      </div>
      <Drawer
        open={isMobileView && open}
        closable={false}
        size="large"
        className="notification-drawer-container"
        placement="left"
      >
        <ContentComponent />
      </Drawer>
    </Popover>
  );
};

export default NotificationPopOver;
