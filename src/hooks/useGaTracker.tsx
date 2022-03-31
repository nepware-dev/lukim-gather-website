import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import ReactGA from 'react-ga4';

const useGaTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(`${process.env.REACT_APP_GA_TRACKING_CODE}`, {
      gtagOptions: {debug_mode: process.env.NODE_ENV === 'test'},
    });
  }, []);

  useEffect(() => {
    ReactGA.send({hitType: 'pageview', path: location.pathname + location.search});
  }, [location]);
};

export default useGaTracker;
