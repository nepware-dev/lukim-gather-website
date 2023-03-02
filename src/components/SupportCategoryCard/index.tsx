import React, {useCallback} from 'react';

import cs from '@ra/cs';

import classes from './styles';

export const ChildTopicCard = (
  {item, onClick, isActive} : {item: {title: string}; onClick: any; isActive: boolean},
) => {
  const handleClick = useCallback(() => onClick(item), [item, onClick]);
  return (
    <div
      onClick={handleClick}
      className={cs(classes.childCard, isActive ? 'bg-[#00518B] border-color-white' : 'bg-[#0B4570] border-[#3B75B4]')}
    >
      {item.title}
    </div>
  );
};

const TopicCard = ({item, onClick, isActive} : {item: any; onClick: any; isActive: boolean}) => {
  const handleClick = useCallback(() => onClick(item), [item, onClick]);
  return (
    <div
      className={cs(classes.topicCard, isActive ? 'bg-[#00518B] border-color-white' : 'bg-[#0B4570] border-[#3B75B4]')}
      onClick={handleClick}
    >
      <span className={cs('material-symbols-rounded text-[28px] group-hover:text-color-white', isActive ? 'text-color-white' : 'text-[#C7E5FB]')}>
        {item.icon}
      </span>
      <h6 className={classes.topicTitle}>{item?.parent?.title}</h6>
    </div>
  );
};

export default TopicCard;
