import React from 'react';

interface Props {
  text: string;
}

const Button: React.FC<Props> = ({text}) => (
  <button
    type='button'
    className='h-[49px] px-5 bg-color-green-alt rounded-lg'
  >
    <p className='font-semibold font-inter text-color-white text-base'>
      {text}
    </p>
  </button>
);

export default Button;
