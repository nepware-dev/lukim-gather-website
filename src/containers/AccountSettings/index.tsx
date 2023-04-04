import React, {useCallback, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import AccountTab from '@components/AccountTab';

import {rootState} from '@store/rootReducer';

import EmailSettings from './Email';
import PasswordSettings from './Password';
import PhoneNumberSettings from './PhoneNumber';

import classes from './styles';

type TabType = {
  title: string;
};

const tabs:TabType[] = [{
  title: 'Email',
}, {
  title: 'Phone Number',
}, {
  title: 'Password',
}];

const AccountSettings = () => {
  const {
    auth: {
      user: {email},
    },
  } = useSelector((state: rootState) => state);

  const visibleTabs = useMemo(() => {
    if (email) {
      return tabs;
    }
    return tabs.filter((tab) => tab.title !== 'Password');
  }, [email]);

  const [activeTab, setActiveTab] = useState<TabType['title']>(visibleTabs[0].title);

  const handleTab = useCallback((tab: TabType['title']) => {
    setActiveTab(tab);
  }, []);

  const handlePasswordTab = useCallback(() => {
    setActiveTab('Password');
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className={classes.container}>
        <h2 className={classes.title}>Account Settings</h2>
        <div className={classes.contentWrapper}>
          <div className={classes.tabsWrapper}>
            {visibleTabs.map((tab) => (
              <AccountTab
                text={tab.title}
                isActive={activeTab === tab.title}
                onClick={handleTab}
              />
            ))}
          </div>
          <div className='w-fit'>
            {activeTab === 'Email' && <EmailSettings onPasswordError={handlePasswordTab} />}
            {activeTab === 'Password' && <PasswordSettings />}
            {activeTab === 'Phone Number' && <PhoneNumberSettings />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
