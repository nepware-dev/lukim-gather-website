import React, {useCallback, useMemo, useEffect} from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import {useLazyQuery, useQuery} from '@apollo/client';
import {XMLParser} from 'fast-xml-parser';

import {GET_SURVEY, GET_FORMS} from '@containers/CustomForms';

import Button from '@components/Button';
import {FormDetails} from '@components/FormEntry';

import NavLogo from '@images/lukim-nav-logo.png';

import classes from './styles';

const PublicCustomForm: React.FC = () => {
  const {id: formId} = useParams();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootStateOrAny) => state.auth.isAuthenticated);

  const [getSurveyData, {data, loading, error}] = useLazyQuery(GET_SURVEY);
  useEffect(() => {
    if (!Number.isNaN(formId as unknown as number)) {
      getSurveyData({variables: {id: Number(formId)}});
    }
  }, [getSurveyData, formId]);

  const mettSurveyData = useMemo(() => data?.survey?.[0], [data]);

  const {data: formData} = useQuery(GET_FORMS);

  const formModel = useMemo(() => {
    const formObj = formData?.surveyForm?.[0];
    if (formObj) {
      const xmlModel = formObj.xform.model;
      const parser = new XMLParser();
      return parser.parse(xmlModel);
    }
    return {};
  }, [formData]);

  const formQuestion = useMemo(() => {
    const formObj = formData?.surveyForm?.[0];
    if (formObj) {
      return JSON.parse(formObj?.questionMapping);
    }
    return {};
  }, [formData]);

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
          METT Survey
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
        {data?.survey?.length === 1 && mettSurveyData?.answer && (
          <FormDetails
            className={classes.content}
            data={mettSurveyData}
            allowEdit={false}
            formModel={formModel}
            formQuestion={formQuestion}
          />
        )}
        {(error || data?.survey?.length === 0 || data?.survey?.length > 1) && (
          <div className={classes.content}>
            <p className={classes.infoText}>
              We were unable to load the METT survey. Please make sure the link you used is correct.
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

export default PublicCustomForm;
