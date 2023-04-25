/* eslint-disable max-len */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import DatePicker from 'react-datepicker';
import {gql, useQuery, useMutation} from '@apollo/client';
import {BsCalendar4Event} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';
import {CSVLink} from 'react-csv';
import {XMLParser} from 'fast-xml-parser';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';
import {rootState} from '@store/rootReducer';

import Button from '@components/Button';
import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import FormTable, {FormDataType} from '@components/FormTable';
import Pagination from '@components/Pagination';
import Dropdown from '@components/Dropdown';
import FormEntry from '@components/FormEntry';
import EditCustomSurveyModal from '@components/EditCustomSurveyModal';

import {flattenObject} from '@containers/Dashboard';

import useToggle from '@ra/hooks/useToggle';
import useToast from '@hooks/useToast';
import {UPDATE_SURVEY, CREATE_SURVEY, GET_PROJECTS} from '@services/queries';

import 'react-datepicker/dist/react-datepicker.css';

import classes from './styles';

export const GET_SURVEY_DATA = gql`
  query {
    survey(ordering: "-created_at") {
      id
      title
      createdAt
      answer
      createdBy {
        id
      }
    }
  }
`;

export const GET_SURVEY = gql`
  query Survey($id: ID) {
    survey(id: $id, ordering: "-created_at") {
      id
      title
      createdAt
      answer
    }
  }
`;

export const GET_FORMS = gql`
  query {
    surveyForm {
      id
      title
      xform
      questionMapping
    }
  }
`;

