import React from 'react';
import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import Map from '@components/Map';

import classes from './styles';

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
