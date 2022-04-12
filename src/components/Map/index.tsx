import React, {useEffect} from 'react';
import mapboxgl, {Map} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import marker from '@images/marker.png';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

const makeMap = (
  id: string | HTMLElement,
  center: [number, number],
): Promise<Map> => {
  const map = new Map({
    container: id,
    center,
    zoom: 10,
    style: 'mapbox://styles/mapbox/outdoors-v11',
  });
  const el = document.createElement('div');
  el.style.width = '84px';
  el.style.height = '84px';
  el.style.backgroundImage = `url(${marker})`;

  new mapboxgl.Marker(el).setLngLat(center).addTo(map);

  return new Promise((resolve) => {
    map.on('load', () => resolve(map));
  });
};

interface Props {
  center: [longitude: number, latitude: number];
}

const SurveyMap: React.FC<Props> = ({center}) => {
  useEffect(() => {
    makeMap('map', center);
  }, [center]);

  return <div id='map' className='w-[100%] h-[100%] rounded-lg' />;
};

export default SurveyMap;
