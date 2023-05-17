import React, {useCallback, useEffect, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {HiOutlineX} from 'react-icons/hi';
import Map, {Marker} from 'react-map-gl';

import {formatDate} from '@utils/formatDate';

import {FormDataType} from '@components/FormTable';
import SurveyExportDropdown from '@components/SurveyExportDropdown';

import useToast from '@hooks/useToast';

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
          if (Array.isArray(ins?.root?.item)) {
            answerObj = ins?.root?.item?.find(
              (itm) => itm.name === value,
            );
            if (answerObj) {
              return true;
            }
          }
          if (ins?.root?.item) {
            answerObj = ins.root
              .item as unknown as InstanceItemType;
            return true;
          }
          return false;
        });
        if (name?.toLowerCase() === 'why_area_important') {
          return value?.replace(/ /g, ', ').replace(/_/g, ' ');
        }
        if (
          (name === 'image' || name === 'management_img')
                    && value?.startsWith('http')
        ) {
          return (
            <img alt='photos' className='w-[200px]' src={value} />
          );
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
                    mapboxAccessToken={
                      process.env.REACT_APP_MAPBOX_TOKEN
                    }
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

type FormDetailsProps = {
    formModel: FormModelType;
    formQuestion: QuestionObject;
    data: FormDataType;
    allowEdit: boolean;
    className?: string;
    onClose?: () => void;
    onEdit?: () => void;
};

export const FormDetails: React.FC<FormDetailsProps> = (props) => {
  const {
    data,
    allowEdit,
    className,
    onClose,
    onEdit,
    formModel,
    formQuestion,
  } = props;

  const answers: Entries<AnswerItemType> = useMemo(() => {
    const dataObject: object = JSON.parse(data.answer)?.data ?? {};
    return Object.entries(dataObject).filter(([key]) => key.startsWith('section'));
  }, [data]);

  const toast = useToast();
  const handleCopyLink = useCallback(async () => {
    const link = `${window.location.origin}/public/mett-survey/${data?.id}/`;
    try {
      await navigator.clipboard.writeText(link);
      toast(
        'success',
        'Public link to the METT survey has been successfully copied to clipboard!',
      );
    } catch (err) {
      toast('error', 'Something went wrong while getting the link!');
    }
  }, [toast, data]);

  return (
    <div className={className}>
      {onClose && (
        <div className={classes.iconWrapper} onClick={onClose}>
          <HiOutlineX size={14} />
        </div>
      )}
      <div className={classes.header}>
        <h2 className={classes.headerTitle}>{data?.title}</h2>
        <div className={classes.rightContent}>
          {allowEdit && (
            <span
              onClick={onEdit}
              className='material-symbols-rounded text-[32px] text-[#70747e] cursor-pointer'
            >
              edit
            </span>
          )}
          <SurveyExportDropdown onCopyLink={handleCopyLink} />
        </div>
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
  );
};

type FormEntryProps = {
    formModel: FormModelType;
    formQuestion: QuestionObject;
    data: FormDataType;
    setShowDetails(value: boolean): void;
    onEditClick(): void;
    allowEdit: boolean;
};

const FormEntry: React.FC<FormEntryProps> = ({
  data,
  allowEdit,
  setShowDetails,
  formModel,
  formQuestion,
  onEditClick,
}) => {
  const navigate = useNavigate();

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
        <FormDetails
          className={classes.detailsModal}
          onClose={hideDetails}
          data={data}
          allowEdit={allowEdit}
          onEdit={onEditClick}
          formModel={formModel}
          formQuestion={formQuestion}
        />
      </div>
    </div>
  );
};

export default FormEntry;
