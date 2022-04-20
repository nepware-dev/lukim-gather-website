import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AiOutlineSetting} from 'react-icons/ai';
import {FiLogOut} from 'react-icons/fi';
import {BsArrowLeftShort} from 'react-icons/bs';

import {rootState} from '@store/rootReducer';
import {dispatchLogout} from '@services/dispatch';

import Dropdown from '@components/Dropdown';

interface Props {
  title?: string;
}

const DashboardHeader: React.FC<Props> = ({title}) => {
  const navigate = useNavigate();
  const {
    auth: {
      user: {firstName},
    },
  } = useSelector((state: rootState) => state);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleAccountSettings = useCallback(() => {
    navigate('/account-settings');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    dispatchLogout();
  }, []);

  const renderLabel = useCallback(
    () => (
      <div className='h-[44px] flex items-center gap-[8px] rounded-lg px-[12px] bg-[#F0F6EA] cursor-pointer'>
        <div className='w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#6AA12A]'>
          <p className='text-color-white uppercase'>{firstName[0]}</p>
        </div>
        <p className='font-inter font-[400] text-[16px] capitalize'>
          {firstName}
        </p>
      </div>
    ),
    [firstName],
  );

  return (
    <div className='h-[84px] w-[100%] px-[20px] flex justify-between items-center border-b border-[#CCDCE8]'>
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
      <Dropdown renderLabel={renderLabel}>
        <div className='w-[222px] bg-[#fff] px-[16px] py-[12px] rounded-lg'>
          <div
            className='flex items-center gap-[12px] p-[10px] rounded-lg hover:bg-[#F0F3F6] cursor-pointer'
            onClick={handleAccountSettings}
          >
            <AiOutlineSetting size={22} color='#888C94' />
            <p className='font-inter font-[400] text-[16px] text-[#282F3E]'>
              Account Setting
            </p>
          </div>
          <div className='h-[1px] bg-[#E7E8EA] my-[4px]' />
          <div
            className='flex items-center gap-[12px] p-[10px] rounded-lg hover:bg-[#F0F3F6] cursor-pointer'
            onClick={handleLogout}
          >
            <FiLogOut size={20} color='#888C94' />
            <p className='font-inter font-[400] text-[16px] text-[#282F3E]'>
              Logout
            </p>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default DashboardHeader;
