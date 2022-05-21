// @ts-nocheck
// @ts-ignore
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import Map, {Source, Layer, Popup} from 'react-map-gl';
import type {MapRef, GeoJSONSource} from 'react-map-gl';
import {gql, useQuery} from '@apollo/client';
import {CSVLink} from 'react-csv';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import {GET_SURVEY_DATA} from '@containers/Surveys';
import SelectInput from '@ra/components/Form/SelectInput'; // eslint-disable-line no-eval
import {formatDate} from '@utils/formatDate';
import cs from '@utils/cs';

import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  polygonTitle,
  polygon,
} from './layers';
import surveyCategory from '../../data/surveyCategory';
import classes from './styles';

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
  {label: 'UUID', key: 'id'},
  {label: 'Category', key: 'category.title'},
  {label: 'Title', key: 'title'},
  {label: 'Description', key: 'description'},
  {label: 'Sentiment', key: 'sentiment'},
  {label: 'Improvement', key: 'improvement'},
  {label: 'Location', key: 'location.coordinates'},
  {label: 'Boundary', key: 'boundary.coordinates'},
  {label: 'Status', key: 'status'},
  {label: 'Created Date', key: 'createdAt'},
  {label: 'Longitude', key: 'location.coordinates[0]'},
  {label: 'Latitude', key: 'location.coordinates[1]'},
];

const Dashboard = () => {
  const mapRef = useRef<MapRef>(null);
  const [popup, setPopUp] = React.useState(null);
  const [filteredData, setFilteredData] = React.useState([]);
  const [popupLngLat, setPopUpLngLat] = React.useState<any>(null);
  const [selectInputCategory, setSelectInputCategory] = useState<SelectInputType | null>(null);
  const [selectInputRegion, setSelectInputRegion] = useState<SelectInputType | null>(null);
  const {data} = useQuery(GET_SURVEY_DATA);
  const {data: category} = useQuery(GET_CATEGORY_DATA);
  const {data: regions} = useQuery(GET_REGION_DATA);

  useEffect(() => {
    if (!data) return;
    const _filteredData = data.happeningSurveys?.filter(
      (item: {createdAt: string, category: SelectInputType, region: SelectInputType}) => {
        if (selectInputCategory && (item.category.id !== selectInputCategory.id)) {
          return false
        }
        if (selectInputRegion && (item.region?.id !== selectInputRegion.id)) {
          return false;
        }
        return true;
      },
    );

    setFilteredData(_filteredData);
  }, [data, selectInputCategory, selectInputRegion]);

  const handleCategoryChange = useCallback(({option}) => {
    setSelectInputCategory(option);
  }, []);

  const handleRegionChange = useCallback(({option}) => {
    setSelectInputRegion(option);
  }, []);

  const surveyGeoJSON: any = useMemo(() => {
    const shape =
      filteredData
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

  const surveyPolyGeoJSON: any = useMemo(() => {
    const shapePoly =
      filteredData
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
    return  {
      type: 'FeatureCollection',
      features: [...shapePoly],
    };
  }, [filteredData]);

  const onClick = useCallback(event => {
    const cluster = event.features.find(
      (feat) => feat.layer.id === 'clusters',
    );
    if (cluster) {
      const features = mapRef.current.queryRenderedFeatures(event.point, {
        layers: ['clusters'],
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
      !event.features.some((feat) => feat.layer?.id === 'unclustered-point')
    ) {
      item = JSON.parse(
        event.features[event.features.length - 1].properties.surveyItem,
      );
    } else {
      item = JSON.parse(event.features[0].properties.surveyItem);
    }

    setPopUpLngLat(event.lngLat);
    setPopUp(
      <div>
         Category: {item.category.title}
         <br/>
         Title: {item.title}
         <br/>
         Description: {item.description}
         <br/>
         Feel: {item.sentiment}
         <br />
         Created At: {formatDate(item.createdAt)}
      </div>
    );
  }, []);

  const onLoad = useCallback(() => {
    surveyCategory.filter((category) =>
      category.childs.filter(
        (categoryIcon) =>
          mapRef.current.loadImage(categoryIcon.icon, (error, res) => {
            mapRef.current.addImage(categoryIcon.id, res);
          })),
    );
  }, []);

  const regionOptions = useMemo(() => regions?.regions.map(({
    name: title,
    ...item
  }: {name: string}) => ({
      title,
      ...item,
    }))
    , [regions]);

  return (
    <DashboardLayout>
      <DashboardHeader title='Dashboard' />
      <h2 className={classes.title}>Dashboard</h2>
      <div className={classes.header}>
        <SelectInput
          className={cs('h-[44px]', 'w-[12em]', 'rounded-lg', 'border-[#CCDCE8]')}
          valueExtractor={titleExtractor}
          keyExtractor={keyExtractor}
          options={regionOptions}
          placeholder='Region'
          onChange={handleRegionChange}
        />
        <SelectInput
          className={cs('h-[44px]', 'w-[12em]', 'rounded-lg', 'border-[#CCDCE8]')}
          valueExtractor={titleExtractor}
          keyExtractor={keyExtractor}
          options={category?.protectedAreaCategories}
          placeholder='Category'
          onChange={handleCategoryChange}
        />
        {filteredData && (<CSVLink
          className={classes.csvLink}
          filename={`Happening-Survey-Report-${Date.now()}`}
          data={filteredData}
          headers={headers}>
            <span>Export to CSV</span>
        </CSVLink>)}
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
            <Layer {...unclusteredPointLayer} />
          </Source>
          {popup && (
            <Popup longitude={popupLngLat.lng} latitude={popupLngLat.lat}
              anchor="bottom"
              onClose={() => setPopUp(null)}>
               {popup}
            </Popup>
          )}
        </Map>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
