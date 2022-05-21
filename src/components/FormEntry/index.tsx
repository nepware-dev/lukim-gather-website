import React, {useCallback, useEffect, useMemo} from 'react';
import {HiOutlineX} from 'react-icons/hi';

import {formatDate} from '@utils/formatDate';

import {FormDataType} from '@components/FormTable';

import cs from '@ra/cs';
import classes from './styles';

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

type AnswerItemType = {
  [key: string]: string | number | object;
};

type InstanceItemType = {
  name: string;
  label: string;
  [key: string]: string;
};

type FormModelInstanceType = {
  root?: {
    item?: InstanceItemType[];
  };
};

type FormModelType = {
  model: {instance: FormModelInstanceType[]};
};

interface Props {
  formModel: FormModelType;
  data: FormDataType;
  setShowDetails(value: boolean): void;
}

interface FormValueRendererProps {
  name: string;
  value: string | number | object;
  formModel: FormModelType;
  level: number;
}

const Title = ({text}: {text: string}) => (
  <div className={classes.titleWrapper}>
    <h3 className={classes.titleText}>{text}</h3>
  </div>
);

const FormValueRenderer = ({
  name,
  value,
  formModel,
  level,
}: FormValueRendererProps) => {
  const formattedValue = useMemo(() => {
    if (typeof value === 'string') {
      if (
        formModel?.model?.instance?.length
        && name?.toLowerCase() !== 'enter_email'
      ) {
        let answerObj: InstanceItemType | undefined;
        formModel.model.instance.find((ins) => {
          answerObj = ins?.root?.item?.find((itm) => itm.name === value);
          if (answerObj) {
            return true;
          }
          return false;
        });
        return answerObj?.label || value.replace(/_/g, ' ');
      }
      return value;
    }
    return value;
  }, [value, formModel, name]);

  const formattedName = useMemo(() => name?.replace(/_/g, ' '), [name]);

  if (value && typeof value === 'object') {
    return (
      <div className='mb-6'>
        {level === 0
          ? <Title text={formattedName} />
          : <p className={classes.formItemTopic}>{formattedName}</p>}
        {Object.entries(value).map(([key, val]) => (
          <FormValueRenderer
            key={`${name}-${key}`}
            name={key}
            value={val}
            level={level + 1}
            formModel={formModel}
          />
        ))}
      </div>
    );
  }

  if (name?.toLowerCase()?.startsWith('note_')) {
    return null;
  }

  return (
    <div className={cs(classes.formItem, {[classes.formNested]: level > 1})}>
      <span className={classes.formKey}>
        {formattedName}
        :
      </span>
      <span className={classes.formValue}>{formattedValue || '-'}</span>
    </div>
  );
};

const FormEntry: React.FC<Props> = ({data, setShowDetails, formModel}) => {
  const answers: Entries<AnswerItemType> = useMemo(() => {
    const dataObject: object = JSON.parse(data.answer)?.data ?? {};
    return Object.entries(dataObject).filter(([key]) => key.startsWith('section'));
  }, [data]);

  const escapeListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDetails(false);
      }
    },
    [setShowDetails],
  );

  useEffect(() => {
    document.addEventListener('keydown', escapeListener);

    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, [escapeListener]);

  const hideDetails = useCallback(() => {
    setShowDetails(false);
  }, [setShowDetails]);

  return (
    <div>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsModal}>
          <div className={classes.iconWrapper} onClick={hideDetails}>
            <HiOutlineX size={14} />
          </div>
          <div className={classes.header}>
            <h2 className={classes.headerTitle}>{data?.title}</h2>
          </div>
          <p className={classes.date}>{formatDate(data.createdAt)}</p>
          {answers?.map(([key, value]) => (
            <FormValueRenderer
              key={key}
              name={key}
              value={value}
              level={0}
              formModel={formModel}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormEntry;
