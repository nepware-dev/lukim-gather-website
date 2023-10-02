import React, {useCallback, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';

import cs from '@utils/cs';
import {findPropertyAnywhere} from '@utils/searchTree';
import {formatDate} from '@utils/formatDate';

import classes from './styles';

export type FormDataType = {
  id: number | string;
  title: string;
  createdAt: string;
  answer: string;
  createdBy: {id: string};
};

interface Props {
  data: FormDataType[];
  loading: boolean;
  setShowDetails(value: boolean): void;
}

interface ItemProps {
  item: FormDataType;
  setShowDetails(value: boolean): void;
}

const FormItem: React.FC<ItemProps> = ({
  item,
  setShowDetails,
}) => {
  const navigate = useNavigate();
  const formAnswers = useMemo(() => JSON.parse(item.answer), [item]);

  const handleClick = useCallback((id: string|number) => {
    navigate(`/custom-forms/${id}`);
    setShowDetails(true);
  }, [navigate, setShowDetails]);

  const interviewerName = useMemo(
    () => findPropertyAnywhere(formAnswers, 'interviewer_name'),
    [formAnswers],
  );

  const title = useMemo(
    () => findPropertyAnywhere(formAnswers, 'village_name'),
    [formAnswers],
  );

  return (
    <tr className={classes.tableItemRow}>
      <td className='w-1/3'>
        <p className={classes.itemTitle}>{(title || item.title).substring(0, 50)}</p>
      </td>
      <td className='w-1/3'>
        <p className={classes.tableText}>{(interviewerName ?? '').substring(0, 50)}</p>
      </td>
      <td>
        <p className={classes.tableText}>{formatDate(item.createdAt)}</p>
      </td>
      <td>
        <button type='button' className={classes.button} onClick={() => handleClick(item.id)}>
          View entry
        </button>
      </td>
    </tr>
  );
};

const FormTable: React.FC<Props> = ({
  data, loading, setShowDetails,
}) => (
  <div className={classes.container}>
    <table className={classes.table}>
      <thead>
        <tr className={classes.tableHeadRow}>
          <th>
            <p className={cs(classes.headingTitle, 'pl-[20px]')}>Village/Community</p>
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
          data.map((item: FormDataType) => (
            <FormItem
              key={item.id}
              item={item}
              setShowDetails={setShowDetails}
            />
          ))
        ) : (
          <tr>
            <td>
              <p className={classes.notFound}>{loading ? 'Loading' : 'No Form Found'}</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default FormTable;
