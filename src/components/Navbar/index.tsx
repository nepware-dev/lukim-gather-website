import React from 'react';
import {useNavigate} from 'react-router-dom';
import {RootStateOrAny, useSelector} from 'react-redux';

import cs from '@utils/cs';
import Button from '@components/Button';

import NavLogo from '@images/lukim-nav-logo.png';

interface Props {
  hideButton?: boolean;
}
const Navbar: React.FC<Props> = ({hideButton = false}) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootStateOrAny) => state.auth.isAuthenticated);
  const onDashboardClick = () => navigate('/dashboard');
  const onLoginClick = () => navigate('/login');
  return (
    <nav className='w-full py-[22px] flex justify-between'>
      <img src={NavLogo} alt='lukim-logo' className='h-[66px]' />
      <div className={cs(['hidden', hideButton])}>
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
