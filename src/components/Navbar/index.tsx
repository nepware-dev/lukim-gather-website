import React from 'react';
import Button from '@components/Button';

import NavLogo from '@images/lukim-nav-logo.png';

const Navbar = () => (
  <nav className='w-full py-[22px] flex justify-between'>
    <img src={NavLogo} alt='lukim-logo' className='h-[66px]' />
    <Button text='Log in' />
  </nav>
);

export default Navbar;
