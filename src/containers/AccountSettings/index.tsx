import React, {useCallback, useState} from 'react';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import AccountTab from '@components/AccountTab';
import InputField from '@components/InputField';
import Button from '@components/Button';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState<string>('Email');
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const handleEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

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

  const handleSaveChanges = useCallback(() => {
    setEmail('');
    setCurrentPassword('');
    setNewPassword('');
  }, []);

  const handleTab = useCallback((text: string) => {
    setActiveTab(text);
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className='px-[20px] mt-[24px]'>
        <h2 className='font-inter font-[600] text-[24px] text-[#101828] mb-[34px]'>
          Account Settings
        </h2>
        <div className='flex flex-col md:flex-row gap-[30px] h-[calc(100vh-178px)]'>
          <div className='flex md:flex-col gap-[20px] border-r border-[#E7E8EA]'>
            <AccountTab
              text='Email'
              isActive={activeTab === 'Email'}
              onClick={handleTab}
            />
            <AccountTab
              text='Password'
              isActive={activeTab === 'Password'}
              onClick={handleTab}
            />
          </div>
          <div className='w-fit'>
            {activeTab === 'Email' ? (
              <InputField
                title='Email'
                placeholder='john@example.com'
                value={email}
                onChange={handleEmail}
                inputClassname='w-[calc(100vw-40px)] md:w-[350px] lg:w-[409px] max-w-[409px]'
              />
            ) : (
              <div className='flex flex-col gap-[24px]'>
                <InputField
                  password
                  title='Current password'
                  placeholder='Enter your current password'
                  value={currentPassword}
                  onChange={handleCurrentPassword}
                  inputClassname='w-[calc(100vw-40px)] md:w-[350px] lg:w-[409px] max-w-[409px]'
                />
                <InputField
                  password
                  title='New password'
                  placeholder='Enter your new password'
                  value={newPassword}
                  onChange={handleNewPassword}
                  inputClassname='w-[calc(100vw-40px)] md:w-[350px] lg:w-[409px] max-w-[409px]'
                />
                <Button
                  text='Save Changes'
                  onClick={handleSaveChanges}
                  disabled={!email || !currentPassword || !newPassword}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
