import React, {useCallback, useMemo} from 'react';

import cs from '@utils/cs';
import {findPropertyAnywhere} from '@utils/searchTree';
import {formatDate} from '@utils/formatDate';

import classes from './styles';

export type FormDataType = {
  id: number | string;
  title: string;
  createdAt: string;
  answer: string;
};

interface Props {
  data: FormDataType[];
  setActiveIndex(i: number): void;
  setShowDetails(value: boolean): void;
}

interface ItemProps {
  item: FormDataType;
  index: number;
  setIndex(i: number): void;
  setShowDetails(value: boolean): void;
}

const FormItem: React.FC<ItemProps> = ({
  item,
  index,
  setIndex,
  setShowDetails,
}) => {
  const formAnswers = useMemo(() => JSON.parse(item.answer), [item]);

  const handleClick = useCallback(() => {
    setIndex(index);
    setShowDetails(true);
  }, [index, setIndex, setShowDetails]);

  const interviewerName = useMemo(
    () => findPropertyAnywhere(formAnswers, 'interviewer_name'),
    [formAnswers],
  );

  return (
    <tr className={classes.tableItemRow}>
      <td>
        <p className={classes.itemTitle}>{item.title}</p>
      </td>
      <td>
        <p className={classes.tableText}>{interviewerName}</p>
      </td>
      <td>
        <p className={classes.tableText}>{formatDate(item.createdAt)}</p>
      </td>
      <td>
        <button type='button' className={classes.button} onClick={handleClick}>
          View entry
        </button>
      </td>
    </tr>
  );
};

const FormTable: React.FC<Props> = ({data, setActiveIndex, setShowDetails}) => (
  <div className={classes.container}>
    <table className={classes.table}>
      <thead>
        <tr className={classes.tableHeadRow}>
          <th>
            <p className={cs(classes.headingTitle, 'pl-[20px]')}>Title</p>
          </th>
          <th>
            <p className={classes.headingTitle}>Interviewer</p>
          </th>
          <th>
            <p className={classes.headingTitle}>Date</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map((item: FormDataType, index: number) => (
            <FormItem
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
              <p className={classes.notFound}>No Form Found</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default FormTable;
