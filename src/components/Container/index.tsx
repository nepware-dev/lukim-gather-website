import React from 'react';

import useGaTracker from '@hooks/useGaTracker';

import classes from './styles';

const Container = ({children}: {children: JSX.Element}) => {
  useGaTracker();
  return (
    <main>
      <div className={classes.mainContainer}>
        <div className={classes.container}>
          <div className={classes.contentWrapper}>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Container;
