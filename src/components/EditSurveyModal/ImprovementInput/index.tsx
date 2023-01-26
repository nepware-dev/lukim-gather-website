import React, {useCallback} from 'react';
import {BsFillCheckCircleFill} from 'react-icons/bs';

import {Improvement} from '@components/SurveyEntry';

import List from '@ra/components/List';

import cs from '@utils/cs';

import classes from './styles';

interface ImprovementInputProps {
    activeImprovement: string;
    onChange: (improvement: string) => void;
}

const improvements = ['INCREASING', 'SAME', 'DECREASING'];

const keyExtractor = (item: string) => item;

interface Props {
  improvement: string;
    activeImprovement: string;
    onPress(emo: string | null): void;
}

const SurveyImprovement: React.FC<Props> = ({improvement, activeImprovement, onPress}) => {
  const handlePress = useCallback(
    () => (improvement === activeImprovement ? onPress(null) : onPress(improvement))
    , [improvement, onPress, activeImprovement],
  );

  return (
    <div
      className={cs(
        classes.improvement,
        [classes.activeImprovement, activeImprovement === improvement],
      )}
      onClick={handlePress}
    >
      {activeImprovement === improvement && (
        <div
          className={classes.checkIcon}
        >
          <BsFillCheckCircleFill size={14} color='#2263AA' />
        </div>
      )}
      <Improvement improvement={improvement} iconColor={activeImprovement === improvement ? '#EC6D25' : '#70747E'} />
    </div>
  );
};

const ImprovementInput: React.FC<ImprovementInputProps> = (props) => {
  const {activeImprovement, onChange} = props;

  const renderItems = useCallback(({item}) => (
    <SurveyImprovement
      improvement={item}
      activeImprovement={activeImprovement}
      onPress={onChange}
    />
  ), [activeImprovement, onChange]);

  return (
    <List
      data={improvements}
      className={classes.listWrapper}
      renderItem={renderItems}
      keyExtractor={keyExtractor}
    />
  );
};

export default ImprovementInput;
