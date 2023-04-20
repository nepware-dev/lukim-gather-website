import {useCallback, useEffect, useState} from 'react';

import type {SurveyDataType} from '@components/SurveyTable';

const useLocationName = (surveyData: SurveyDataType) => {
  const [locationName, setLocationName] = useState<string>('');

  const getLocationName = useCallback(async (survey: SurveyDataType) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${survey?.location?.coordinates[0] || 0
      },${survey?.location?.coordinates[1] || 0}.json?types=place&access_token=${process.env.REACT_APP_MAPBOX_TOKEN
      }`,
    );
    const resData: {
      features: [{place_name?: string}];
    } = await response.json();
    if (resData.features[0]?.place_name) {
      setLocationName(resData.features[0].place_name);
    } else {
      setLocationName('');
    }
  }, []);

  useEffect(() => {
    getLocationName(surveyData);
  }, [getLocationName, surveyData]);

  return locationName;
};

export default useLocationName;
