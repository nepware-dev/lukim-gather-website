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
    'icon-size': 0.5,
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
