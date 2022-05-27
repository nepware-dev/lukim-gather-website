import type {LayerProps} from 'react-map-gl';

export const polygon: LayerProps = {
  id: 'polygon',
  type: 'fill',
  source: 'surveyPolySource',
  layout: {},
  paint: {
    'fill-color': '#5486BD',
    'fill-opacity': 0.25,
  },
};

export const polygonTitle: LayerProps = {
  id: 'polygonTitle',
  type: 'symbol',
  source: 'surveyPolySource',
  layout: {
    'text-field': ['get', 'title', ['get', 'surveyItem']],
  },
  paint: {
    'text-color': 'blue',
  },
};
