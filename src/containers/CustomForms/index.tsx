/* eslint-disable max-len */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {useParams} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {gql, useQuery} from '@apollo/client';
import {BsCalendar4Event} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';
import {CSVLink} from 'react-csv';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import FormTable, {FormDataType} from '@components/FormTable';
import Pagination from '@components/Pagination';
import Dropdown from '@components/Dropdown';
import FormEntry from '@components/FormEntry';
import {XMLParser} from 'fast-xml-parser';

import {flattenObject} from '@containers/Dashboard';

import 'react-datepicker/dist/react-datepicker.css';

import classes from './styles';

export const GET_SURVEY_DATA = gql`
  query {
    survey(ordering: "-created_at") {
      id
      title
      createdAt
      answer
    }
  }
`;

export const GET_SURVEY = gql`
  query Survey($id: Float!) {
    survey(id: $id, ordering: "-created_at") {
      id
      title
      createdAt
      answer
    }
  }
`;

const GET_FORMS = gql`
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
  const {data} = useQuery(GET_SURVEY_DATA);
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
    if (!data) return;
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
    if (!data) return;
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

  const flatCustomSurveys = useMemo(() => data?.survey?.map((srvForm: FormDataType) => {
    const formAnswers = JSON.parse(srvForm.answer);
    return flattenObject(formAnswers?.data);
  }) || [], [data]);

  return (
    <>
      <DashboardLayout hideOverflowY={showDetails}>
        <DashboardHeader title='Custom Forms' />
        <div className={classes.container}>
          <h2 className={classes.title}>Custom Forms</h2>
          <div className={classes.header}>
            <div className='cursor-pointer'>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                maxDate={maxDate}
                onChange={handleDateChange}
                customInput={<CustomInput />}
              />
            </div>
            {surveyFormData?.length > 0 && (
              <CSVLink
                className='h-[44px] px-[12px] flex items-center rounded-lg border-[#CCDCE8] bg-[#E7E8EA] font-interMedium text-[14px] text-[#70747E]'
                filename={`Custom-Survey-Report-${new Date().toISOString()}.csv`}
                data={flatCustomSurveys}
              >
                <span>Export to CSV</span>
              </CSVLink>
            )}

          </div>
          <div className={classes.surveyTable}>
            <FormTable
              data={surveyFormData}
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
          data={activeSurveyFormData}
          setShowDetails={setShowDetails}
          formModel={formModel}
          formQuestion={formQuestion}
        />
      )}
    </>
  );
};

export default CustomForms;
