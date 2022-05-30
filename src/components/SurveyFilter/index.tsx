import React from 'react';
import {IoFunnelOutline} from 'react-icons/io5';

import cs from '@utils/cs';

import classes from './styles';

interface Props {
  onClick(): void;
  active: boolean;
}

const SurveyFilter = ({onClick, active}: Props) => (
  <button
    type='button'
    className={cs(classes.filter, [classes.active, active])}
    onClick={onClick}
  >
    <IoFunnelOutline size={16} color='#585D69' />
    <span>
      Filters
    </span>
  </button>
);

export default SurveyFilter;
