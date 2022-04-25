import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsArrowLeftShort} from 'react-icons/bs';

import UserDropdown from '@components/UserDropdown';

interface Props {
  title?: string;
}

const DashboardHeader: React.FC<Props> = ({title}) => {
  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className='hidden md:flex h-[84px] w-[100%] px-[20px] justify-between items-center border-b border-[#CCDCE8]'>
      <h1
        className={`font-inter font-[600] text-[24px] text-[#101828] ${
          !title && 'hidden'
        }`}
      >
        {title}
      </h1>
      <div
        className={`flex items-center gap-[12px] cursor-pointer ${
          title && 'hidden'
        }`}
        onClick={handleGoBack}
      >
        <BsArrowLeftShort size={25} color='#101828' />
        <p className='font-inter font-[400] text-[16px] text-[#101828]'>Back</p>
      </div>
      <UserDropdown alignRight />
    </div>
  );
};

export default DashboardHeader;
