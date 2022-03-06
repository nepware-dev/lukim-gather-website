import React from 'react';
import NavLogo from '@images/lukim-nav-logo.png';

const Navbar = () => (
  <nav className='w-full'>
    <img src={NavLogo} alt='lukim-logo' className='h-[50px] my-[22px]' />
  </nav>
);

export default Navbar;
