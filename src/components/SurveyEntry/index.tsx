import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {gql, useMutation} from '@apollo/client';
import Map, {Marker, Source, Layer} from 'react-map-gl';
import type {MapRef} from 'react-map-gl';
import bbox from '@turf/bbox';
import {
  HiOutlineX, HiTrendingDown, HiTrendingUp, HiMenuAlt4,
} from 'react-icons/hi';
import {parse} from 'json2csv';
import {toCanvas} from 'html-to-image';
import jsPDF from 'jspdf';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';
import useCategoryIcon from '@hooks/useCategoryIcon';
import {rootState} from '@store/rootReducer';

import Button from '@components/Button';
import {SurveyDataType} from '@components/SurveyTable';
import {GET_SURVEY_DATA} from '@containers/Surveys';
import Dropdown from '@components/Dropdown';

import tree from '@images/category-tree.png';
import marker from '@images/marker.png';

import pdfIcon from '@images/icons/pdf.svg';
import csvIcon from '@images/icons/csv.svg';
import pngIcon from '@images/icons/image.svg';

import {polygon, polygonTitle} from './layers';

import 'mapbox-gl/dist/mapbox-gl.css';
import classes from './styles';

interface Props {
  data: SurveyDataType;
  setShowDetails(value: boolean): void;
}

const Title = ({text}: {text: string}) => (
  <div className={classes.titleWrapper}>
    <h3 className={classes.titleText}>{text}</h3>
  </div>
);

const Feel = ({sentiment}: {sentiment: string}) => (
  <div className={classes.feelWrapper}>
    <p className={classes.feel}>{sentiment}</p>
  </div>
);

export const Improvement = ({improvement}: {improvement: string | null}) => {
  const status = improvement?.toLowerCase();

  const renderImprovementIcon = useCallback(
    () => {
      switch (status) {
      case 'increasing':
        return <HiTrendingUp size={25} color='#EC6D25' />;
      case 'decreasing':
        return <HiTrendingDown size={25} color='#EC6D25' />;
      case 'same':
        return <HiMenuAlt4 size={25} color='#EC6D25' />;
      default:
        return <p className='ml-2'>-</p>;
      }
    },
    [status],
  );

  return (
    <>
      {renderImprovementIcon()}
    </>
  );
};

const UPDATE_SURVEY_STATUS = gql`
  mutation UpdateHappeningSurvey(
    $data: UpdateHappeningSurveyInput!
    $id: UUID!
  ) {
    updateHappeningSurvey(data: $data, id: $id) {
      ok
      result {
        status
      }
      errors
    }
  }
`;

const ExportOption = ({onClick, icon, title} : {onClick(): void, icon: string, title: string}) => (
  <div className={classes.exportOption} onClick={onClick}>
    <img src={icon} alt={title} />
    <p className={classes.exportOptionTitle}>{title}</p>
  </div>
);

