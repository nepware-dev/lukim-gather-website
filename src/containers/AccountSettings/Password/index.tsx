import React, {useState, useCallback} from 'react';
import {useSelector, useDispatch, type RootStateOrAny} from 'react-redux';
import {useMutation, useLazyQuery} from '@apollo/client';

import InputField from '@components/InputField';
import Button from '@components/Button';

import useToast from '@hooks/useToast';
import {CHANGE_PASSWORD, SET_PASSWORD, GET_ME} from '@services/queries';
import {setUser} from '@store/slices/auth';

import classes from './styles';

const PasswordSettings:React.FC = () => {
  const dispatch = useDispatch();

  const {user} = useSelector((state: RootStateOrAny) => state.auth);
  const hasPassword = user?.hasPassword;

  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [getUserData] = useLazyQuery(GET_ME, {
    onCompleted: ({me}) => {
      dispatch(setUser(me));
    },
  });

  const [changePassword, {loading}] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      toast('success', 'Password has been successfully changed!');
      setCurrentPassword('');
      setNewPassword('');
    },
    onError: (err) => {
      setError(String(err));
      toast('error', String(err));
    },
  });

  const [setPasswordMutation, {loading: setPasswordLoading}] = useMutation(SET_PASSWORD, {
    onCompleted: () => {
      getUserData();
      toast('success', 'Your password has been set successfully!');
      setNewPassword('');
    },
    onError: (err) => {
      getUserData();
      toast('error', String(err));
    },
  });

  const handleCurrentPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentPassword(e.target.value);
    },
    [],
  );

  const handleNewPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    },
    [],
  );

  const handleChangePassword = useCallback(async () => {
    setError('');
    await changePassword({
      variables: {
        data: {
          password: currentPassword,
          newPassword,
          rePassword: newPassword,
        },
      },
    });
  }, [changePassword, currentPassword, newPassword]);

  const handleSetPassword = useCallback(async () => {
    await setPasswordMutation({
      variables: {
        data: {
          newPassword,
          rePassword: newPassword,
        },
      },
    });
  }, [setPasswordMutation, newPassword]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (hasPassword) {
      if (!currentPassword || !newPassword) {
        toast('error', 'Please enter passwords to change!');
      } else {
        handleChangePassword();
      }
    } else if (!newPassword) {
      toast('error', 'Please enter password to set!');
    } else {
      handleSetPassword();
    }
  }, [hasPassword, handleSetPassword, handleChangePassword, currentPassword, newPassword, toast]);

  return (
    <form className={classes.inputsWrapper} onSubmit={handleFormSubmit}>
      {hasPassword && (
        <InputField
          password
          title='Current password'
          placeholder='Enter your current password'
          value={currentPassword}
          onChange={handleCurrentPassword}
          inputClassname={classes.input}
        />
      )}
      <InputField
        password
        title='New password'
        placeholder='Enter your new password'
        value={newPassword}
        onChange={handleNewPassword}
        inputClassname={classes.input}
      />
      <Button
        text='Save Changes'
        onClick={hasPassword ? handleChangePassword : handleSetPassword}
        disabled={hasPassword ? !(currentPassword && newPassword) : !newPassword}
        loading={!error && (loading || setPasswordLoading)}
      />
    </form>
  );
};

export default PasswordSettings;
