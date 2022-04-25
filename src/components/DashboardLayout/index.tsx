import React, {ReactNode, useCallback, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {BsFillGridFill} from 'react-icons/bs';
import {FiFileText} from 'react-icons/fi';
import {HiMenuAlt1, HiOutlineX} from 'react-icons/hi';

import UserDropdown from '@components/UserDropdown';
import logo from '@images/lukim-nav-logo.png';

const styles = {
  itemWrapper:
    'flex items-center py-[10px] px-[8px] mb-[15px] rounded-lg gap-[15px]',
  active: 'bg-color-white text-[#00518B]',
  inactive: 'text-[#404653]',
};

const DashboardLayout = ({children}: {children: ReactNode}) => {
  const {pathname} = useLocation();
  const [showSideBar, setShowSideBar] = useState<boolean>(false);

  const handleIconToggle = useCallback(() => {
    setShowSideBar(!showSideBar);
  }, [showSideBar]);

  const MobileHeader = useCallback(
    () => (
      <div className='md:hidden w-full p-4 flex items-center justify-between border-b border-[#CEDCEC]'>
        <img src={logo} alt='lukim-logo' className='h-[60px]' />
        <div className='cursor-pointer'>
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
    <div className='overflow-x-hidden'>
      <MobileHeader />
      <div
        className={`flex md:-translate-x-0 ease-in-out duration-300 ${
          showSideBar ? '-translate-x-0' : '-translate-x-[235px]'
        }`}
      >
        <div className='min-w-[236px] min-h-[100vh] px-[20px] bg-[#F2F5F9] border-r border-[#CCDCE8]'>
          <Link to='/' className='hidden md:inline-block'>
            <div className='mt-[24px]'>
              <img src={logo} alt='lukim-logo' className='h-[60px]' />
            </div>
          </Link>
          <div className='flex flex-col mt-[85px]'>
            <Link to='/dashboard'>
              <div
                className={`${styles.itemWrapper} ${
                  pathname === '/dashboard' ? styles.active : styles.inactive
                }`}
              >
                <BsFillGridFill size={20} />
                <p className='font-inter font-[600] text-[16px]'>Dashboard</p>
              </div>
            </Link>
            <Link to='/surveys'>
              <div
                className={`${styles.itemWrapper} ${
                  pathname === '/surveys' ? styles.active : styles.inactive
                }`}
              >
                <FiFileText size={20} />
                <p className='font-inter font-[600] text-[16px]'>Surveys</p>
                <span
                  className={`w-[24px] h-[19px] flex items-center justify-center ml-auto text-[12px] font-[400] font-inter bg-[#E6EEF3] rounded-full ${
                    pathname !== '/surveys' && 'hidden'
                  }`}
                >
                  -
                </span>
              </div>
            </Link>
            <div className='md:hidden mt-[20px]'>
              <UserDropdown />
            </div>
          </div>
        </div>
        <div className='w-screen'>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
