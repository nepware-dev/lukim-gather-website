import React from 'react';
import NavLogo from '@images/lukim-nav-logo.png';

const Navbar = () => (
  <nav className='w-full py-[22px]'>
    <img src={NavLogo} alt='lukim-logo' className='h-[50px]' />
  </nav>
);

export default Navbar;
