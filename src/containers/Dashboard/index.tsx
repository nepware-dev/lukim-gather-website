import React from 'react';
import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import Map from '@components/Map';

const classes = {
  title: 'md:hidden m-[20px] font-interSemibold text-[24px] text-[#101828]',
  mapWrapper: 'h-[90%] w-[100%] mx-[1em] rounded-lg',
};

const Dashboard = () => (
  <DashboardLayout>
    <DashboardHeader title='Dashboard' />
    <h2 className={classes.title}>Dashboard</h2>
    <div className={classes.mapWrapper}>
      <Map showCluster />
    </div>
  </DashboardLayout>
);

export default Dashboard;
