import React from 'react';
import classes from './styles';

interface Props {
  img: string;
  text: string;
}

const InfoCard: React.FC<Props> = ({img, text}) => (
  <div className={classes.container}>
    <img src={img} alt='circle' className={classes.image} />
    <p className={classes.text}>
      {text}
    </p>
  </div>
);

export default InfoCard;
