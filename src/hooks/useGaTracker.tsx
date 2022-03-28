import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import ReactGA from 'react-ga';

const useGaTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(`${process.env.REACT_APP_GA_TRACKING_CODE}`);
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);
};

export default useGaTracker;
