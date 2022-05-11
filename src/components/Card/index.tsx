import React from 'react';
import classes from './styles';

interface Props {
  img: string;
  text: string;
}

const Card: React.FC<Props> = ({img, text}) => (
  <div className={classes.container}>
    <img src={img} alt='' className={classes.image} />
    <p className={classes.text}>
      {text}
    </p>
  </div>
);

export default Card;
