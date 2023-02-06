import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AiOutlineSetting} from 'react-icons/ai';
import {FiLogOut} from 'react-icons/fi';
import {IoNotificationsOutline} from 'react-icons/io5';
import {gql, useQuery} from '@apollo/client';

import {rootState} from '@store/rootReducer';
import {dispatchLogout} from '@services/dispatch';

import Dropdown from '@components/Dropdown';
import useInterval from '@ra/hooks/useInterval';
import Notification from './Notification';

import classes from './styles';

const GET_NOTIFICATIONS_UNREAD_COUNT = gql`
  query {
    notificationUnreadCount
  }
`;

const UserDropdown = ({alignRight}: {alignRight?: boolean}) => {
  const navigate = useNavigate();
  const {data: notificationUnreadCount, refetch} = useQuery(GET_NOTIFICATIONS_UNREAD_COUNT);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetch();
  }, [refetch, openNotification]);

  useInterval(() => {
    refetch();
  }, 20000);

  const {
    auth: {
      user: {firstName},
    },
  } = useSelector((state: rootState) => state);

  const handleAccountSettings = useCallback(() => {
    navigate('/account-settings');
  }, [navigate]);
  const handleLogout = useCallback(() => {
    dispatchLogout();
  }, []);

  const renderLabel = useCallback(
    () => (
      <div className={classes.labelWrapper}>
        <div className={classes.letterWrapper}>
          <p className={classes.letter}>{firstName[0]}</p>
        </div>
        <p className={classes.name}>
          {firstName}
        </p>
      </div>
    ),
    [firstName],
  );

  const hideNotification = useCallback((event) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event?.target)) {
      setOpenNotification(false);
      document.removeEventListener('click', hideNotification);
    }
  }, []);

  const showNotification = useCallback(() => {
    setOpenNotification(true);
    setTimeout(() => {
      document.addEventListener('click', hideNotification);
    }, 50);
  }, [hideNotification]);

  const handleNotificationClick = useCallback(
    () => (
      openNotification ? hideNotification : showNotification()),
    [openNotification, showNotification, hideNotification],
  );

  const NotificationIcon = useCallback(
    () => (
      <div className='w-6/12 cursor-pointer' onClick={handleNotificationClick}>
        {notificationUnreadCount?.notificationUnreadCount > 0 && (
          <span className={classes.notificationCount}>
            {notificationUnreadCount?.notificationUnreadCount}
          </span>
        )}
        <IoNotificationsOutline
          className='mr-[2em]'
          size={24}
        />
      </div>
    )
    , [handleNotificationClick, notificationUnreadCount?.notificationUnreadCount],
  );

  return (
    <div className='flex items-center'>
      <div className='relative'>
        <div className='flex flex-col select-none'>
          <NotificationIcon />
        </div>
        <Notification
          openNotification={openNotification}
          ref={notificationsRef}
        />
      </div>
      <Dropdown renderLabel={renderLabel} alignRight={alignRight}>
        <div className={classes.container}>
          <div
            className={classes.itemWrapper}
            onClick={handleAccountSettings}
          >
            <AiOutlineSetting size={22} color='#888C94' />
            <p className={classes.itemText}>
              Account Settings
            </p>
          </div>
          <div className={classes.separator} />
          <div
            className={classes.itemWrapper}
            onClick={handleLogout}
          >
            <FiLogOut size={20} color='#888C94' />
            <p className={classes.itemText}>
              Logout
            </p>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
