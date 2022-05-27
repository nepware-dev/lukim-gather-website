import React from 'react';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

import useGaTracker from '@hooks/useGaTracker';

import classes from './styles';

const Container = ({children}: {children: JSX.Element}) => {
  useGaTracker();
  return (
    <main>
      <div className={classes.mainContainer}>
        <div className={classes.container}>
          <Navbar />
          <div className={classes.contentWrapper}>
            {children}
          </div>
          <Footer hideContent />
        </div>
      </div>
    </main>
  );
};

export default Container;
