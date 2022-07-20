import React, {memo} from 'react';

import styles from './styles';

type PropsType = {
  placeholder: string;
}

const NoNotificationComponent = ({placeholder}: PropsType) => (
  <div className={styles.container}>
    <div className={styles.text}>
      {placeholder}
    </div>
  </div>
);

const NoNotification = memo(NoNotificationComponent);

export default NoNotification;
