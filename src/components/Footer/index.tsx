import React from 'react';
import AppButton from '@components/AppButton';

import FooterLogo from '@images/lukim-nav-logo.png';

const classes = {
  container: 'flex flex-col md:flex-row gap-[40px] md:gap-[0] items-center justify-between pb-[28px] mt-[80px] border-b-[1px] border-color-border',
  logo: 'h-[66px]',
  buttons: 'flex flex-row gap-[12px]',
  text: 'mt-[28px] mb-[50px] font-inter text-color-lt-grey text-center',
};

const Footer = () => (
  <footer>
    <div className={classes.container}>
      <img src={FooterLogo} alt='lukim-logo' className={classes.logo} />
      <div className={classes.buttons}>
        <AppButton bgGrey />
        <AppButton android bgGrey />
      </div>
    </div>
    <p className={classes.text}>
      © Lukim Gather 2022. All rights reserved.
    </p>
  </footer>
);

export default Footer;
