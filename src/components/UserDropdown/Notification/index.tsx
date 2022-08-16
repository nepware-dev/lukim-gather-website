import React, {useCallback, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {AiOutlineNotification} from 'react-icons/ai';
import {BsCheck} from 'react-icons/bs';
import {MdClose} from 'react-icons/md';
import {formatDistance} from 'date-fns';
import {gql, useMutation, useQuery} from '@apollo/client';
import parse from 'html-react-parser';

import useInterval from '@ra/hooks/useInterval';
import List from '@ra/components/List';

import NoNotification from './NoNotification';

import styles from './styles';

export type NotificationType = {
  notifications: {
    id: number| string;
    actionObjectObjectId: number;
    createdAt: string;
    description: string;
    notificationType: string;
  } | undefined
}

const GET_NOTIFICATIONS = gql`
  query {
    notifications {
      actionObjectObjectId
      id
      createdAt
      description
      notificationType
    }
  }
`;

const MARK_AS_READ = gql`
    mutation MarkAsRead($id: Int) {
        markAsRead(pk: $id) {
            detail
        }
    }
`;

type PropsType = {
  openNotification: boolean,
}

export type RefType = HTMLDivElement;

export type IconType = {
  happening_survey_approved: JSX.Element;
  happening_survey_rejected: JSX.Element;
  default: JSX.Element;
}

const icons: IconType = {
  happening_survey_approved: <BsCheck className={styles.icon} />,
  happening_survey_rejected: <MdClose className={styles.icon} />,
  default: <AiOutlineNotification className={styles.icon} />,
};

const NotificationCard = React.forwardRef<RefType, PropsType>(({openNotification}, ref) => {
  const keyExtractor = useCallback((item, index) => index, []);
  const {data, refetch} = useQuery<NotificationType>(GET_NOTIFICATIONS);
  const [markAsRead] = useMutation(MARK_AS_READ);

  useInterval(() => {
    refetch();
  }, 20000);

  const navigate = useNavigate();

  const handleNotificationPress = useCallback((item) => {
    markAsRead({variables: {id: Number(item.id)}});
    if (item?.notificationType.startsWith('happening_survey')) navigate(`/surveys/${item.actionObjectObjectId}`, {replace: true});
  }, [markAsRead, navigate]);

  const renderNotification = useCallback(({item}) => {
    const icon = icons[item?.notificationType as keyof IconType] || icons.default;
    return (
      <div className={styles.notificationWrapper} onClick={() => handleNotificationPress(item)}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
        <div className={styles.notification} key={item.id}>
          <p className={styles.description}>{parse(item.description)}</p>
          <span className={styles.date}>
            {formatDistance(new Date(item.createdAt), new Date(), {addSuffix: true})}
          </span>
        </div>
      </div>
    );
  }, [handleNotificationPress]);

  const EmptyComponent = useMemo(() => <NoNotification placeholder='No Notifications' />, []);

  const Notification = React.memo(({notifications}: NotificationType) => {
    const Props = {
      data: notifications,
      renderItem: renderNotification,
      keyExtractor,
      className: styles.itemWrapper,
      EmptyComponent,
    };
    return (
      <List
        {...Props}
        ref={ref}
      />
    );
  });

  return (
    <div className={styles.container}>
      {openNotification && (
        <div ref={ref}>
          <Notification notifications={data?.notifications} />
        </div>
      )}
    </div>
  );
});

export default NotificationCard;
