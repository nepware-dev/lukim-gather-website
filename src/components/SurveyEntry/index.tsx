import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
  gql, useMutation, useQuery, useLazyQuery,
} from '@apollo/client';
import Map, {Marker, Source, Layer} from 'react-map-gl';
import type {MapRef} from 'react-map-gl';
import bbox from '@turf/bbox';
import {
  HiOutlineX, HiTrendingDown, HiTrendingUp, HiMenuAlt4,
} from 'react-icons/hi';
import {parse} from 'json2csv';
import {toCanvas} from 'html-to-image';
import jsPDF from 'jspdf';
import {format, differenceInDays, formatDistanceToNowStrict} from 'date-fns';

import cs from '@utils/cs';
import _cs from '@ra/cs';
import {formatDate} from '@utils/formatDate';
import {formatName} from '@utils/formatName';
import useCategoryIcon from '@hooks/useCategoryIcon';
import {rootState} from '@store/rootReducer';

import Button from '@components/Button';
import Loader from '@components/Loader';
import {SurveyDataType} from '@components/SurveyTable';
import {GET_SURVEY_DATA} from '@containers/Surveys';
import Dropdown from '@components/Dropdown';
import Gallery from '@components/Gallery';

import {
  GET_HAPPENING_SURVEY_HISTORY,
  GET_HAPPENING_SURVEY_HISTORY_ITEM,
} from '@services/queries';
import {UPDATE_NUM_DAYS} from '@utils/config';

import csvIcon from '@images/icons/csv.svg';
import marker from '@images/marker.png';
import pdfIcon from '@images/icons/pdf.svg';
import pngIcon from '@images/icons/image.svg';
import tree from '@images/category-tree.png';

import HistoryTabs from './HistoryTabs';
import {polygon, polygonTitle} from './layers';

import 'mapbox-gl/dist/mapbox-gl.css';
import classes from './styles';

type SurveyHistoryType = {
  id: number | string,
  serializedData?: {
    fields?: SurveyDataType
  }
};

