import React, {useCallback, useEffect, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {HiOutlineX} from 'react-icons/hi';
import Map, {Marker} from 'react-map-gl';

import {formatDate} from '@utils/formatDate';

import {FormDataType} from '@components/FormTable';

import 'mapbox-gl/dist/mapbox-gl.css';
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
  model: { instance: FormModelInstanceType[] };
};

interface QuestionObject {
    [x: string]: string;
}

interface Props {
  formModel: FormModelType;
  formQuestion: QuestionObject;
  data: FormDataType;
  setShowDetails(value: boolean): void;
  onEditClick(): void;
}

interface FormValueRendererProps {
  name: string;
  value: string | number | object;
  formModel: FormModelType;
  formQuestion: QuestionObject;
  level: number;
}

const Title = ({text}: { text: string }) => (
  <div className={classes.titleWrapper}>
    <h3 className={classes.titleText}>{text}</h3>
  </div>
);

const FormValueRenderer = ({
  name,
  value,
  formModel,
  formQuestion,
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
          answerObj = ins?.root?.item?.find(
            (itm) => itm.name === value,
          );
          if (answerObj) {
            return true;
          }
          return false;
        });
        if (name?.toLowerCase() === 'why_area_important') {
          return value?.replace(/ /g, ', ').replace(/_/g, ' ');
        }

        return answerObj?.label || value.replace(/_/g, ' ');
      }
      return value;
    }
    return value;
  }, [value, formModel, name]);

  const formattedName = useMemo(() => {
    if (Object.prototype.hasOwnProperty.call(formQuestion, name)) {
      return formQuestion[name];
    }
    return name?.replace(/_/g, ' ');
  }, [formQuestion, name]);

  if (value && typeof value === 'object') {
    return (
      <div className='mb-6'>
        {level === 0 ? (
          <Title text={formattedName} />
        ) : (
          <p className={classes.formItemTopic}>{formattedName}</p>
        )}
        {Object.entries(value).map(([key, val]) => {
          if (key === 'location_gps') {
            const mapTitle = key?.replace(/_/g, ' ');
            const mapValue = val ? val.split(' ') : null;
            return (
              <div className={classes.formItem}>
                <span className={classes.formKey}>
                  {mapTitle}
                  :
                </span>
                {mapValue ? (
                  <Map
                    initialViewState={{
                      longitude: mapValue[1],
                      latitude: mapValue[0],
                      zoom: 9,
                    }}
                    style={{width: 600, height: 400}}
                    mapStyle='mapbox://styles/mapbox/streets-v9'
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                  >
                    <Marker
                      longitude={mapValue[1]}
                      latitude={mapValue[0]}
                      anchor='bottom'
                    />
                  </Map>
                ) : (
                  <span className={classes.formValue}>-</span>
                )}
              </div>
            );
          }
          return (
            <FormValueRenderer
              key={`${name}-${key}`}
              name={key}
              value={val}
              level={level + 1}
              formModel={formModel}
              formQuestion={formQuestion}
            />
          );
        })}
      </div>
    );
  }

  if (name?.toLowerCase()?.startsWith('note_')) {
    return null;
  }

  return (
    <div
      className={cs(classes.formItem, {
        [classes.formNested]: level > 1,
      })}
    >
      <span className={classes.formKey}>
        {formattedName}
        :
      </span>
      <span className={classes.formValue}>{formattedValue || '-'}</span>
    </div>
  );
};

const FormEntry: React.FC<Props> = ({
  data, setShowDetails, formModel, formQuestion, onEditClick,
}) => {
  const navigate = useNavigate();
  const answers: Entries<AnswerItemType> = useMemo(() => {
    const dataObject: object = JSON.parse(data.answer)?.data ?? {};
    return Object.entries(dataObject).filter(([key]) => key.startsWith('section'));
  }, [data]);

  const escapeListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDetails(false);
        navigate('/custom-forms');
      }
    },
    [navigate, setShowDetails],
  );

  useEffect(() => {
    document.addEventListener('keydown', escapeListener);

    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, [escapeListener]);

  const hideDetails = useCallback(() => {
    navigate('/custom-forms');
    setShowDetails(false);
  }, [navigate, setShowDetails]);

  return (
    <div>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsModal}>
          <div className={classes.iconWrapper} onClick={hideDetails}>
            <HiOutlineX size={14} />
          </div>
          <div className={classes.header}>
            <h2 className={classes.headerTitle}>{data?.title}</h2>
            <span onClick={onEditClick} className='material-symbols-rounded text-[32px] text-[#70747e] cursor-pointer'>edit</span>
          </div>
          <p className={classes.date}>{formatDate(data.createdAt)}</p>
          {answers?.map(([key, value]) => (
            <FormValueRenderer
              key={key}
              name={key}
              value={value}
              level={0}
              formModel={formModel}
              formQuestion={formQuestion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormEntry;
