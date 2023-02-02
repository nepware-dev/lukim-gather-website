import React from 'react';

import cs from '@ra/cs';

import classes from './styles';

const Loader = ({className}: {className?: string}) => (
  <div className={classes.container}>
    <svg className={cs(classes.svg, className)} viewBox='0 0 24 24' />
  </div>
);

export default Loader;
