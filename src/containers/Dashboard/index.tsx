// @ts-nocheck
// @ts-ignore
import React, {
  useCallback, useEffect, useState, useMemo, useRef,
} from 'react';
import Map, {Source, Layer, Popup} from 'react-map-gl';
import type {MapRef} from 'react-map-gl';
import {gql, useQuery} from '@apollo/client';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import Button from '@components/Button';
import SelectInput from '@ra/components/Form/SelectInput'; // eslint-disable-line no-eval

import {GET_SURVEY_DATA as GET_HAPPENING_SURVEY_DATA} from '@containers/Surveys';
import {GET_SURVEY_DATA} from '@containers/CustomForms';

import {Parser} from 'json2csv';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';
import {findPropertyAnywhere} from '@utils/searchTree';

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

export const flattenObject = (obj) => {
  const flattened = {};

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

export type SelectInputType = {
  id: number,
  title: string
}

const titleExtractor = (item: SelectInputType) => item?.title;
const keyExtractor = (item: SelectInputType) => item?.id;

export const GET_CATEGORY_DATA = gql`
  query {
    protectedAreaCategories (ordering: "id") {
      id
      title
    }
  }
`;

export const GET_REGION_DATA = gql`
  query {
    regions (parent: 1) {
      id
      name
    }
  }
`;

const headers = [
  {label: 'UUID', value: 'id'},
  {label: 'Category', value: 'category.title'},
  {label: 'Title', value: 'title'},
  {label: 'Description', value: 'description'},
  {label: 'Sentiment', value: 'sentiment'},
  {label: 'Improvement', value: 'improvement'},
  {label: 'Location', value: 'location.coordinates'},
  {label: 'Longitude', value: 'location.coordinates[0]'},
  {label: 'Latitude', value: 'location.coordinates[1]'},
  {label: 'Boundary', value: 'boundary.coordinates'},
  {label: 'Status', value: 'status'},
  {label: 'Created Date', value: 'createdAt'},
];

const happeningSurveyParser = new Parser({fields: headers});
const customSurveyParser = new Parser();

const Dashboard = () => {
  const mapRef = useRef<MapRef>(null);
  const [popup, setPopUp] = React.useState(null);
  const [filteredData, setFilteredData] = React.useState([]);
  const [popupLngLat, setPopUpLngLat] = React.useState<any>(null);
  const [selectInputCategory, setSelectInputCategory] = useState<SelectInputType | null>(null);
  const [selectInputRegion, setSelectInputRegion] = useState<SelectInputType | null>(null);
  const {data} = useQuery(GET_HAPPENING_SURVEY_DATA);
  const {data: customSurveyData} = useQuery(GET_SURVEY_DATA);
  const {data: category} = useQuery(GET_CATEGORY_DATA);
  const {data: regions} = useQuery(GET_REGION_DATA);

  useEffect(() => {
    if (!data) return;
    const _filteredData = data.happeningSurveys?.filter(
      (item: {createdAt: string, category: SelectInputType, region: SelectInputType}) => {
        if (selectInputCategory && (item.category.id !== selectInputCategory.id)) {
          return false;
        }
        if (selectInputRegion && (item.region?.id !== selectInputRegion.id)) {
          return false;
        }
        return true;
      },
    ) || [];

    setFilteredData(_filteredData);
  }, [data, selectInputCategory, selectInputRegion]);

  const handleCategoryChange = useCallback(({option}) => {
    setSelectInputCategory(option);
  }, []);

  const handleRegionChange = useCallback(({option}) => {
    setSelectInputRegion(option);
  }, []);

  const surveyGeoJSON: any = useMemo(() => {
    const shape = filteredData
      .filter((survey) => survey.location)
      .map((survey) => ({
        type: 'Feature',
        properties: {
          surveyItem: survey,
        },
        geometry: {
          type: survey.location.type,
          coordinates: survey.location.coordinates,
        },
      })) || [];
    return {
      type: 'FeatureCollection',
      features: [...shape],
    };
  }, [filteredData]);

  const customFormGeoJSON = useMemo(() => {
    let shape = [];
    if (customSurveyData?.survey?.length > 0) {
      shape = customSurveyData?.survey.reduce((features, survey) => {
        const formAnswers = JSON.parse(survey.answer);
        if (selectInputCategory) {
          return features;
        }
        if (selectInputRegion) {
          const provinceData = findPropertyAnywhere(formAnswers, 'province');
          if (provinceData?.replace(/_/g, ' ')?.toLowerCase() !== selectInputRegion.title.toLowerCase()) {
            return features;
          }
        }
        const locationGPS = findPropertyAnywhere(formAnswers, 'location_gps');
        if (locationGPS) {
          const [lat, lng] = locationGPS.split(' ');
          features.push({
            type: 'Feature',
            properties: {
              customForm: {
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
  }, [customSurveyData, selectInputRegion, selectInputCategory]);

  const flatCustomForms = useMemo(() => customFormGeoJSON.features.map(
    (feat) => flattenObject(feat.properties.customForm.formAnswers?.data),
  ), [customFormGeoJSON]);

  const surveyPolyGeoJSON: any = useMemo(() => {
    const shapePoly = filteredData
      .filter((survey) => survey.boundary)
      .map((survey) => ({
        type: 'Feature',
        properties: {
          surveyItem: survey,
        },
        geometry: {
          type: survey.boundary.type,
          coordinates: survey.boundary.coordinates,
        },
      })) || [];
    return {
      type: 'FeatureCollection',
      features: [...shapePoly],
    };
  }, [filteredData]);

  const onClick = useCallback((event) => {
    const cluster = event.features.find(
      (feat) => feat.layer.id === 'clusters' || feat.layer.id === 'clusters-form',
    );
    if (cluster) {
      const features = mapRef.current.queryRenderedFeatures(event.point, {
        layers: [cluster.layer.id],
      });
      const clusterId = cluster.properties.cluster_id;
      return mapRef.current
        .getSource('happeningSurveys')
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          mapRef.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom,
            duration: 1500,
          });
        });
    }
    let item;
    if (
      !event.features.some((feat) => feat.layer?.id === 'unclustered-point' || feat.layer?.id === 'unclustered-form-point')
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
        </div>,
      );
    }

    setPopUpLngLat(event.lngLat);
    setPopUp(
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
      </div>,
    );
  }, []);

  const onLoad = useCallback(() => {
    surveyCategory.filter((cat) => cat.childs.filter(
      (categoryIcon) => mapRef.current.loadImage(categoryIcon.icon, (error, res) => {
        mapRef.current.addImage(categoryIcon.id, res);
      }),
    ));
  }, []);

  const handleCSVClick = useCallback(() => {
    const dateVal = new Date().toISOString();
    const happeningSurveyCSV = happeningSurveyParser.parse(filteredData);
    const zip = new JSZip();
    zip.file(`Happening-Survey-Report-${dateVal}.csv`, happeningSurveyCSV);
    if (flatCustomForms?.length > 0) {
      const customFormCSV = customSurveyParser.parse(flatCustomForms);
      zip.file(`Custom-Survey-Report-${dateVal}.csv`, customFormCSV);
    }
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `Survey-Report-${dateVal}.zip`);
    });
  }, [filteredData, flatCustomForms]);

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

  return (
    <DashboardLayout>
      <DashboardHeader title='Dashboard' />
      <h2 className={classes.title}>Dashboard</h2>
      <div className={classes.header}>
        <SelectInput
          className='h-[44px] min-w-[12em] w-max rounded-lg border-[#CCDCE8]'
          valueExtractor={titleExtractor}
          keyExtractor={keyExtractor}
          options={regionOptions}
          placeholder='Region'
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
        {filteredData && (
          <Button
            className={classes.csvLink}
            textClassName={classes.csvLinkText}
            onClick={handleCSVClick}
            text='Export to CSV'
          />
        )}
      </div>
      <div className={classes.mapWrapper}>
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
              longitude={popupLngLat.lng}
              latitude={popupLngLat.lat}
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
