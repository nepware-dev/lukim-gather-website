import React, {ReactNode, useCallback, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {BsFillGridFill} from 'react-icons/bs';
import {FiFileText} from 'react-icons/fi';
import {HiMenuAlt1, HiOutlineX} from 'react-icons/hi';
import {GoListUnordered} from 'react-icons/go';
import {MdWorkspacesOutline} from 'react-icons/md';

import cs from '@utils/cs';
import UserDropdown from '@components/UserDropdown';

import logo from '@images/lukim-nav-logo.png';

import classes from './styles';

const DashboardLayout = ({
  children,
  hideOverflowY = false,
}: {
  children: ReactNode;
  hideOverflowY?: boolean;
}) => {
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
    <div
      className={cs(classes.mainContainer, [
        classes.hideOverflowY,
        hideOverflowY,
      ])}
    >
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
              <GoListUnordered size={20} />
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
        <div className={classes.child}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
