import React from 'react';

const SurveyAnalytics: React.FC = () => (
  <iframe
    className='w-full h-screen'
    sandbox='allow-scripts allow-same-origin allow-presentation allow-popups allow-downloads allow-forms'
    title='Survey Dashboard'
    src='https://superset.lukimgather.org/superset/dashboard/2/?standalone=1'
  />
);

export default SurveyAnalytics;
