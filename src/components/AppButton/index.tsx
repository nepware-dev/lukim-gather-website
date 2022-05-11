import React from 'react';

import cs from '@utils/cs';

import appleIcon from '@images/apple.svg';
import androidIcon from '@images/android.svg';

import classes from './styles';

interface Props {
  android?: boolean;
  bgGrey?: boolean;
  boxShadow?: boolean;
}

const AppButton: React.FC<Props> = ({
  android = false,
  bgGrey = false,
  boxShadow = false,
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
      <p className={classes.text}>Soon on</p>
      <p className={classes.storeText}>
        {android ? 'Play Store' : 'App Store'}
      </p>
    </div>
  </button>
);

export default AppButton;
