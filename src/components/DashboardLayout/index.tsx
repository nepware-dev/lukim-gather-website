import React, {ReactNode} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {BsFillGridFill} from 'react-icons/bs';
import {FiFileText} from 'react-icons/fi';

import logo from '@images/lukim-nav-logo.png';

const styles = {
  itemWrapper:
    'flex items-center py-[10px] px-[8px] mb-[15px] rounded-lg gap-[15px]',
  active: 'bg-color-white text-[#00518B]',
  inactive: 'text-[#404653]',
};

const DashboardLayout = ({children}: {children: ReactNode}) => {
  const {pathname} = useLocation();
  return (
    <div>
      <div className='flex'>
        <div className='w-[236px] min-h-[100vh] px-[20px] bg-[#F2F5F9] border-r border-[#CCDCE8]'>
          <Link to='/'>
            <div className='mt-[24px] mb-[85px]'>
              <img src={logo} alt='lukim-logo' className='h-[60px]' />
            </div>
          </Link>
          <div>
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
                  4
                </span>
              </div>
            </Link>
          </div>
        </div>
        <div className='w-[100%]'>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
