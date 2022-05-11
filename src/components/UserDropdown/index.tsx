import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AiOutlineSetting} from 'react-icons/ai';
import {FiLogOut} from 'react-icons/fi';

import {rootState} from '@store/rootReducer';
import {dispatchLogout} from '@services/dispatch';

import Dropdown from '@components/Dropdown';

import classes from './styles';

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
