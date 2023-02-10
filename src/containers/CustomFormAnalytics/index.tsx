import React from 'react';

import DashboardLayout from '@components/DashboardLayout';

const CustomFormAnalytics: React.FC = () => (
  <DashboardLayout>
    <iframe
      className='w-full h-screen'
      sandbox='allow-scripts allow-same-origin allow-presentation allow-popups allow-downloads allow-forms'
      title='Custom Form Analytics'
      src='https://superset.lukimgather.org/superset/dashboard/1/?standalone=1'
    />
  </DashboardLayout>
);

export default CustomFormAnalytics;