const SurveyEntry: React.FC<Props> = ({data, setShowDetails}) => {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const entryRef = useRef<any>();
  const currentDate = new Date().toISOString();
  const [updateHappeningSurvey] = useMutation(UPDATE_SURVEY_STATUS, {
    refetchQueries: [GET_SURVEY_DATA, 'happeningSurveys'],
  });
  const [categoryIcon] = useCategoryIcon(data?.category?.id);
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('');
  const {
    auth: {
      user: {isStaff},
    },
  } = useSelector((state: rootState) => state);

  const getLocationName = useCallback(async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${data?.location?.coordinates[0] || 0
      },${data?.location?.coordinates[1] || 0}.json?types=place&access_token=${process.env.REACT_APP_MAPBOX_TOKEN
      }`,
    );
    const resData: {
      features: [{place_name?: string}];
    } = await response.json();
    if (resData.features[0]?.place_name) {
      setLocationName(resData.features[0].place_name);
    }
  }, [data?.location?.coordinates]);

  useEffect(() => {
    getLocationName();
  }, [getLocationName]);

  const escapeListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showDeclineModal) {
          setShowDeclineModal(false);
        } else {
          setShowDetails(false);
          navigate('/surveys');
        }
      }
    },
    [navigate, setShowDetails, showDeclineModal],
  );

  useEffect(() => {
    document.addEventListener('keydown', escapeListener);

    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, [escapeListener]);

  const handleShowDeclineModal = useCallback(() => {
    setShowDeclineModal(true);
  }, []);

  const handleHideDeclineModal = useCallback(() => {
    setShowDeclineModal(false);
  }, []);

  const hideDetails = useCallback(() => {
    navigate('/surveys');
    setShowDetails(false);
  }, [navigate, setShowDetails]);

  const handleAccept = useCallback(async () => {
    await updateHappeningSurvey({
      variables: {data: {status: 'APPROVED'}, id: data.id},
    });
    setShowDetails(false);
  }, [data.id, setShowDetails, updateHappeningSurvey]);

  const handleDecline = useCallback(async () => {
    await updateHappeningSurvey({
      variables: {data: {status: 'REJECTED'}, id: data.id},
    });
    setShowDeclineModal(false);
    setShowDetails(false);
  }, [data.id, setShowDetails, updateHappeningSurvey]);

  const surveyPolyGeoJSON: any = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          surveyItem: data,
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: data?.boundary?.coordinates || [],
        },
      },
    ],
  }), [data]);

  const onMapLoad = useCallback(() => {
    if (!mapRef.current || !data.boundary?.coordinates) return;
    const [minLng, minLat, maxLng, maxLat] = bbox(surveyPolyGeoJSON);
    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {padding: 20, duration: 1000},
    );
  }, [data.boundary?.coordinates, surveyPolyGeoJSON]);

  const renderLabel = useCallback(
    () => (
      <div className={classes.exportButton}>
        <span className='material-symbols-rounded'>ios_share</span>
        <p className={classes.exportButtonTitle}>Export </p>
      </div>
    ),
    [],
  );

  const onExportPDF = useCallback(async () => {
    const element = entryRef.current;
    await toCanvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('img/png', {height: element.scrollHeight, width: element.scrollWidth});
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${data?.title}-${currentDate}.pdf`);
    });
  }, [data, currentDate]);

  const onExportImage = useCallback(async () => {
    const element = entryRef.current;
    await toCanvas(element).then((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('img/png', {height: element.scrollHeight, width: element.scrollWidth});
      a.download = `${data?.title}-${currentDate}.png`;
      a.click();
    });
  }, [data, currentDate]);

  const onExportCSV = useCallback(() => {
    const csvData = {
      ID: data.id,
      Title: data?.title,
      Description: data?.description,
      Category: data?.category?.title,
      Location: data?.location?.coordinates,
      Boundary: data?.boundary?.coordinates,
      Region: data?.region?.id,
      Improvement: data?.improvement,
      Sentiment: data?.sentiment,
      'Created By': data?.createdBy?.id,
      'Created At': formatDate(data?.createdAt),
      Status: data?.status,
    };
    const csv = parse(csvData);
    const url = window.URL.createObjectURL(new Blob([csv]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data?.title}-${currentDate}.csv`;
    a.click();
  }, [data, currentDate]);

  return (
    <div>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsModal}>
          <div className={classes.headerWrapper}>
            <div className={classes.iconWrapper}>
              <div className={classes.closeModalIcon} onClick={hideDetails}>
                <HiOutlineX size={14} />
              </div>
              <div className={classes.exportDropdown}>
                <Dropdown renderLabel={renderLabel}>
                  <div className={classes.exportOptions}>
                    <ExportOption icon={pdfIcon} title='PDF' onClick={onExportPDF} />
                    <ExportOption icon={pngIcon} title='Image (PNG)' onClick={onExportImage} />
                    <ExportOption icon={csvIcon} title='Data (CSV)' onClick={onExportCSV} />
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
          <div ref={entryRef} className={classes.entryWrapper}>
            <div className={classes.header}>
              <h2 className={classes.headerTitle}>{data?.title}</h2>
              <p
                className={cs(
                  classes.status,
                  [classes.pending, data.status.toLowerCase() === 'pending'],
                  [classes.rejected, data.status.toLowerCase() === 'rejected'],
                  [classes.approved, data.status.toLowerCase() === 'approved'],
                )}
              >
                {data.status}
              </p>
            </div>
            <p className={classes.date}>{formatDate(data.createdAt)}</p>
            <Title text='category' />
            <div className={classes.categoryWrapper}>
              <img
                src={categoryIcon || tree}
                alt='category'
                className={classes.categoryImg}
              />
              <p className={classes.categoryTitle}>{data.category.title}</p>
            </div>
            <Title text='photos' />
            <div className={classes.photosWrapper}>
              {data.attachment.length
                ? data.attachment.map((item: {media: string}) => (
                  <img
                    key={item.media}
                    src={item.media}
                    alt=''
                    className={classes.photo}
                  />
                ))
                : 'No Photos Found'}
            </div>
            <Title text='feels' />
            <div>
              <Feel sentiment={data.sentiment || '-'} />
            </div>
            <Title text='Improvement' />
            <div className={classes.wrapper}>
              <Improvement improvement={data.improvement} />
            </div>
            <Title text='Description' />
            <div>
              <p className={classes.info}>
                {data.description || 'No Description Found'}
              </p>
            </div>
            <Title text='Location' />
            <div>
              <p className={classes.info}>{locationName || ''}</p>
            </div>
            <div className={classes.mapWrapper}>
              <Map
                ref={mapRef}
                initialViewState={{
                  longitude: data?.location?.coordinates[0] || 150,
                  latitude: data?.location?.coordinates[1] || -5,
                  zoom: 5,
                }}
                mapStyle='mapbox://styles/mapbox/outdoors-v11'
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onLoad={onMapLoad}
                preserveDrawingBuffer
              >
                <Source
                  id='surveyPolySource'
                  type='geojson'
                  data={surveyPolyGeoJSON}
                >
                  <Layer {...polygon} />
                  <Layer {...polygonTitle} />
                </Source>
                {data?.location?.coordinates
                  && (
                    <Marker
                      longitude={data?.location?.coordinates[0]}
                      latitude={data?.location?.coordinates[1]}
                    >
                      <img src={marker} alt='marker' />
                    </Marker>
                  )}
              </Map>
            </div>
          </div>
          <div className={cs(classes.buttons, ['hidden', !isStaff])}>
            <Button
              text='Accept'
              className={classes.acceptBtn}
              onClick={handleAccept}
            />
            <Button
              text='Decline'
              className={classes.declineBtn}
              textClassName={classes.declineBtnText}
              onClick={handleShowDeclineModal}
            />
          </div>
        </div>
      </div>
      <div
        className={cs(classes.declineModalOverlay, [
          'hidden',
          !showDeclineModal,
        ])}
      >
        <div className={classes.declineModal}>
          <div className={classes.declineHeader}>
            <p className={classes.declineHeaderText}>
              Are you sure you want to decline the entry?
            </p>
            <div className={classes.closeIcon} onClick={handleHideDeclineModal}>
              <HiOutlineX size={14} />
            </div>
          </div>
          <div className={classes.declineContent}>
            <p className={classes.declineText}>
              Reasons why it is declined (optional)
            </p>
            <textarea className={classes.textarea} />
            <div className={classes.declineButtons}>
              <Button
                text='Cancel'
                onClick={handleHideDeclineModal}
                className={classes.cancelBtn}
                textClassName={classes.cancelBtnText}
              />
              <Button
                text='Yes, decline'
                onClick={handleDecline}
                className={classes.yesDeclineBtn}
                textClassName={classes.yesDeclineBtnText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyEntry;
