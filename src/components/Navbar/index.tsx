import React from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';

import Button from '@components/Button';

import NavLogo from '@images/lukim-nav-logo.png';
import {useNavigate} from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootStateOrAny) => state.auth.isAuthenticated);
  const onDashboardClick = () => navigate('/dashboard');
  const onLoginClick = () => navigate('/login');
  return (
    <nav className='w-full py-[22px] flex justify-between'>
      <img src={NavLogo} alt='lukim-logo' className='h-[66px]' />
      <div>
        {isAuthenticated ? (
          <Button text='Dashboard' onClick={onDashboardClick} />
        ) : (
          <Button text='Log in' onClick={onLoginClick} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
