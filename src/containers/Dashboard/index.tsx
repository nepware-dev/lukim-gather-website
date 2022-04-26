import React from 'react';
import DashboardCard from '@components/DashboardCard';
import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';

const classes = {
  title: 'md:hidden m-[20px] font-inter font-[600] text-[24px] text-[#101828]',
  contentWrapper: 'flex flex-wrap justify-center gap-[20px] px-[20px] my-[24px]',
};

const Dashboard = () => (
  <DashboardLayout>
    <DashboardHeader title='Dashboard' />
    <h2 className={classes.title}>Dashboard</h2>
    <div className={classes.contentWrapper}>
      <DashboardCard />
      <DashboardCard />
      <DashboardCard />
      <DashboardCard />
    </div>
  </DashboardLayout>
);

export default Dashboard;
