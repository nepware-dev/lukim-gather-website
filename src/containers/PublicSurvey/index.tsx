import React, {useEffect, useMemo, useCallback} from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import {useLazyQuery} from '@apollo/client';

import {GET_SURVEY} from '@containers/Surveys';

import Button from '@components/Button';
import SurveyDetails from '@components/SurveyEntry/SurveyDetails';

import NavLogo from '@images/lukim-nav-logo.png';

import classes from './styles';

const PublicSurvey: React.FC = () => {
  const {id: surveyId} = useParams();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootStateOrAny) => state.auth.isAuthenticated);

  const [getSurveyData, {data, loading, error}] = useLazyQuery(GET_SURVEY);

  useEffect(() => {
    getSurveyData({variables: {id: surveyId}});
  }, [getSurveyData, surveyId]);

  const happeningSurveyData = useMemo(() => data?.happeningSurveys?.[0], [data]);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);
  const onDashboardClick = useCallback(() => navigate('/dashboard'), [navigate]);
  const onLoginClick = useCallback(() => navigate('/login'), [navigate]);

  return (
    <>
      <nav className={classes.navBar}>
        <div className={classes.logoWrapper} onClick={handleLogoClick}>
          <img src={NavLogo} alt='Lukim Gather Logo' className={classes.logo} />
        </div>
        <h1 className={classes.title}>
          Survey
        </h1>
        <div className={classes.buttonWrapper}>
          <div>
            {isAuthenticated ? (
              <Button text='Dashboard' onClick={onDashboardClick} />
            ) : (
              <Button text='Log in' onClick={onLoginClick} />
            )}
          </div>
        </div>
      </nav>
      <div className={classes.container}>
        {Boolean(happeningSurveyData) && (
          <SurveyDetails
            className={classes.content}
            data={happeningSurveyData}
            isEditable={false}
          />
        )}
        {(data?.happeningSurveys?.length === 0 || error) && (
          <div className={classes.content}>
            <p className={classes.infoText}>
              We were unable to load the survey. Please make sure the link you used is correct.
            </p>
          </div>
        )}
        {loading && (
          <div className={classes.content}><p className={classes.infoText}>Loading...</p></div>
        )}
      </div>
    </>
  );
};

export default PublicSurvey;