const CustomForms = () => {
  const {id} = useParams();
  const {
    auth: {
      user: {id: userId, isStaff},
    },
  } = useSelector((state: rootState) => state);
  const {data, loading: surveyLoading, refetch: refetchSurveys} = useQuery(GET_SURVEY_DATA);
  const {refetch} = useQuery(GET_SURVEY, {
    variables: {id: Number(id)},
    fetchPolicy: !id ? 'cache-only' : 'cache-first',
  });
  const {data: formData} = useQuery(GET_FORMS);
  const [status] = useState<string>('All');
  const [surveyFormData, setSurveyFormData] = useState<FormDataType[]>([]);
  const [activeSurveyFormData, setActiveSurveyFormData] = useState<FormDataType>();
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [maxDate, setMaxDate] = useState<Date>();
  const [minDate, setMinDate] = useState<Date>();
  const [startDate, endDate] = dateRange;
  const [showEditSurvey, toggleShowEditSurvey] = useToggle(false);
  const [showAddSurvey, toggleShowAddSurvey] = useToggle(false);

  const navigate = useNavigate();

  const toast = useToast();

  const {data: myProjects} = useQuery(GET_PROJECTS, {
    variables: {tab: 'my_project'},
  });
  const [updateSurvey, {loading: updateLoading}] = useMutation(UPDATE_SURVEY, {
    onCompleted: () => {
      toast('success', 'Survey has been updated successfully!');
      toggleShowEditSurvey();
      refetchSurveys();
    },
    onError: () => {
      toast('error', 'Error updating survey');
    },
  });

  const [addSurvey, {loading: addLoading}] = useMutation(CREATE_SURVEY, {
    onCompleted: () => {
      toast('success', 'Survey has been added successfully!');
      toggleShowAddSurvey();
      refetchSurveys();
    },
    onError: () => {
      toast('error', 'Error adding survey');
    },
  });

  useEffect(() => {
    if (!id) return;
    if (surveyFormData[activeIndex]) {
      setShowDetails(true);
      setActiveSurveyFormData(surveyFormData[activeIndex]);
      return;
    }
    refetch({id: Number(id)}).then((res) => {
      setShowDetails(true);
      setActiveSurveyFormData(res?.data?.survey?.[0]);
    });
  }, [id, activeIndex, refetch, surveyFormData]);

  useEffect(() => {
    if (!data?.survey.length) return;
    const MaxDate = new Date(
      Math.max(
        ...data.survey.map((el: {createdAt: string}) => new Date(el.createdAt)),
      ),
    );
    const MinDate = new Date(
      Math.min(
        ...data.survey.map((el: {createdAt: string}) => new Date(el.createdAt)),
      ),
    );
    setDateRange([MinDate, MaxDate]);
    setMaxDate(MaxDate);
    setMinDate(MinDate);
  }, [data]);

  useEffect(() => {
    if (!data?.survey.length) return;
    if (status === 'All') {
      const filterData = data.survey.filter(
        (item: {createdAt: string}) => new Date(new Date(item.createdAt).toDateString())
            >= new Date(startDate.toDateString())
          && new Date(new Date(item.createdAt).toDateString())
            <= new Date(endDate?.toDateString()),
      );
      const slicedData = filterData.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyFormData(slicedData);
      setTotalPages(Math.ceil(filterData.length / rows));
    } else {
      const filterData = data.survey.filter(
        (item: {status: string; createdAt: string}) => new Date(new Date(item.createdAt).toDateString())
            >= new Date(startDate.toDateString())
          && new Date(new Date(item.createdAt).toDateString())
            <= new Date(endDate?.toDateString())
          && item.status.toLowerCase() === status.toLowerCase(),
      );
      const slicedData = filterData.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyFormData(slicedData);
      setTotalPages(Math.ceil(filterData.length / rows));
    }
  }, [activePage, data, endDate, rows, startDate, status]);

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

  const handleCloseEditSurvey = useCallback(() => {
    navigate('/custom-forms');
    toggleShowEditSurvey();
  }, [navigate, toggleShowEditSurvey]);

  const handleEditSurvey = useCallback((_formData) => {
    updateSurvey({
      variables: {
        id: surveyFormData[activeIndex].id,
        answer: _formData,
      },
    });
  }, [updateSurvey, surveyFormData, activeIndex]);

  const handleAddSurvey = useCallback((_formData) => {
    addSurvey({
      variables: {
        input: {
          title: formData?.surveyForm?.[0].title,
          answer: _formData,
        },
      },
    });
  }, [addSurvey, formData?.surveyForm]);

  const handlePage = useCallback((num: number) => {
    setActivePage(num);
  }, []);

  const handle5rows = useCallback(() => {
    setRows(5);
    setActivePage(1);
  }, [setRows]);

  const handle10rows = useCallback(() => {
    setRows(10);
    setActivePage(1);
  }, [setRows]);

  const renderLabel = useCallback(
    () => (
      <div className={classes.dropdownLabel}>
        <p>{`${rows} rows`}</p>
        <RiArrowDownSLine size={20} color='#585D69' />
      </div>
    ),
    [rows],
  );

  const DropdownItem = useCallback(
    () => (
      <div className={classes.dropdownItems}>
        <div
          onClick={handle5rows}
          className={cs(classes.dropdownItem, 'mb-[5px]', [
            'bg-[#F2F5F9]',
            rows === 5,
          ])}
        >
          5 rows
        </div>
        <div
          onClick={handle10rows}
          className={cs(classes.dropdownItem, ['bg-[#F2F5F9]', rows === 10])}
        >
          10 rows
        </div>
      </div>
    ),
    [handle10rows, handle5rows, rows],
  );

  const CustomInput = forwardRef<
    HTMLButtonElement,
    React.HTMLProps<HTMLButtonElement>
  >(({onClick}, ref) => (
    <button
      className={classes.datePicker}
      onClick={onClick}
      ref={ref}
      type='button'
    >
      <BsCalendar4Event size={18} color='#585D69' />
      <p>
        {`${startDate ? `${formatDate(startDate)} -` : ''} ${
          endDate ? formatDate(endDate) : ''
        }`}
      </p>
    </button>
  ));

  const handleDateChange = useCallback((update) => {
    setDateRange(update);
    setActivePage(1);
  }, []);

  const flatCustomSurveys = useMemo(() => surveyFormData?.map((srvForm: FormDataType) => {
    const formAnswers = JSON.parse(srvForm.answer);
    return flattenObject(formAnswers?.data);
  }) || [], [surveyFormData]);

  const handleAnalyticsClick = useCallback(() => {
    navigate('/custom-forms/analytics/');
  }, [navigate]);

  return (
    <>
      <DashboardLayout hideOverflowY={showDetails}>
        <DashboardHeader title='METT List' />
        <div className={classes.container}>
          <h2 className={classes.title}>METT List</h2>
          <div className={classes.header}>
            <div className='cursor-pointer'>
              <DatePicker
                selectsRange
                showYearDropdown
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                maxDate={maxDate}
                onChange={handleDateChange}
                customInput={<CustomInput />}
              />
            </div>
            <Button
              className={classes.addNewButton}
              textClassName={classes.addNewButtonText}
              onClick={toggleShowAddSurvey}
              text='Add New Entry'
            />
            {surveyFormData?.length > 0 && (
              <CSVLink
                className='ml-auto h-[44px] px-[12px] flex items-center rounded-lg border-[#CCDCE8] bg-[#E7E8EA] font-interMedium text-[14px] text-[#70747E] hover:brightness-[1.02] transition duration-300'
                filename={`Custom-Survey-Report-${new Date().toISOString()}.csv`}
                data={flatCustomSurveys}
              >
                <span>Export to CSV</span>
              </CSVLink>
            )}
            <Button className={classes.analyticsButton} onClick={handleAnalyticsClick} text='View analytics' />
          </div>
          <div className={classes.surveyTable}>
            <FormTable
              data={surveyFormData}
              loading={surveyLoading}
              setActiveIndex={setActiveIndex}
              setShowDetails={setShowDetails}
            />
          </div>
          <div className={classes.footer}>
            <div className={classes.dropdownWrapper}>
              <p className={classes.show}>Show</p>
              <Dropdown renderLabel={renderLabel}>
                <DropdownItem />
              </Dropdown>
            </div>
            <div>
              <Pagination
                page={activePage}
                totalPages={totalPages}
                handlePagination={handlePage}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
      {(showDetails && activeSurveyFormData) && (
        <FormEntry
          allowEdit={activeSurveyFormData.createdBy?.id === userId || isStaff}
          data={activeSurveyFormData}
          setShowDetails={setShowDetails}
          formModel={formModel}
          formQuestion={formQuestion}
          onEditClick={toggleShowEditSurvey}
        />
      )}
      {showEditSurvey && formData?.surveyForm?.[0] && surveyFormData[activeIndex] && (
        <EditCustomSurveyModal
          title='Edit Survey'
          loading={updateLoading}
          onClose={handleCloseEditSurvey}
          formData={surveyFormData[activeIndex]}
          formObj={formData?.surveyForm?.[0]}
          handleSubmit={handleEditSurvey}
          projects={myProjects?.projects || []}
        />
      )}
      {showAddSurvey && (
        <EditCustomSurveyModal
          title='Add Survey'
          loading={addLoading}
          onClose={toggleShowAddSurvey}
          formData={{}}
          formObj={formData?.surveyForm?.[0]}
          handleSubmit={handleAddSurvey}
          projects={myProjects?.projects || []}
        />
      )}
    </>
  );
};

export default CustomForms;
