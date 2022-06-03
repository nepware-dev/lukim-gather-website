import React, {useCallback, useState} from 'react';
import {gql, useMutation} from '@apollo/client';

import useToast from '@hooks/useToast';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import AccountTab from '@components/AccountTab';
import InputField from '@components/InputField';
import Button from '@components/Button';

import classes from './styles';

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
        changePassword(data: $data) {
            ok
        }
    }
`;

const AccountSettings = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<string>('Password');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
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

  const handleChangePassword = useCallback(async () => {
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

  const handleTab = useCallback((text: string) => {
    setActiveTab(text);
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className={classes.container}>
        <h2 className={classes.title}>Account Settings</h2>
        <div className={classes.contentWrapper}>
          <div className={classes.tabsWrapper}>
            <AccountTab
              text='Password'
              isActive={activeTab === 'Password'}
              onClick={handleTab}
            />
          </div>
          <div className='w-fit'>
            <div className={classes.inputsWrapper}>
              <InputField
                password
                title='Current password'
                placeholder='Enter your current password'
                value={currentPassword}
                onChange={handleCurrentPassword}
                inputClassname={classes.input}
              />
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
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword}
                loading={!error && loading}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
