import React from 'react';
import appleIcon from '@images/apple.svg';
import androidIcon from '@images/android.svg';

interface Props {
  android?: boolean;
  bgGrey?: boolean;
}

const AppButton: React.FC<Props> = ({android = false, bgGrey = false}) => (
  <button
    type='button'
    className={`w-[193px] h-[68px] rounded-xl flex items-center justify-center shadow-[0_5px_10px_rgba(0,0,0,0.05)] ${
      bgGrey ? 'bg-color-bg' : 'bg-color-white'
    }`}
  >
    <img
      src={android ? androidIcon : appleIcon}
      alt='apple-icon'
      className='w-[32px]'
    />
    <div className='flex flex-col items-start ml-[16px]'>
      <p className='font-inter font-[400] text-color-lt-grey'>Soon on</p>
      <p className='font-inter font-[500] text-color-black'>
        {android ? 'Play Store' : 'App Store'}
      </p>
    </div>
  </button>
);

export default AppButton;
