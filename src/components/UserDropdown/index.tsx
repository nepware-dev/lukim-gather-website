import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AiOutlineSetting} from 'react-icons/ai';
import {FiLogOut} from 'react-icons/fi';

import {rootState} from '@store/rootReducer';
import {dispatchLogout} from '@services/dispatch';

import Dropdown from '@components/Dropdown';

const UserDropdown = ({alignRight}: {alignRight?: boolean}) => {
  const navigate = useNavigate();
  const {
    auth: {
      user: {firstName},
    },
  } = useSelector((state: rootState) => state);

  const handleAccountSettings = useCallback(() => {
    navigate('/account-settings');
  }, [navigate]);
  const handleLogout = useCallback(() => {
    dispatchLogout();
  }, []);

  const renderLabel = useCallback(
    () => (
      <div className='h-[44px] w-fit flex items-center gap-[8px] rounded-lg px-[12px] bg-[#FDF0E9] cursor-pointer'>
        <div className='w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#EC6D25]'>
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
    <Dropdown renderLabel={renderLabel} alignRight={alignRight}>
      <div className='w-[222px] bg-[#fff] z-auto px-[16px] py-[12px] rounded-lg'>
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
  );
};

export default UserDropdown;
