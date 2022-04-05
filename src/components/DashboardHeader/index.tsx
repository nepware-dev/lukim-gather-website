import React from 'react';

interface Props {
  title: string;
  name: string;
}

const DashboardHeader: React.FC<Props> = ({title, name}) => (
  <div className='h-[84px] w-[100%] px-[20px] flex justify-between items-center border-b border-[#CCDCE8]'>
    <h1 className='font-inter font-[600] text-[24px] text-[#101828]'>
      {title}
    </h1>
    <div className='h-[44px] flex items-center gap-[8px] rounded-lg px-[12px] bg-[#F0F6EA]'>
      <div className='w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#6AA12A]'>
        <p className='text-color-white uppercase'>{name[0]}</p>
      </div>
      <p className='font-inter font-[400] text-[16px] capitalize'>{name}</p>
    </div>
  </div>
);

export default DashboardHeader;
