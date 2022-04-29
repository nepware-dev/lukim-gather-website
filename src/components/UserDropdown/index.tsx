import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AiOutlineSetting} from 'react-icons/ai';
import {FiLogOut} from 'react-icons/fi';

import {rootState} from '@store/rootReducer';
import {dispatchLogout} from '@services/dispatch';

import Dropdown from '@components/Dropdown';

const classes = {
  container: 'w-[222px] bg-[#fff] z-auto px-[16px] py-[12px] rounded-lg',
  itemWrapper: 'flex items-center gap-[12px] p-[10px] rounded-lg hover:bg-[#F0F3F6] cursor-pointer',
  itemText: 'font-inter text-[16px] text-[#282F3E]',
  separator: 'h-[1px] bg-[#E7E8EA] my-[4px]',
  labelWrapper: 'h-[44px] w-fit flex items-center gap-[8px] rounded-lg px-[12px] bg-[#FDF0E9] cursor-pointer',
  letterWrapper: 'w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#EC6D25]',
  letter: 'text-color-white uppercase',
  name: 'font-inter text-[16px] capitalize',
};

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
      <div className={classes.labelWrapper}>
        <div className={classes.letterWrapper}>
          <p className={classes.letter}>{firstName[0]}</p>
        </div>
        <p className={classes.name}>
          {firstName}
        </p>
      </div>
    ),
    [firstName],
  );
  return (
    <Dropdown renderLabel={renderLabel} alignRight={alignRight}>
      <div className={classes.container}>
        <div
          className={classes.itemWrapper}
          onClick={handleAccountSettings}
        >
          <AiOutlineSetting size={22} color='#888C94' />
          <p className={classes.itemText}>
            Account Setting
          </p>
        </div>
        <div className={classes.separator} />
        <div
          className={classes.itemWrapper}
          onClick={handleLogout}
        >
          <FiLogOut size={20} color='#888C94' />
          <p className={classes.itemText}>
            Logout
          </p>
        </div>
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
