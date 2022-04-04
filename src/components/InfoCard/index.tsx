import React from 'react';

interface Props {
  img: string;
  text: string;
}

const InfoCard: React.FC<Props> = ({img, text}) => (
  <div className='flex flex-row gap-[24px] py-[18px] px-[14px] bg-color-white rounded-xl'>
    <img src={img} alt='circle' className='w-[56px]' />
    <p className='font-inter font-[500] text-[16px] text-color-text sm:text-[18px]'>
      {text}
    </p>
  </div>
);

export default InfoCard;
