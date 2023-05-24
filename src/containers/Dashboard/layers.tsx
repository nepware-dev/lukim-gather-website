import type {LayerProps} from 'react-map-gl';

export const clusterLayer: LayerProps = {
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
      '#f28cb1',
      750,
      '#ec6025',
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
};

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'happeningSurveys',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12,
  },
  paint: {
    'text-color': 'white',
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'symbol',
  source: 'happeningSurveys',
  filter: ['!has', 'point_count'],
  layout: {
    'icon-image': [
      'get',
      'id',
      ['get', 'category', ['get', 'surveyItem']],
    ],
    'icon-allow-overlap': true,
    'icon-size': 0.65,
  },
};

export const clusterCustomFormLayer: LayerProps = {
  id: 'clusters-form',
  type: 'circle',
  source: 'customSurveys',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#000',
    'circle-opacity': 0.5,
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
};

export const clusterCustomFormCountLayer: LayerProps = {
  id: 'cluster-count-form',
  type: 'symbol',
  source: 'customSurveys',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12,
  },
  paint: {
    'text-color': 'white',
  },
};

export const unclusteredCustomFormPointLayer: LayerProps = {
  id: 'unclustered-form-point',
  type: 'circle',
  source: 'customSurveys',
  filter: ['!has', 'point_count'],
  paint: {
    'circle-color': '#000',
    'circle-radius': 15,
    'circle-opacity': 0.5,
  },
};

export const unclusteredCustomFormPointTextLayer: LayerProps = {
  id: 'unclustered-form-point-text',
  type: 'symbol',
  source: 'customSurveys',
  filter: ['!has', 'point_count'],
  layout: {
    'text-field': 'C',
  },
  paint: {
    'text-color': '#fff',
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

export const protectedAreaLayer: LayerProps = {
  id: 'protected-area-fill',
  type: 'fill',
  'source-layer': 'protected-areas',
  paint: {
    'fill-outline-color': 'rgba(59, 117, 180, 0.4)',
    'fill-color': 'rgba(38, 176, 108, 0.2)',
  },
};

export const protectedAreaLayerTitle: LayerProps = {
  id: 'protected-area-title',
  type: 'symbol',
  minzoom: 6,
  'source-layer': 'protected-areas',
  layout: {
    'text-field': ['format', ['get', 'name']],
    'text-size': 11,
  },
  paint: {
    'text-color': 'rgba(0, 0, 0, 0.8)',
  },
};
