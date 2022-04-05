import React from 'react';
import DashboardCard from '@components/DashboardCard';
import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';

const Dashboard = () => (
  <DashboardLayout>
    <DashboardHeader title='Dashboard' name='Andrew30' />
    <div className='flex flex-wrap justify-center gap-[20px] px-[20px] my-[24px]'>
      <DashboardCard />
      <DashboardCard />
      <DashboardCard />
      <DashboardCard />
    </div>
  </DashboardLayout>
);

export default Dashboard;
