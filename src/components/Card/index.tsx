import React from 'react';

interface Props {
  img: string;
  text: string;
}

const classes = {
  container: 'w-[272px] max-h-[288px] flex flex-col items-center gap-[34px] rounded-2xl bg-color-white px-[34px] pt-[24px] pb-[34px] shadow-[0_20px_40px_rgba(0,0,0,0.05)]',
  image: 'w-[102px] h-[102px]',
  text: 'font-sans font-[700] text-[20px] leading-[24px] text-color-blue-primary text-center sm:text-[24px] sm:leading-[32px]',
};

const Card: React.FC<Props> = ({img, text}) => (
  <div className={classes.container}>
    <img src={img} alt='' className={classes.image} />
    <p className={classes.text}>
      {text}
    </p>
  </div>
);

export default Card;
