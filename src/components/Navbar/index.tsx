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
import NavLogoDark from '@images/lukim-logo-dark.svg';

import classes from './styles';

interface Props {
  hideButton?: boolean;
  isDark?: boolean;
}

const NavItem = ({to, title, isDarkNav} : {to: string, title: string, isDarkNav: boolean}) => (
  <div className={classes.linkWrapper}>
    <NavLink
      to={to}
      className={({isActive}) => `${cs(classes.link, isDarkNav ? classes.darkLink : classes.lightLink)} ${isActive ? 'border-[#EC6D25]' : 'border-transparent'}`}
    >
      {title}
    </NavLink>
  </div>
);

const Navbar: React.FC<Props> = ({hideButton = false, isDark = false}) => {
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
  const mobileMenuStyle = 'fixed w-full pt-[10vh] px-[5vw] pb-[20px] left-0 top-[100px] shadow z-10 transition-transform bg-color-white';
  const isMobile = useMemo(() => {
    if (screenWidth < 640) {
      if (open) {
        return `${mobileMenuStyle} translate-x-0`;
      }
      return `${mobileMenuStyle} translate-x-full`;
    }
    return 'translate-x-0';
  }, [open, screenWidth]);
  useLayoutEffect(() => setOpen(false), []);
  return (
    <div className={cs(isDark ? 'bg-[#05375A]' : '')}>
      <nav className={cs(classes.navbar, isDark ? classes.darkBar : classes.lightBar)}>
        <div
          className={cs(classes.toggle, 'HAMBURGER-ICON space-y-2 sm:hidden')}
          onClick={toggleMenu}
        >
          {open ? (
            <HiOutlineX size={35} color={isDark ? '#fff' : '#196297'} />
          ) : (
            <HiMenuAlt1 size={35} color={isDark ? '#fff' : '#196297'} />
          )}
        </div>
        <div className={classes.logoWrapper} onClick={handleLogoClick}>
          <img src={isDark ? NavLogoDark : NavLogo} alt='lukim-logo' className={classes.logo} />
        </div>
        <div
          className={cs(
            classes.menuList,
            hideButton ? 'hidden' : 'sm:flex',
            isDark ? classes.darkMenuList : classes.lightMenuList,
            isMobile,
          )}
        >
          <NavItem
            to='/resource'
            title='Resources'
            isDarkNav={isDark}
          />
          <NavItem
            to='/faq'
            title='FAQs'
            isDarkNav={isDark}
          />
          <NavItem
            to='/tutorial'
            title='Tutorials'
            isDarkNav={isDark}
          />
          <NavItem
            to='/contact-us'
            title='Contact Us'
            isDarkNav={isDark}
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
    </div>
  );
};

export default Navbar;
