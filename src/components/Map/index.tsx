import React, {useEffect} from 'react';
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl, {Map} from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import marker from '@images/marker.png';

const makeMap = (
  id: string | HTMLElement,
  center: [number, number],
): Promise<Map> => {
  const fallbackCoordinate = center[0] === 0 && center[1] === 0;
  const map = new Map({
    container: id,
    center: fallbackCoordinate ? [143, -6] : center,
    zoom: fallbackCoordinate ? 3 : 10,
    style: 'mapbox://styles/mapbox/outdoors-v11',
  });
  const el = document.createElement('div');
  el.style.width = '84px';
  el.style.height = '84px';
  el.style.backgroundImage = `url(${marker})`;

  if (!fallbackCoordinate) {
    new mapboxgl.Marker(el).setLngLat(center).addTo(map);
  }

  return new Promise((resolve) => {
    map.on('load', () => resolve(map));
  });
};

interface Props {
  center: [longitude: number, latitude: number];
}

const SurveyMap: React.FC<Props> = ({center}) => {
  useEffect(() => {
    if (process.env.REACT_APP_MAPBOX_TOKEN) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      makeMap('map', center);
    }
  }, [center]);

  return <div id='map' className='w-[100%] h-[100%] rounded-lg' />;
};

export default SurveyMap;
