import React, {
  useCallback, useEffect, useState, useMemo, useRef, ReactElement,
} from 'react';
import Map, {Source, Layer, Popup} from 'react-map-gl';
import type {MapRef} from 'react-map-gl';
import {Link} from 'react-router-dom';
import {useQuery} from '@apollo/client';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import Dropdown from '@components/Dropdown';

import SelectInput from '@ra/components/Form/SelectInput'; // eslint-disable-line no-eval

import {
  GET_SURVEY_DATA as GET_HAPPENING_SURVEY_DATA,
  GET_CATEGORY_DATA,
  GET_REGION_DATA,
  GET_PROTECTED_AREA_DATA,
} from '@containers/Surveys';
import {GET_SURVEY_DATA} from '@containers/CustomForms';

import {formatISO} from 'date-fns';
import {Parser} from 'json2csv';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import {toCanvas} from 'html-to-image';
import jsPDF from 'jspdf';

import {FormDataType} from '@components/FormTable';
import {SurveyDataType} from '@components/SurveyTable';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';
import {findPropertyAnywhere} from '@utils/searchTree';

import pdfIcon from '@images/icons/pdf.svg';
import csvIcon from '@images/icons/csv.svg';
import pngIcon from '@images/icons/image.svg';

import mapboxgl from 'mapbox-gl';
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  clusterCustomFormLayer,
  clusterCustomFormCountLayer,
  unclusteredCustomFormPointLayer,
  unclusteredCustomFormPointTextLayer,
  polygonTitle,
  polygon,
} from './layers';
import surveyCategory from '../../data/surveyCategory';
import classes from './styles';

const ExportOption = ({onClick, icon, title} : {onClick(): void, icon: string, title: string}) => (
  <div className={classes.exportOption} onClick={onClick}>
    <img src={icon} alt={title} />
    <p className={classes.exportOptionTitle}>{title}</p>
  </div>
);

export type FlattenObjectType = {
  [key: string]: string
}

export type SelectInputType = {
  id: number,
  title: string
}

export const flattenObject = (obj: FlattenObjectType) => {
  const flattened: FlattenObjectType = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  });

  return flattened;
};

const titleExtractor = (item: SelectInputType) => item?.title;
const keyExtractor = (item: SelectInputType) => item?.id;

const headers = [
  {label: 'UUID', value: 'id'},
  {label: 'Category', value: 'category.title'},
  {label: 'Title', value: 'title'},
  {label: 'Description', value: 'description'},
  {label: 'Sentiment', value: 'sentiment'},
  {label: 'Condition', value: 'improvement'},
  {label: 'Location', value: 'location.coordinates'},
  {label: 'Longitude', value: 'location.coordinates[0]'},
  {label: 'Latitude', value: 'location.coordinates[1]'},
  {label: 'Boundary', value: 'boundary.coordinates'},
  {label: 'Status', value: 'status'},
  {label: 'Attachment', value: 'attachment'},
  {label: 'Created Date', value: 'createdAt'},
];

const happeningSurveyLocationParser = new Parser({
  fields: headers.filter((header) => header.label !== 'Boundary'),
  defaultValue: 'No matching data found in selection',
});

const happeningSurveyBoundaryParser = new Parser({
  fields: headers.filter((header) => !(header.label === 'Location' || header.label === 'Longitude' || header.label === 'Latitude')),
  defaultValue: 'No matching data found in selection',
});

const customSurveyParser = new Parser();

