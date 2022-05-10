// @ts-nocheck
import React, {useEffect} from 'react';
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl, {Map} from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {useQuery} from '@apollo/client';

import marker from '@images/marker.png';
import {GET_SURVEY_DATA} from '@containers/Surveys';
import surveyCategory from '../../data/surveyCategory';

const makeMap = (
  id: string | HTMLElement,
  center: [number, number],
  happeningSurveysData?: undefined,
): Promise<Map> => {
  const fallbackCoordinate = center[0] === 0 && center[1] === 0;
  const map = new Map({
    container: id,
    center,
    zoom: fallbackCoordinate ? 3 : 5,
    style: 'mapbox://styles/mapbox/outdoors-v11',
  });
  const el = document.createElement('div');
  el.style.width = '84px';
  el.style.height = '84px';
  el.style.backgroundImage = `url(${marker})`;

  if (!happeningSurveysData) {
    new mapboxgl.Marker(el).setLngLat(center).addTo(map);
  }

  return new Promise((resolve) => {
    map.on('load', () => {
      if (!happeningSurveysData) {
        return resolve(map);
      }
      Promise.all(
        surveyCategory.filter((category) => category.childs.filter((categoryIcon) => new Promise(() => { //eslint-disable-line
          map.loadImage(categoryIcon.icon, (error, res) => {
            map.addImage(categoryIcon.id, res);
          });
        }))),
      ).then(() => {
        map.addSource('happeningSurveys', {
          type: 'geojson',
          data: happeningSurveysData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 40,
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'happeningSurveys',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#5486BD',
              100,
              '#f1f075',
              750,
              '#f28cb1',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'happeningSurveys',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': 'white',
          },
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'happeningSurveys',
          filter: ['!has', 'point_count'],
          layout: {
            'icon-image': ['get', 'id', ['get', 'category', ['get', 'surveyItem']]],
            'icon-allow-overlap': true,
            'icon-size': 0.5,
          },
        });

        map.on('click', 'unclustered-point', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const item = JSON.parse(e.features[0].properties.surveyItem);
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `
                 Category: ${item.category.title}
                 <br/>
                 Title: ${item.title}
                 <br/>
                 Description: ${item.description}
                 <br/>
                 Feel: ${item.sentiment}
                `,
            )
            .addTo(map);
        });
        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters'],
          });
          const clusterId = features[0].properties.cluster_id;
          map.getSource('happeningSurveys').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return;

              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom,
                duration: 1500,
              });
            },
          );
        });
      });
      return resolve(map);
    });
  });
};

interface Props {
  center?: [longitude: number, latitude: number];
  showCluster?: boolean;
}

const SurveyMap: React.FC<Props> = ({center, showCluster}) => {
  const {data} = useQuery(GET_SURVEY_DATA);
  useEffect(() => {
    if (process.env.REACT_APP_MAPBOX_TOKEN) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      if (showCluster) {
        const shape = data?.happeningSurveys
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
        const surveyGeoJSON = {
          type: 'FeatureCollection',
          features: [...shape],
        };
        makeMap('map', [150, -5], surveyGeoJSON);
      } else {
        makeMap('map', center);
      }
    }
  }, [center, showCluster, data]);

  return <div id='map' className='w-[100%] h-[100%] rounded-lg' />;
};

export default SurveyMap;
