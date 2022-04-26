import React from 'react';

interface Props {
  img: string;
  text: string;
}

const classes = {
  container: 'flex flex-row gap-[24px] py-[18px] px-[14px] bg-color-white rounded-xl',
  image: 'w-[56px]',
  text: 'font-inter font-[500] text-[16px] text-color-text sm:text-[18px]',
};

const InfoCard: React.FC<Props> = ({img, text}) => (
  <div className={classes.container}>
    <img src={img} alt='circle' className={classes.image} />
    <p className={classes.text}>
      {text}
    </p>
  </div>
);

export default InfoCard;
