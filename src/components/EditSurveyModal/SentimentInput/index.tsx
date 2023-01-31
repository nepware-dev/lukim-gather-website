import React, {useCallback} from 'react';
import {BsFillCheckCircleFill} from 'react-icons/bs';

import List from '@ra/components/List';

import cs from '@utils/cs';

import classes from './styles';

const feels = ['🙁', '🙂', '😐'];

const keyExtractor = (item: string) => item;

interface SentimentInputProps {
    activeFeel: string;
    onChange: (feel: string) => void;
}

interface Props {
    feel: string;
    activeFeel: string;
    onPress(emo: string | null): void;
}

const SurveySentiment: React.FC<Props> = ({feel, activeFeel, onPress}) => {
  const handlePress = useCallback(
    () => (feel === activeFeel ? onPress(null) : onPress(feel))
    , [feel, onPress, activeFeel],
  );

  return (
    <div
      className={cs(
        classes.sentiment,
        [classes.activeSentiment, activeFeel === feel],
      )}
      onClick={handlePress}
    >
      {activeFeel === feel && (
        <div
          className={classes.checkIcon}
        >
          <BsFillCheckCircleFill size={14} color='#2263AA' />
        </div>
      )}
      {feel}
    </div>
  );
};

const SentimentInput: React.FC<SentimentInputProps> = (props) => {
  const {activeFeel, onChange} = props;

  const renderItems = useCallback(({item}) => (
    <SurveySentiment
      feel={item}
      activeFeel={activeFeel}
      onPress={onChange}
    />
  ), [activeFeel, onChange]);

  return (
    <List
      data={feels}
      className={classes.listWrapper}
      renderItem={renderItems}
      keyExtractor={keyExtractor}
    />
  );
};

export default SentimentInput;
