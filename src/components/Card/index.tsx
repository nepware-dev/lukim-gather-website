import React from 'react';

interface Props {
  img: string;
  text: string;
}

const Card: React.FC<Props> = ({img, text}) => (
  <div className='w-[272px] max-h-[288px] flex flex-col items-center gap-[34px] rounded-2xl bg-color-white px-[34px] pt-[24px] pb-[34px] shadow-[0_20px_40px_rgba(0,0,0,0.05)]'>
    <img src={img} alt='' className='w-[102px] h-[102px]' />
    <p className='font-sans font-[700] text-[20px] leading-[24px] text-color-blue-primary text-center sm:text-[24px] sm:leading-[32px]'>
      {text}
    </p>
  </div>
);

export default Card;
