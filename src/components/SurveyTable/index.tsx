import React, {useCallback} from 'react';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';
import useCategoryIcon from '@hooks/useCategoryIcon';
import {Improvement} from '@components/SurveyEntry';

import tree from '@images/category-tree.png';

import classes from './styles';

export type SurveyDataType = {
  id: number | string;
  title: string;
  description: string;
  attachment: {media: string}[];
  category: {id: string | number; title: string};
  createdAt: string;
  location: {type: string; coordinates: [number, number]};
  sentiment: string;
  status: string;
  boundary: {coordinates: [[[number, number][]]]} | null;
  improvement: string | null;
};

interface Props {
  data: SurveyDataType[];
  setActiveIndex(i: number): void;
  setShowDetails(value: boolean): void;
}

interface ItemProps {
  item: SurveyDataType;
  index: number;
  setIndex(i: number): void;
  setShowDetails(value: boolean): void;
}

const SurveyItem: React.FC<ItemProps> = ({
  item,
  index,
  setIndex,
  setShowDetails,
}) => {
  const [categoryIcon] = useCategoryIcon(item?.category?.id);
  const handleClick = useCallback(() => {
    setIndex(index);
    setShowDetails(true);
  }, [index, setIndex, setShowDetails]);

  return (
    <tr className={classes.tableItemRow}>
      <td>
        <p className={classes.itemTitle}>{item.title}</p>
      </td>
      <td>
        <div className={classes.categoryWrapper}>
          <img
            src={categoryIcon || tree}
            alt='category'
            className={classes.categoryIcon}
          />
          <p className={classes.categoryTitle}>{item.category.title}</p>
        </div>
      </td>
      <td>
        <div className='ml-9'>
          <Improvement improvement={item?.improvement} />
        </div>
      </td>
      <td>
        <p className={classes.date}>{formatDate(item.createdAt)}</p>
      </td>
      <td>
        <p
          className={cs(
            classes.status,
            [classes.pending, item.status.toLowerCase() === 'pending'],
            [classes.rejected, item.status.toLowerCase() === 'rejected'],
            [classes.approved, item.status.toLowerCase() === 'approved'],
          )}
        >
          {item.status}
        </p>
      </td>
      <td>
        <button type='button' className={classes.button} onClick={handleClick}>
          View entry
        </button>
      </td>
    </tr>
  );
};

const SurveyTable: React.FC<Props> = ({
  data,
  setActiveIndex,
  setShowDetails,
}) => (
  <div className={classes.container}>
    <table className={classes.table}>
      <thead>
        <tr className={classes.tableHeadRow}>
          <th>
            <p className={cs(classes.headingTitle, 'pl-[20px]')}>Survey</p>
          </th>
          <th>
            <p className={classes.headingTitle}>Category</p>
          </th>
          <th>
            <p className={classes.headingTitle}>Improvement</p>
          </th>
          <th>
            <p className={classes.headingTitle}>Date</p>
          </th>
          <th>
            <p className={classes.headingTitle}>Status</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map((item: SurveyDataType, index: number) => (
            <SurveyItem
              key={item.id}
              item={item}
              index={index}
              setIndex={setActiveIndex}
              setShowDetails={setShowDetails}
            />
          ))
        ) : (
          <tr>
            <td>
              <p className={classes.notFound}>No Survey Found</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default SurveyTable;