const Dashboard = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef | null>(null);
  const [popup, setPopUp] = useState<ReactElement | null>(null);
  const [filteredData, setFilteredData] = useState([]);
  const [popupLngLat, setPopUpLngLat] = useState<mapboxgl.LngLat | null>(null);
  const [selectInputCategory, setSelectInputCategory] = useState<SelectInputType | null>(null);
  const [selectInputRegion, setSelectInputRegion] = useState<SelectInputType | null>(null);
  const [
    selectInputProtectedArea,
    setSelectInputProtectedArea,
  ] = useState<SelectInputType | null>(null);
  const {data} = useQuery(GET_HAPPENING_SURVEY_DATA);
  const {data: customSurveyData} = useQuery(GET_SURVEY_DATA);
  const {data: category} = useQuery(GET_CATEGORY_DATA);
  const {data: regions} = useQuery(GET_REGION_DATA);
  const {data: protectedAreas} = useQuery(GET_PROTECTED_AREA_DATA);

  const currentDate = formatISO(new Date(), {format: 'basic'}).replace(/\+|:/g, '');

  useEffect(() => {
    if (!data) return;
    // eslint-disable-next-line no-underscore-dangle
    const _filteredData = data.happeningSurveys?.filter(
      (item: {
              createdAt: string,
              category: SelectInputType,
              region: SelectInputType,
              protectedArea: SelectInputType
            }) => {
        if (selectInputCategory && (item.category.id !== selectInputCategory.id)) {
          return false;
        }
        if (selectInputRegion && (item.region?.id !== selectInputRegion.id)) {
          return false;
        }
        if (selectInputProtectedArea && (item.protectedArea?.id !== selectInputProtectedArea.id)) {
          return false;
        }
        return true;
      },
    ) || [];

    setFilteredData(_filteredData);
  }, [data, selectInputCategory, selectInputRegion, selectInputProtectedArea]);

  const handleCategoryChange = useCallback(({option}) => {
    setSelectInputCategory(option);
  }, []);

  const handleRegionChange = useCallback(({option}) => {
    setSelectInputRegion(option);
  }, []);

  const handleProtectedAreaChange = useCallback(({option}) => {
    setSelectInputProtectedArea(option);
  }, []);

  const surveyGeoJSON: any = useMemo(() => {
    const shape = filteredData
      .filter((survey: SurveyDataType) => survey?.location)
      .map((survey: SurveyDataType) => ({
        type: 'Feature',
        properties: {
          surveyItem: survey,
        },
        geometry: {
          type: survey?.location?.type,
          coordinates: survey?.location?.coordinates,
        },
      })) || [];
    return {
      type: 'FeatureCollection',
      features: [...shape],
    };
  }, [filteredData]);

  const customFormGeoJSON: any = useMemo(() => {
    let shape = [];
    if (customSurveyData?.survey?.length > 0) {
      shape = customSurveyData?.survey.reduce((features: any, survey: FormDataType) => {
        const formAnswers = JSON.parse(survey.answer);
        if (selectInputCategory || selectInputProtectedArea) {
          return features;
        }
        if (selectInputRegion) {
          const provinceData: any = findPropertyAnywhere(formAnswers, 'province');
          if (provinceData?.replace(/_/g, ' ')?.toLowerCase() !== selectInputRegion.title.toLowerCase()) {
            return features;
          }
        }
        const locationGPS: string = findPropertyAnywhere(formAnswers, 'location_gps') || '';
        if (locationGPS) {
          const [lat, lng] = locationGPS.split(' ');
          features.push({
            type: 'Feature',
            properties: {
              customForm: {
                id: survey.id,
                title: survey.title,
                formAnswers,
              },
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          });
          return features;
        }
        return features;
      }, []);
    }
    return {
      type: 'FeatureCollection',
      features: [...shape],
    };
  }, [customSurveyData, selectInputRegion, selectInputCategory, selectInputProtectedArea]);

  const flatCustomForms = useMemo(() => customFormGeoJSON.features.map(
    ({properties: {customForm: {formAnswers: {data: formData}}}}: any) => flattenObject(formData),
  ), [customFormGeoJSON]);

  const surveyPolyGeoJSON : any = useMemo(() => {
    const shapePoly = filteredData
      .filter((survey: SurveyDataType) => survey.boundary)
      .map((survey: SurveyDataType) => ({
        type: 'Feature',
        properties: {
          surveyItem: survey,
        },
        geometry: {
          type: survey?.boundary?.type,
          coordinates: survey?.boundary?.coordinates,
        },
      })) || [];
    return {
      type: 'FeatureCollection',
      features: [...shapePoly],
    };
  }, [filteredData]);

  const onClick = useCallback((event) => {
    const cluster = event.features.find(
      (feat: mapboxgl.EventData) => feat.layer.id === 'clusters' || feat.layer.id === 'clusters-form',
    );
    if (cluster) {
      const features: any = mapRef?.current?.queryRenderedFeatures(event.point, {
        layers: [cluster.layer.id],
      });
      const clusterId = cluster.properties.cluster_id;
      const source: mapboxgl.GeoJSONSource = mapRef?.current
        ?.getSource(cluster.source) as mapboxgl.GeoJSONSource;
      return source?.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        mapRef?.current?.easeTo({
          center: features ? features[0]?.geometry?.coordinates : [],
          zoom,
          duration: 1500,
        });
      });
    }
    let item;
    if (
      !event.features.some((feat: mapboxgl.MapboxGeoJSONFeature) => feat.layer?.id === 'unclustered-point' || feat.layer?.id === 'unclustered-form-point')
    ) {
      item = JSON.parse(
        event.features[event.features.length - 1].properties?.surveyItem
        || event.features[event.features.length - 1].properties?.customForm,
      );
    } else {
      item = JSON.parse(event.features[0].properties.surveyItem
      || event.features[0].properties?.customForm);
    }

    if (item?.formAnswers?.data?.section_1) {
      const popUpData = Object.entries(item.formAnswers.data.section_1)?.map(([key, val]) => {
        if (val === '') {
          return null;
        }
        return (
          <span key={key} className='capitalize'>
            {key.replace(/_/g, ' ')}
            :
            {' '}
            {val}
            <br />
          </span>
        );
      });
      setPopUpLngLat(event.lngLat);
      return setPopUp(
        <div>
          <h6 className='text-[14px] font-medium mb-[4]'>{item.title}</h6>
          {popUpData}
          <div className='pt-[14px]'>
            <Link className='cursor-pointer underline' to={`/custom-forms/${item.id}`}>View Details</Link>
          </div>
        </div>,
      );
    }

    setPopUpLngLat(event.lngLat);
    return setPopUp(
      <div>
        Category:
        {' '}
        {item.category.title}
        <br />
        Title:
        {' '}
        {item.title}
        <br />
        Description:
        {' '}
        {item.description}
        <br />
        Feel:
        {' '}
        {item.sentiment}
        <br />
        Created At:
        {' '}
        {formatDate(item.createdAt)}
        <br />
        <div className='pt-[14px]'>
          <Link className='cursor-pointer underline' to={`/surveys/${item.id}`}>View Details</Link>
        </div>
      </div>,
    );
  }, []);

  const onLoad = useCallback(() => {
    surveyCategory.filter((cat) => cat.childs.filter(
      (categoryIcon) => mapRef?.current?.loadImage(categoryIcon.icon, (error, res: any) => {
        mapRef?.current?.addImage(categoryIcon?.id.toString(), res);
      }),
    ));
  }, []);

  const onExportCSV = useCallback(() => {
    const surveyExportData = JSON.parse(JSON.stringify(filteredData));
    surveyExportData.map((surveyItem: SurveyDataType) => {
      if (surveyItem.attachment) {
        surveyItem.attachment = surveyItem.attachment.map( // eslint-disable-line no-param-reassign
          (_attachment: any) => _attachment.media,
        );
      }
      return surveyItem;
    });
    const happeningSurveyLocationCSV = happeningSurveyLocationParser.parse(
      surveyExportData.filter((locationData: SurveyDataType) => locationData?.location !== null),
    );
    const happeningSurveyBoundaryCSV = happeningSurveyBoundaryParser.parse(
      surveyExportData.filter((boundaryData: SurveyDataType) => boundaryData?.boundary !== null),
    );
    const zip = new JSZip();
    zip.file(`Happening_survey_report_location_${currentDate}.csv`, happeningSurveyLocationCSV);
    zip.file(`Happening_survey_report_boundary_${currentDate}.csv`, happeningSurveyBoundaryCSV);
    if (flatCustomForms?.length > 0) {
      const customFormCSV = customSurveyParser.parse(flatCustomForms);
      zip.file(`Custom_survey_report_${currentDate}.csv`, customFormCSV);
    }
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `Survey_report_${currentDate}.zip`);
    });
  }, [currentDate, filteredData, flatCustomForms]);

  const onExportPDF = useCallback(async () => {
    const element: any = contentRef.current;
    await toCanvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('img/png', {height: element.scrollHeight, width: element.scrollWidth});
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (element.scrollHeight * 210) / element.scrollWidth);
      pdf.save(`Survey_report_${currentDate}.pdf`);
    });
  }, [currentDate]);

  const onExportImage = useCallback(async () => {
    const element: any = contentRef.current;
    await toCanvas(element).then((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('img/png', {height: element.scrollHeight, width: element.scrollWidth});
      a.download = `Survey_report_${currentDate}.png`;
      a.click();
    });
  }, [currentDate]);

  const regionOptions = useMemo(
    () => regions?.regions.map(({
      name: title,
      ...item
    }: {name: string}) => ({
      title,
      ...item,
    }))
    , [regions],
  );

  const protectedAreasOptions = useMemo(
    () => protectedAreas?.protectedAreas.map(({
      name: title,
      ...item
    }: {name: string}) => ({
      title,
      ...item,
    }))
    , [protectedAreas],
  );

  const renderLabel = useCallback(
    () => (
      <div className={classes.exportButton}>
        <span className='material-symbols-rounded'>ios_share</span>
        <p className={classes.exportButtonTitle}>Export </p>
      </div>
    ),
    [],
  );

  return (
    <DashboardLayout>
      <DashboardHeader title='Dashboard' />
      <h2 className={classes.title}>Dashboard</h2>
      <div className={classes.header}>
        <div className={classes.filterWrapper}>
          <SelectInput
            className='h-[44px] min-w-[12em] w-max rounded-lg border-[#CCDCE8]'
            valueExtractor={titleExtractor}
            keyExtractor={keyExtractor}
            options={regionOptions}
            placeholder='Province'
            onChange={handleRegionChange}
          />
          <SelectInput
            className={cs('h-[44px]', 'min-w-[12em] w-max', 'rounded-lg', 'border-[#CCDCE8]')}
            valueExtractor={titleExtractor}
            keyExtractor={keyExtractor}
            options={category?.protectedAreaCategories}
            placeholder='Category'
            onChange={handleCategoryChange}
          />
          <SelectInput
            className={cs('h-[44px]', 'min-w-[12em] w-max', 'rounded-lg', 'border-[#CCDCE8]')}
            valueExtractor={titleExtractor}
            keyExtractor={keyExtractor}
            options={protectedAreasOptions}
            placeholder='Protected Areas'
            onChange={handleProtectedAreaChange}
          />
        </div>
        {filteredData && (
          <div className={classes.exportDropdown}>
            <Dropdown renderLabel={renderLabel}>
              <div className={classes.exportOptions}>
                <ExportOption icon={pdfIcon} title='PDF' onClick={onExportPDF} />
                <ExportOption icon={pngIcon} title='Image (PNG)' onClick={onExportImage} />
                <ExportOption icon={csvIcon} title='Data (CSV)' onClick={onExportCSV} />
              </div>
            </Dropdown>
          </div>
        )}
      </div>
      <div className={classes.mapWrapper} ref={contentRef}>
        <Map
          initialViewState={{
            longitude: 150,
            latitude: -5,
            zoom: 5,
          }}
          mapStyle='mapbox://styles/mapbox/outdoors-v11'
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          ref={mapRef}
          onClick={onClick}
          interactiveLayerIds={[
            clusterCustomFormLayer.id,
            unclusteredCustomFormPointLayer.id,
            clusterLayer.id,
            unclusteredPointLayer.id,
            polygon.id,
          ]}
          onLoad={onLoad}
          preserveDrawingBuffer
        >
          <Source
            id='surveyPolySource'
            type='geojson'
            data={surveyPolyGeoJSON}
          >
            <Layer {...polygonTitle} />
            <Layer {...polygon} />
          </Source>
          <Source id='customSurveys' type='geojson' data={customFormGeoJSON} cluster clusterMaxZoom={14} clusterRadius={40}>
            <Layer {...clusterCustomFormLayer} />
            <Layer {...clusterCustomFormCountLayer} />
            <Layer {...unclusteredCustomFormPointLayer} />
            <Layer {...unclusteredCustomFormPointTextLayer} />
          </Source>
          <Source
            id='happeningSurveys'
            type='geojson'
            data={surveyGeoJSON}
            cluster
            clusterMaxZoom={14}
            clusterRadius={40}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} beforeId={clusterCustomFormLayer.id} />
          </Source>
          {popup && (
            <Popup
              longitude={popupLngLat!.lng}
              latitude={popupLngLat!.lat}
              anchor='bottom'
              onClose={() => setPopUp(null)}
            >
              {popup}
            </Popup>
          )}
        </Map>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
