import React from 'react';
import FooterLogo from '@images/lukim-nav-logo.png';

import AppButton from '@components/AppButton';

const Footer = () => (
  <footer>
    <div className='flex flex-row justify-between pb-[28px] border-b-[1px] border-color-border'>
      <img src={FooterLogo} alt='lukim-logo' className='h-[50px]' />
      <div className='flex flex-row gap-[12px]'>
        <AppButton />
        <AppButton android />
      </div>
    </div>
    <p className='mt-[28px] mb-[50px] font-inter font-[400] text-color-lt-grey text-center'>
      © Lukim Gather 2022. All rights reserved.
    </p>
  </footer>
);

export default Footer;
