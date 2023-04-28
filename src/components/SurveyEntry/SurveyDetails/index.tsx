import React, {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import {useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/client';
import {HiOutlineX} from 'react-icons/hi';
import {format, differenceInDays, formatDistanceToNowStrict} from 'date-fns';
import Map, {
  Marker,
  Source,
  Layer,
  type MapRef,
} from 'react-map-gl';
import bbox from '@turf/bbox';
import {parse} from 'json2csv';
import {toCanvas} from 'html-to-image';
import jsPDF from 'jspdf';

import AudioPlayer from '@components/AudioPlayer';
import Button from '@components/Button';
import Loader from '@components/Loader';
import Gallery from '@components/Gallery';
import SurveyExportDropdown, {type SurveyExportDropdownProps} from '@components/SurveyExportDropdown';
import {Improvement} from '@components/SurveyEntry';
import {polygon, polygonTitle} from '@components/SurveyEntry/layers';

import cs from '@ra/cs';
import {UPDATE_NUM_DAYS} from '@utils/config';
import {formatDate} from '@utils/formatDate';
import {formatName} from '@utils/formatName';
import sentimentName from '@utils/sentimentName';

import {rootState} from '@store/rootReducer';

import marker from '@images/marker.png';
import tree from '@images/category-tree.png';

import useCategoryIcon from '@hooks/useCategoryIcon';
import useLocationName from '@hooks/useLocationName';
import useToast from '@hooks/useToast';

import {
  GET_HAPPENING_SURVEY_HISTORY,
  GET_HAPPENING_SURVEY_HISTORY_ITEM,
  GET_HAPPENING_SURVEY_COMMENTS,
} from '@services/queries';

import type {SurveyDataType} from '@components/SurveyTable';

import HistoryTabs from '../HistoryTabs';
import Comments from '../Comments';

import 'mapbox-gl/dist/mapbox-gl.css';
import classes from './styles';

type SurveyHistoryType = {
  id: number | string,
  serializedData?: {
    fields?: SurveyDataType
  }
};

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

type SurveyDetailsProps = {
  className?: string;
  data: SurveyDataType;
  isEditable: boolean;
  onClose?: () => void;
  onEdit?: () => void;
  onUpdate?: () => void;
  onAcceptSurvey?: () => void;
  onDeclineSurvey?: () => void;
} & Partial<SurveyExportDropdownProps>;

const SurveyDetails: React.FC<SurveyDetailsProps> = (props) => {
  const {
    className,
    data,
    isEditable,
    onClose,
    onEdit,
    onUpdate,
    onAcceptSurvey,
    onDeclineSurvey,
  } = props;

  const currentDate = new Date().toISOString();

  const mapRef = useRef<MapRef>(null);
  const entryRef = useRef<any>();

  const {
    auth: {
      user: {isStaff},
    },
  } = useSelector((state: rootState) => state);

  const [activeVersionId, setActiveVersionId] = useState<string | number>('latest');

  const [getHappeningSurveyData, {
    data: surveyHistoryData,
    loading: loadingHistory,
  }] = useLazyQuery(GET_HAPPENING_SURVEY_HISTORY);
  useEffect(() => {
    if (data?.id) {
      getHappeningSurveyData({
        variables: {
          surveyId: data.id,
        },
      });
    }
  }, [data, getHappeningSurveyData]);

  const [getHappeningSurveyComments, {
    data: surveyCommentsData,
  }] = useLazyQuery(GET_HAPPENING_SURVEY_COMMENTS);
  const fetchHappeningSurveyComments = useCallback((surveyId) => {
    getHappeningSurveyComments({
      variables: {
        surveyId,
        level: 0,
      },
    });
  }, [getHappeningSurveyComments]);
  useEffect(() => {
    if (data?.id) {
      fetchHappeningSurveyComments(data.id);
    }
  }, [data, fetchHappeningSurveyComments]);

  const [showUpdate, differenceFromPreviousUpdate, lastUpdated] = useMemo(() => {
    if (data?.modifiedAt) {
      const modifiedDate = new Date(data.modifiedAt);
      const dateDifference = differenceInDays(
        modifiedDate,
        new Date(),
      );
      const formattedDate = format(modifiedDate, 'MMM d, yyyy');
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

  const versionsData = useMemo(() => {
    if (surveyHistoryData?.happeningSurveysHistory) {
      const historyData = surveyHistoryData.happeningSurveysHistory.filter(
        (hss: SurveyHistoryType) => hss?.serializedData?.fields?.modifiedAt,
      );
      if (historyData.length > 1) {
        return historyData.map((hd: SurveyHistoryType, idx: number) => {
          if (idx === 0) {
            return {id: 'latest', title: 'Latest'};
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
    if (activeVersionId !== 'latest') {
      return {
        ...(historyItemData?.happeningSurveysHistory?.[0]?.serializedData?.fields || {}),
        id: data?.id,
      };
    }
    return data;
  }, [activeVersionId, historyItemData, data]);

  const [categoryIcon] = useCategoryIcon(surveyData?.category?.id);
  const locationName = useLocationName(surveyData);

  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  const handleShowGallery = useCallback((media: any) => {
    setShowGallery(!showGallery);
    setGalleryIndex(surveyData?.attachment.findIndex((item: any) => item.media === media));
  }, [showGallery, setShowGallery, setGalleryIndex, surveyData?.attachment]);

  const escapeListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showGallery) {
          setShowGallery(false);
        }
      }
    },
    [showGallery],
  );

  useEffect(() => {
    document.addEventListener('keydown', escapeListener);
    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, [escapeListener]);

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
    if (!mapRef.current || !surveyData?.boundary?.coordinates) return;
    const [minLng, minLat, maxLng, maxLat] = bbox(surveyPolyGeoJSON);
    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {padding: 20, duration: 1000},
    );
  }, [surveyData?.boundary?.coordinates, surveyPolyGeoJSON]);

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
      ID: data?.id,
      Title: data?.title,
      Description: data?.description,
      Category: data?.category?.title,
      Location: data?.location?.coordinates,
      Boundary: data?.boundary?.coordinates,
      Region: data?.region?.id,
      Condition: data?.improvement,
      Sentiment: sentimentName[data?.sentiment],
      'Created By': data?.createdBy?.id,
      'Created At': formatDate(data?.createdAt),
      Status: data?.status,
      Audio: data?.audioFile,
    };
    const csv = parse(csvData);
    const url = window.URL.createObjectURL(new Blob([csv]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data?.title}-${currentDate}.csv`;
    a.click();
  }, [data, currentDate]);

  const toast = useToast();
  const handleCopyLink = useCallback(async () => {
    const link = `${window.location.origin}/public/survey/${data?.id}/`;
    try {
      await navigator.clipboard.writeText(link);
      toast('success', 'Public link to the survey has been successfully copied to clipboard!');
    } catch (err) {
      toast('error', 'Something went wrong while getting the link!');
    }
  }, [toast, data]);

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
                      longitude={surveyData?.location.coordinates?.[0]}
                      latitude={surveyData?.location.coordinates?.[1]}
                    >
                      <img src={marker} alt='marker' />
                    </Marker>
                  )}
    </Map>
  ), [surveyData?.location?.coordinates, onMapLoad, surveyPolyGeoJSON]);

  return (
    <div className={className}>
      <div className={cs(classes.headerWrapper, {
        [classes.headerWrapperBackground]: showGallery,
      })}
      >
        <div className={classes.iconWrapper}>
          {onClose && (
            <div className={classes.closeModalIcon} onClick={onClose}>
              <HiOutlineX size={24} />
            </div>
          )}
          <div className={classes.rightContent}>
            {isEditable && (
              <div onClick={onEdit} className='cursor-pointer'>
                <span className='material-symbols-rounded text-[32px] text-[#70747e]'>edit</span>
              </div>
            )}
            <SurveyExportDropdown
              className={classes.exportDropdown}
              onExportPDF={onExportPDF as SurveyExportDropdownProps['onExportPDF']}
              onExportImage={onExportImage as SurveyExportDropdownProps['onExportImage']}
              onExportCSV={onExportCSV as SurveyExportDropdownProps['onExportCSV']}
              onCopyLink={handleCopyLink}
            />
          </div>
        </div>
        {isEditable && showUpdate && (
          <div className={classes.updateMessageContainer}>
            <p className={classes.updateMessage}>
              {`This entry is ${differenceFromPreviousUpdate} old. Let us know if there are any updates.`}
            </p>
            <Button
              text='Update'
              className={classes.updateButton}
              onClick={onUpdate}
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
      {(loadingHistory || loading) ? (
        <Loader className={classes.loader} />
      ) : surveyData?.title ? (
        <>
          <div ref={entryRef} className={classes.entryWrapper}>
            <div className={classes.header}>
              <h2 className={classes.headerTitle}>{surveyData?.title}</h2>
              <p
                className={cs(
                  classes.status,
                  [classes.pending, data?.status.toLowerCase() === 'pending'],
                  [classes.rejected, data?.status.toLowerCase() === 'rejected'],
                  [classes.approved, data?.status.toLowerCase() === 'approved'],
                )}
              >
                {data?.status}
              </p>
            </div>
            <p className={classes.date}>
              {versionsData.length > 1 && activeVersionId === 'current' ? `Last updated ${lastUpdated}` : formatDate(surveyData?.modifiedAt)}
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
              {Boolean(surveyData?.attachment?.length) && (
                <Gallery
                  images={surveyData?.attachment}
                  galleryIndex={galleryIndex}
                  showGallery={showGallery}
                  toggleGalleryVisibility={setShowGallery}
                />
              )}
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
            {!showGallery && (
              <div className={classes.mapWrapper}>
                <RenderMap />
              </div>
            )}
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
            {surveyData?.audioFile && (
              <>
                <Title text='Audio description' />
                <AudioPlayer file={surveyData?.audioFile} />
              </>
            )}
            {activeVersionId === 'latest' && (
              <>
                <Title text='Comments' />
                <Comments
                  readOnly={!isEditable}
                  surveyId={surveyData?.id as number | string}
                  commentsData={surveyCommentsData?.comments || []}
                  refetch={fetchHappeningSurveyComments}
                />
              </>
            )}
          </div>
          <div className={cs(classes.buttons, ['hidden', !isStaff || !isEditable])}>
            {data?.status.toLowerCase() !== 'approved' && (
              <Button
                text={data?.status.toLowerCase() === 'approved' ? 'Accepted' : 'Accept'}
                className={classes.acceptBtn}
                onClick={onAcceptSurvey}
              />
            )}
            {data?.status.toLowerCase() !== 'rejected' && (
              <Button
                text={data?.status.toLowerCase() === 'rejected' ? 'Declined' : 'Decline'}
                className={classes.declineBtn}
                textClassName={classes.declineBtnText}
                onClick={onDeclineSurvey}
              />
            )}
          </div>
        </>
      ) : (
        <p className={classes.emptyMessage}>Unable to get survey data!</p>
      )}
    </div>
  );
};

export default SurveyDetails;
