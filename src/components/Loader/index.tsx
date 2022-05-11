import React from 'react';
import classes from './styles';

const Loader = () => (
  <div className={classes.container}>
    <svg className={classes.svg} viewBox='0 0 24 24' />
  </div>
);

export default Loader;
