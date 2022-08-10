import React, {
  useCallback, useState, useMemo, useLayoutEffect,
} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {RootStateOrAny, useSelector} from 'react-redux';
import {HiMenuAlt1, HiOutlineX} from 'react-icons/hi';

import cs from '@utils/cs';
import Button from '@components/Button';

import useSize from '@ra/hooks/useSize';

import NavLogo from '@images/lukim-nav-logo.png';

import classes from './styles';

interface Props {
  hideButton?: boolean;
}

const NavItem = ({to, title}: {to: string, title: string}) => (
  <div className={classes.linkWrapper}>
    <NavLink
      to={to}
      className={({isActive}) => `${classes.link} ${isActive ? 'border-[#EC6D25]' : 'border-color-bg'}`}
    >
      {title}
    </NavLink>
  </div>
);

const Navbar: React.FC<Props> = ({hideButton = false}) => {
  const {width} = useSize();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootStateOrAny) => state.auth.isAuthenticated);
  const onDashboardClick = () => navigate('/dashboard');
  const onLoginClick = () => navigate('/login');
  const handleLogoClick = useCallback(() => {
    setOpen(false);
    navigate('/');
  }, [navigate]);
  const toggleMenu = useCallback(() => setOpen(!open), [open]);
  const screenWidth = useMemo(() => (width || 0), [width]);
  // eslint-disable-next-line consistent-return
  const bb = 'fixed w-full pt-[10vh] px-[5vw] pb-[20px] left-0 top-[100px] shadow z-10 transition-transform bg-[#fff]';
  const isMobile = useMemo(() => {
    if (screenWidth < 640) {
      if (open) {
        return `${bb} translate-x-0`;
      }
      return `${bb} translate-x-full`;
    }
    return 'translate-x-0';
  }, [open, screenWidth]);
  useLayoutEffect(() => setOpen(false), []);
  return (
    <nav className={classes.navbar}>
      <div
        className={cs(classes.toggle, 'HAMBURGER-ICON space-y-2 sm:hidden')}
        onClick={toggleMenu}
      >
        {open ? (
          <HiOutlineX size={35} color='#196297' />
        ) : (
          <HiMenuAlt1 size={35} color='#196297' />
        )}
      </div>
      <div className={classes.logoWrapper} onClick={handleLogoClick}>
        <img src={NavLogo} alt='lukim-logo' className={classes.logo} />
      </div>
      <div
        className={cs(
          classes.menuList,
          hideButton ? 'hidden' : 'sm:flex',
          isMobile,
        )}
      >
        <NavItem
          to='/resource'
          title='Resources'
        />
        <NavItem
          to='/faq'
          title='FAQs'
        />
        <div className={cs(classes.buttonWrapper, ['pt-[2vh]', open])}>
          {isAuthenticated ? (
            <Button text='Dashboard' onClick={onDashboardClick} />
          ) : (
            <Button className='sm:w-[90px]' text='Log in' onClick={onLoginClick} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
