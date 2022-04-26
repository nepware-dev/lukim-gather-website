import React, {ReactNode, useCallback, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {BsFillGridFill} from 'react-icons/bs';
import {FiFileText} from 'react-icons/fi';
import {HiMenuAlt1, HiOutlineX} from 'react-icons/hi';

import cs from '@utils/cs';
import UserDropdown from '@components/UserDropdown';

import logo from '@images/lukim-nav-logo.png';

const classes = {
  mainContainer: 'overflow-x-hidden',
  container: 'flex md:-translate-x-0 ease-in-out duration-300',
  showSideBar: '-translate-x-0',
  hideSideBar: '-translate-x-[235px]',
  sideBar: 'min-w-[236px] min-h-[100vh] px-[20px] bg-[#F2F5F9] border-r border-[#CCDCE8]',
  logoWrapper: 'hidden md:inline-block pt-[24px]',
  logo: 'h-[60px]',
  linksWrapper: 'flex flex-col mt-[85px]',
  link: 'flex items-center py-[10px] px-[8px] mb-[15px] rounded-lg gap-[15px]',
  activeLink: 'bg-color-white text-[#00518B]',
  inactiveLink: 'text-[#404653]',
  linkText: 'font-inter font-[600] text-[16px]',
  count: 'w-[24px] h-[19px] flex items-center justify-center ml-auto text-[12px] font-[400] font-inter bg-[#E6EEF3] rounded-full',
  mobileHeader: 'md:hidden w-full p-4 flex items-center justify-between border-b border-[#CEDCEC]',
  userDropdown: 'md:hidden mt-[20px]',
  child: 'w-screen',
  hidden: 'hidden',
  cursor: 'cursor-pointer',
};

const DashboardLayout = ({children}: {children: ReactNode}) => {
  const {pathname} = useLocation();
  const [showSideBar, setShowSideBar] = useState<boolean>(false);

  const handleIconToggle = useCallback(() => {
    setShowSideBar(!showSideBar);
  }, [showSideBar]);

  const MobileHeader = useCallback(
    () => (
      <div className={classes.mobileHeader}>
        <img src={logo} alt='lukim-logo' className={classes.logo} />
        <div className={classes.cursor}>
          {showSideBar ? (
            <HiOutlineX size={25} onClick={handleIconToggle} />
          ) : (
            <HiMenuAlt1 size={25} onClick={handleIconToggle} />
          )}
        </div>
      </div>
    ),
    [handleIconToggle, showSideBar],
  );

  return (
    <div className={classes.mainContainer}>
      <MobileHeader />
      <div
        className={cs(
          classes.container,
          [classes.showSideBar, showSideBar],
          [classes.hideSideBar, !showSideBar],
        )}
      >
        <div className={classes.sideBar}>
          <Link to='/' className={classes.logoWrapper}>
            <div>
              <img src={logo} alt='lukim-logo' className={classes.logo} />
            </div>
          </Link>
          <div className={classes.linksWrapper}>
            <Link
              to='/dashboard'
              className={cs(
                classes.link,
                [classes.activeLink, pathname === '/dashboard'],
                [classes.inactiveLink, pathname !== '/dashboard'],
              )}
            >
              <BsFillGridFill size={20} />
              <p className={classes.linkText}>Dashboard</p>
            </Link>
            <Link
              to='/surveys'
              className={cs(
                classes.link,
                [classes.activeLink, pathname === '/surveys'],
                [classes.inactiveLink, pathname !== '/surveys'],
              )}
            >
              <FiFileText size={20} />
              <p className={classes.linkText}>Surveys</p>
              <span
                className={cs(classes.count, [
                  classes.hidden,
                  pathname !== '/surveys',
                ])}
              >
                -
              </span>
            </Link>
            <div className={classes.userDropdown}>
              <UserDropdown />
            </div>
          </div>
        </div>
        <div className={classes.child}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
