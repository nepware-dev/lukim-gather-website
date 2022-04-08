/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import Button from '@components/Button';

import NavLogo from '@images/lukim-nav-logo.png';

const noop = () => {};

const Navbar = () => (
  <nav className='w-full py-[22px] flex justify-between'>
    <img src={NavLogo} alt='lukim-logo' className='h-[66px]' />
    <Button text='Log in' onClick={noop} />
  </nav>
);

export default Navbar;
