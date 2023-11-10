import React, {useCallback, useState} from 'react';
import {Link, Outlet, useLocation} from 'react-router-dom';
import {BsFillGridFill} from 'react-icons/bs';
import {FiFileText} from 'react-icons/fi';
import {HiMenuAlt1, HiOutlineX} from 'react-icons/hi';
import {TbTrees} from 'react-icons/tb';
import {MdWorkspacesOutline} from 'react-icons/md';

import UserDropdown from '@components/UserDropdown';
import NoticeBar from '@components/NoticeBar';

import cs from '@utils/cs';

import logo from '@images/lukim-nav-logo.png';

import classes from './styles';

const DashboardLayout = () => {
  const {pathname} = useLocation();
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [visibleNotice, setVisibleNotice] = useState(false);

  const handleIconToggle = useCallback(() => {
    setShowSideBar(!showSideBar);
  }, [showSideBar]);

  const MobileHeader = useCallback(
    () => (
      <div className={classes.mobileHeader}>
        <Link to='/'>
          <img src={logo} alt='lukim-logo' className={classes.logo} />
        </Link>
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
    <div>
      <NoticeBar noticeType='USER' setVisible={setVisibleNotice} />
      <MobileHeader />
      <div
        className={cs(
          classes.container,
          [classes.showSideBar, showSideBar],
          [classes.hideSideBar, !showSideBar],
        )}
      >
        <div className={cs(classes.sideBar, visibleNotice ? 'h-[calc(100vh-40px)]' : 'h-[100vh]')}>
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
              <p className={classes.linkText}>Map</p>
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
              <p className={classes.linkText}>Surveys List</p>
            </Link>
            <Link
              to='/custom-forms'
              className={cs(
                classes.link,
                [classes.activeLink, pathname === '/custom-forms'],
                [classes.inactiveLink, pathname !== '/custom-forms'],
              )}
            >
              <TbTrees size={20} />
              <p className={classes.linkText}>METT List</p>
            </Link>
            <Link
              to='/projects'
              className={cs(
                classes.link,
                [classes.activeLink, pathname === '/projects'],
                [classes.inactiveLink, pathname !== '/projects'],
              )}
            >
              <MdWorkspacesOutline size={20} />
              <p className={classes.linkText}>Projects</p>
            </Link>
            <div className={classes.userDropdown}>
              <UserDropdown />
            </div>
          </div>
        </div>
        <div className={cs(classes.child, visibleNotice ? 'h-[calc(100vh-40px)]' : 'h-[100vh]')}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
