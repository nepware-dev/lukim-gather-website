// @ts-nocheck
// @ts-ignore
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Map, Source, Layer, Popup} from 'react-map-gl';
import type {MapRef, GeoJSONSource} from 'react-map-gl';
import {useQuery} from '@apollo/client';
import {CSVLink} from 'react-csv';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import {GET_SURVEY_DATA} from '@containers/Surveys';
import {formatDate} from '@utils/formatDate';

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
];

import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  polygonTitle,
  polygon,
} from './layers';
import surveyCategory from '../../data/surveyCategory';

import classes from './styles';

const Dashboard = () => {
  const mapRef = useRef<MapRef>(null);
  const [popup, setPopUp] = React.useState(null);
  const [popupLngLat, setPopUpLngLat] = React.useState(null);
  const {data} = useQuery(GET_SURVEY_DATA);

  const surveyGeoJSON = useMemo(() => {
    const shape =
      data?.happeningSurveys
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
  }, [data]);

  const surveyPolyGeoJSON = useMemo(() => {
    const shapePoly =
      data?.happeningSurveys
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
  }, [data]);

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

  return (
    <DashboardLayout>
      <DashboardHeader title='Dashboard' />
      <h2 className={classes.title}>Dashboard</h2>
      <div className={classes.header}>
        {data?.happeningSurveys && (<CSVLink
          className={classes.csvLink}
          filename={`Happening-Survey-Report-${Date.now()}`}
          data={data?.happeningSurveys}
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
