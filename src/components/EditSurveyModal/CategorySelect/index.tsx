import React, {useCallback} from 'react';
import {HiOutlineX} from 'react-icons/hi';

import List from '@ra/components/List';

import surveyCategory from '@data/surveyCategory';

import classes from './styles';

const keyExtractor = (item: {id: number}) => item.id;

const Category = ({data, onPress}: {data: any; onPress: (el: any) => void}) => {
  const renderList = useCallback((category) => (
    <div
      onClick={() => onPress(category?.item)}
      className={classes.categoryItem}
    >
      <img className={classes.categoryIcon} src={category?.item?.icon} alt={category?.item?.name} />
      {category?.item?.name}
    </div>
  ), [onPress]);

  return (
    <div className={classes.categoryList}>
      <p className={classes.listHeading}>{data?.title}</p>
      <List
        data={data?.childs}
        renderItem={renderList}
        className='flex flex-wrap gap-2'
        keyExtractor={keyExtractor}
      />
    </div>
  );
};

const CategorySelect = (
  {onClose, handleSelect}: {onClose: React.MouseEventHandler; handleSelect: any},
) => {
  const renderContent = useCallback(({item}) => (
    <Category onPress={handleSelect} data={item} />
  ), [handleSelect]);
  return (
    <div className={classes.categoryContainer}>
      <div className={classes.header}>
        <div className={classes.heading}>Change Category</div>
        <div onClick={onClose} className={classes.closeWrapper}>
          <HiOutlineX size={14} />
        </div>
      </div>
      <List
        data={surveyCategory}
        renderItem={renderContent}
        className='px-3'
        keyExtractor={keyExtractor}
      />
    </div>
  );
};

export default CategorySelect;