interface Props {
  data: SurveyDataType;
  setShowDetails(value: boolean): void;
  onEditClick: (updateMode?: boolean) => void;
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

export const Improvement = ({
  improvement,
  iconColor = '#EC6D25',
}: {improvement: string | null; iconColor?: string}) => {
  const status = improvement?.toLowerCase();

  const renderImprovementIcon = useCallback(
    () => {
      switch (status) {
      case 'increasing':
        return <HiTrendingUp size={25} color={iconColor} />;
      case 'decreasing':
        return <HiTrendingDown size={25} color={iconColor} />;
      case 'same':
        return <HiMenuAlt4 size={25} color={iconColor} />;
      default:
        return <p className='ml-2'>-</p>;
      }
    },
    [iconColor, status],
  );

  return (
    <>
      {renderImprovementIcon()}
    </>
  );
};

const UPDATE_SURVEY_STATUS = gql`
  mutation EditHappeningSurvey(
    $data: UpdateHappeningSurveyInput!
    $id: UUID!
  ) {
    editHappeningSurvey(data: $data, id: $id) {
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

const SurveyEntry: React.FC<Props> = ({data, setShowDetails, onEditClick}) => {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const entryRef = useRef<any>();
  const currentDate = new Date().toISOString();
  const [updateHappeningSurvey] = useMutation(UPDATE_SURVEY_STATUS, {
    refetchQueries: [GET_SURVEY_DATA, 'happeningSurveys'],
  });
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('');
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const {
    auth: {
      user: {isStaff},
    },
  } = useSelector((state: rootState) => state);

  const [activeVersionId, setActiveVersionId] = useState<string | number>('current');

  const {data: surveyHistoryData, refetch} = useQuery(GET_HAPPENING_SURVEY_HISTORY, {
    variables: {surveyId: data.id},
  });
  useEffect(() => {
    refetch();
  }, [refetch]);

  const versionsData = useMemo(() => {
    if (surveyHistoryData?.happeningSurveysHistory) {
      const historyData = surveyHistoryData.happeningSurveysHistory.filter(
        (hss: SurveyHistoryType) => hss?.serializedData?.fields?.modifiedAt,
      );
      if (historyData.length > 1) {
        return historyData.map((hd: SurveyHistoryType, idx: number) => {
          if (idx === 0) {
            return {id: 'current', title: 'Current'};
          }
          const dateObj = new Date(hd?.serializedData?.fields?.modifiedAt as string);
          return {
            id: hd.id,
            title: format(dateObj, 'MMM d'),
          };
        });
      }
    }
    return [];
  }, [surveyHistoryData]);

  const [getHappeningSurveyHistoryItem, {
    data: historyItemData,
    loading,
  }] = useLazyQuery(GET_HAPPENING_SURVEY_HISTORY_ITEM);

  const handleChangeVersion = useCallback((tabItem: {id: number | string}) => {
    if (tabItem.id !== 'current') {
      getHappeningSurveyHistoryItem({
        variables: {
          surveyId: data?.id,
          id: Number(tabItem.id),
        },
      });
    }
    setActiveVersionId(tabItem.id);
  }, [getHappeningSurveyHistoryItem, data]);

  const surveyData: SurveyDataType = useMemo(() => {
    if (activeVersionId !== 'current') {
      return {
        ...(historyItemData?.happeningSurveysHistory?.[0]?.serializedData?.fields || {}),
        id: data?.id,
      };
    }
    return data;
  }, [activeVersionId, historyItemData, data]);

  const [categoryIcon] = useCategoryIcon(surveyData?.category?.id);

  const [showUpdate, differenceFromPreviousUpdate, lastUpdated] = useMemo(() => {
    if (data?.modifiedAt) {
      const modifiedDate = new Date(data.modifiedAt);
      const dateDifference = differenceInDays(
        modifiedDate,
        new Date(),
      );
      const formattedDate = format(modifiedDate, 'MMM dd, yyyy');
      if (dateDifference < -UPDATE_NUM_DAYS) {
        return [
          true,
          formatDistanceToNowStrict(modifiedDate, {
            roundingMethod: 'floor',
          }),
          formattedDate,
        ];
      }
      return [false, null, formattedDate];
    }
    return [false, null, 'N/A'];
  }, [data]);

  const getLocationName = useCallback(async (survey: SurveyDataType) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${survey?.location?.coordinates[0] || 0
      },${survey?.location?.coordinates[1] || 0}.json?types=place&access_token=${process.env.REACT_APP_MAPBOX_TOKEN
      }`,
    );
    const resData: {
      features: [{place_name?: string}];
    } = await response.json();
    if (resData.features[0]?.place_name) {
      setLocationName(resData.features[0].place_name);
    } else {
      setLocationName('');
    }
  }, []);

  useEffect(() => {
    getLocationName(surveyData);
  }, [getLocationName, surveyData]);

  const escapeListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showGallery) {
          setShowGallery(false);
          return;
        }
        if (showDeclineModal) {
          setShowDeclineModal(false);
        } else {
          setShowDetails(false);
          navigate('/surveys');
        }
      }
    },
    [navigate, setShowDetails, showDeclineModal, showGallery],
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

  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  const handleShowGallery = useCallback((media: any) => {
    setShowGallery(!showGallery);
    setGalleryIndex(surveyData?.attachment.findIndex((item: any) => item.media === media));
  }, [showGallery, setShowGallery, setGalleryIndex, surveyData?.attachment]);

  const surveyPolyGeoJSON: any = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          surveyItem: surveyData,
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: surveyData?.boundary?.coordinates || [],
        },
      },
    ],
  }), [surveyData]);

  const onMapLoad = useCallback(() => {
    if (!mapRef.current || !surveyData.boundary?.coordinates) return;
    const [minLng, minLat, maxLng, maxLat] = bbox(surveyPolyGeoJSON);
    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {padding: 20, duration: 1000},
    );
  }, [surveyData.boundary?.coordinates, surveyPolyGeoJSON]);

  const renderLabel = useCallback(
    () => (
      <div className={classes.exportButton}>
        <span className='material-symbols-rounded text-[32px] text-[#70747e]'>ios_share</span>
      </div>
    ),
    [],
  );

  const handleEditButtonClick = useCallback(() => onEditClick?.(), [onEditClick]);
  const handleUpdateButtonClick = useCallback(() => onEditClick?.(true), [onEditClick]);

  const onExportPDF = useCallback(async () => {
    const element = entryRef.current;
    await toCanvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('img/png', {height: element.scrollHeight, width: element.scrollWidth});
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.setFillColor(204, 204, 204, 0);
      pdf.rect(0, 0, width, height, 'F');
      const iWidth = (element.scrollWidth * height) / element.scrollHeight;
      pdf.addImage(imgData, 'PNG', (width - iWidth) / 2, 0, iWidth, height);
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
      Condition: data?.improvement,
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

  const RenderMap = useCallback(() => (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: surveyData?.location?.coordinates[0] || 150,
        latitude: surveyData?.location?.coordinates[1] || -5,
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
      {surveyData?.location?.coordinates
                  && (
                    <Marker
                      longitude={surveyData.location.coordinates?.[0]}
                      latitude={surveyData.location.coordinates?.[1]}
                    >
                      <img src={marker} alt='marker' />
                    </Marker>
                  )}
    </Map>
  ), [surveyData.location?.coordinates, onMapLoad, surveyPolyGeoJSON]);

  return (
    <div>
      <div className={classes.detailsContainer}>
        <div className={classes.detailsModal}>
          <div className={_cs(classes.headerWrapper, {
            [classes.headerWrapperBackground]: showGallery,
          })}
          >
            <div className={classes.iconWrapper}>
              <div className={classes.closeModalIcon} onClick={hideDetails}>
                <HiOutlineX size={24} />
              </div>
              <div className={classes.rightContent}>
                <div onClick={handleEditButtonClick} className='cursor-pointer'>
                  <span className='material-symbols-rounded text-[32px] text-[#70747e]'>edit</span>
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
            {showUpdate && (
              <div className={classes.updateMessageContainer}>
                <p className={classes.updateMessage}>
                  This entry is
                  {' '}
                  {differenceFromPreviousUpdate}
                  {' '}
                  old. Let us know if there are any updates.
                </p>
                <Button
                  text='Update'
                  className={classes.updateButton}
                  onClick={handleUpdateButtonClick}
                />
              </div>
            )}
            {versionsData.length > 1 && (
              <HistoryTabs
                className={classes.versionTabsContainer}
                tabsData={versionsData}
                onChangeTab={handleChangeVersion}
                activeTabId={activeVersionId}
              />
            )}
          </div>
          {loading ? (
            <Loader className={classes.loader} />
          ) : surveyData?.title ? (
            <>
              <div ref={entryRef} className={classes.entryWrapper}>
                <div className={classes.header}>
                  <h2 className={classes.headerTitle}>{surveyData?.title}</h2>
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
                <p className={classes.date}>
                  {versionsData.length > 1 && activeVersionId === 'current' ? `Last updated ${lastUpdated}` : formatDate(data.modifiedAt)}
                </p>
                {surveyData.project && (
                  <>
                    <Title text='project' />
                    <p>{surveyData.project.title}</p>
                  </>
                )}
                <Title text='category' />
                <div className={classes.categoryWrapper}>
                  <img
                    src={categoryIcon || tree}
                    alt='category'
                    className={classes.categoryImg}
                  />
                  <p className={classes.categoryTitle}>{surveyData?.category?.title || ''}</p>
                </div>
                <Title text='photos' />
                <div className={classes.photosWrapper}>
                  {surveyData?.attachment?.length
                    ? surveyData.attachment.map((item: {media: string}) => (
                      <div className='cursor-pointer' onClick={() => handleShowGallery(item.media)}>
                        <img
                          key={item.media}
                          src={item.media}
                          alt=''
                          className={classes.photo}
                        />
                      </div>
                    ))
                    : <p className={classes.text}>No Photos Found</p>}
                  {surveyData?.attachment?.length ? <Gallery images={surveyData?.attachment} galleryIndex={galleryIndex} showGallery={showGallery} toggleGalleryVisibility={setShowGallery} /> : ''}
                </div>
                <Title text='feels' />
                <div>
                  <Feel sentiment={surveyData.sentiment || '-'} />
                </div>
                <Title text='Condition' />
                <div className={classes.wrapper}>
                  <Improvement improvement={surveyData.improvement} />
                </div>
                <Title text='Description' />
                <div>
                  <p className={classes.info}>
                    {surveyData.description || 'No Description Found'}
                  </p>
                </div>
                <Title text='Location' />
                <div>
                  <p className={classes.info}>{locationName || ''}</p>
                </div>
                <div className={classes.mapWrapper}>
                  <RenderMap />
                </div>
                <Title text='Published Anonymously' />
                <div className={classes.wrapper}>
                  <p>{surveyData?.createdBy ? 'No' : 'Yes'}</p>
                </div>
                <Title text='Public Information' />
                <div className={classes.wrapper}>
                  <p>{surveyData?.isPublic ? 'Yes' : 'No'}</p>
                </div>
                <Title text='Test Data' />
                <div className={classes.wrapper}>
                  <p>{surveyData?.isTest ? 'Yes' : 'No'}</p>
                </div>
                <Title text='Submitted By' />
                <div className={classes.text}>
                  <p className='capitalize'>
                    {formatName(surveyData?.createdBy)}
                  </p>
                </div>
              </div>
              <div className={cs(classes.buttons, ['hidden', !isStaff])}>
                <Button
                  text={data.status.toLowerCase() === 'approved' ? 'Accepted' : 'Accept'}
                  className={classes.acceptBtn}
                  onClick={handleAccept}
                  disabled={data.status.toLowerCase() === 'approved'}
                />
                <Button
                  text={data.status.toLowerCase() === 'rejected' ? 'Declined' : 'Decline'}
                  className={classes.declineBtn}
                  textClassName={classes.declineBtnText}
                  onClick={handleShowDeclineModal}
                  disabled={data.status.toLowerCase() === 'rejected'}
                />
              </div>
            </>
          ) : (
            <p className={classes.emptyMessage}>Unable to get survey data!</p>
          )}
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
