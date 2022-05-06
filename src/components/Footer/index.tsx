import React from 'react';
import AppButton from '@components/AppButton';

import FooterLogo from '@images/lukim-nav-logo.png';
import CepaLogo from '@images/cepa.webp';
import GefLogo from '@images/gef.webp';
import UndpLogo from '@images/undp.webp';

const classes = {
  container: 'flex flex-col md:flex-row gap-[40px] md:gap-[0] items-center justify-between pb-[28px] mt-[80px] border-b-[1px] border-color-border',
  logo: 'h-[66px]',
  buttons: 'flex flex-row gap-[12px]',
  partnersWrapper: 'flex flex-col items-center my-[64px] gap-[72px]',
  partnerTitle: 'uppercase font-sans text-[#0A52A1] text-[24px]',
  partnersImgWrapper: 'flex flex-col sm:flex-row gap-[34px] sm:gap-[64px] items-center',
  undpImage: 'max-h-[68px]',
  separator: 'hidden sm:flex h-[98px] w-[2.31px] bg-[#CEDCEC] mx-[5px]',
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
    <div className={classes.partnersWrapper}>
      <h2 className={classes.partnerTitle}>Partners</h2>
      <div className={classes.partnersImgWrapper}>
        <img src={UndpLogo} alt='undp' className={classes.undpImage} />
        <div className={classes.separator} />
        <img src={CepaLogo} alt='cepa' />
        <img src={GefLogo} alt='gef' />
      </div>
    </div>
    <p className={classes.text}>
      © Lukim Gather 2022. All rights reserved.
    </p>
  </footer>
);

export default Footer;
