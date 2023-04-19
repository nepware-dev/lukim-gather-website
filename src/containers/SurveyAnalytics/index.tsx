import React from 'react';

import DashboardLayout from '@components/DashboardLayout';

const SurveyAnalytics: React.FC = () => (
  <DashboardLayout>
    <iframe
      className='w-full h-screen'
      sandbox='allow-scripts allow-same-origin allow-presentation allow-popups allow-downloads allow-forms'
      title='Survey Dashboard'
      src='https://superset.lukimgather.org/superset/dashboard/2/?standalone=1'
    />
  </DashboardLayout>
);

export default SurveyAnalytics;
