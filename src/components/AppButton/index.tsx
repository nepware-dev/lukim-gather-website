import React from 'react';

import cs from '@utils/cs';

import appleIcon from '@images/apple.svg';
import androidIcon from '@images/android.svg';

import classes from './styles';

interface Props {
  android?: boolean;
  bgGrey?: boolean;
  boxShadow?: boolean;
  available?: boolean;
  beta?: boolean;
}

const AppButton: React.FC<Props> = ({
  android = false,
  bgGrey = false,
  boxShadow = false,
  available = false,
  beta = false,
}) => (
  <button
    type='button'
    className={cs(
      classes.container,
      [classes.boxShadow, boxShadow],
      ['bg-color-bg', bgGrey],
      ['bg-color-white', !bgGrey],
    )}
  >
    <img
      src={android ? androidIcon : appleIcon}
      alt='apple-icon'
      className={classes.image}
    />
    <div className={classes.textWrapper}>
      <p className={classes.text}>{available ? 'Available on' : 'Soon on'}</p>
      <p className={classes.storeText}>
        {android ? 'Play Store' : 'App Store'}
      </p>
    </div>
    <p className={cs(['hidden', !beta], classes.beta)}>Beta</p>
  </button>
);

export default AppButton;
