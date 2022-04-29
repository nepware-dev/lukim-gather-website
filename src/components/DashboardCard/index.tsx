import React from 'react';

const classes = {
  container: 'w-[480px] lg:w-[570px] h-[374px] p-[16px] rounded-lg border border-[#CCDCE8]',
  text: 'font-interSemibold text-[16px] text-color-text',
};

const DashboardCard = () => (
  <div className={classes.container}>
    <p className={classes.text}>
      Card Title
    </p>
  </div>
);

export default DashboardCard;
