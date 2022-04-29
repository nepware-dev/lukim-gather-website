import React from 'react';

import cs from '@utils/cs';

import appleIcon from '@images/apple.svg';
import androidIcon from '@images/android.svg';

interface Props {
  android?: boolean;
  bgGrey?: boolean;
  boxShadow?: boolean;
}

const classes = {
  container: 'w-[160px] h-[58px] sm:w-[193px] rounded-xl flex items-center justify-center',
  boxShadow: 'shadow-[0_5px_10px_rgba(0,0,0,0.05)]',
  image: 'w-[32px]',
  textWrapper: 'flex flex-col items-start ml-[16px]',
  text: 'font-inter text-color-lt-grey',
  storeText: 'font-interMedium text-color-black',
};

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
