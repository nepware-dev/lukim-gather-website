/* eslint-disable max-len */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {useSelector} from 'react-redux';
import {CSVLink} from 'react-csv';
import DatePicker from 'react-datepicker';
import {gql, useQuery} from '@apollo/client';
import {BsCalendar4Event, BsArrowUpRight} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';

import {rootState} from '@store/rootReducer';
import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import SurveyTable, {SurveyDataType} from '@components/SurveyTable';
import SurveyTab from '@components/SurveyTab';
import Pagination from '@components/Pagination';
import Dropdown from '@components/Dropdown';
import SurveyEntry from '@components/SurveyEntry';
import SurveyFilter from '@components/SurveyFilter';
import SelectInput from '@ra/components/Form/SelectInput'; // eslint-disable-line no-eval

import 'react-datepicker/dist/react-datepicker.css';

import classes from './styles';

export const GET_SURVEY_DATA = gql`
  query {
    happeningSurveys {
      id
      title
      description
      attachment {
        media
      }
      category {
        id
        title
      }
      boundary {
        type
        coordinates
      }
      location {
        type
        coordinates
      }
      region {
        id
      }
      improvement
      sentiment
      status
      createdAt
      createdBy {
        id
      }
    }
  }
`;

export const GET_CATEGORY_DATA = gql`
  query {
    protectedAreaCategories (ordering: "id") {
      id
      title
    }
  }
`;

export const GET_REGION_DATA = gql`
  query {
    regions (parent: 1) {
      id
      name
    }
  }
`;

export type OptionDataType = {
    id: number,
    title: string
}

export type SelectInputDataType = {
  category?: {
    id: number,
    title: string
  } | null,
  region?: {
    id: number,
    title: string
  } | null,
  status?: {
    id: number,
    title: string
  } | null,
}

const titleExtractor = (item: OptionDataType) => item?.title;
const keyExtractor = (item: OptionDataType) => item?.id;

const Surveys = () => {
  const {
    auth: {
      user: {id: userId},
    },
  } = useSelector((state: rootState) => state);

  const {data} = useQuery(GET_SURVEY_DATA);
  const {data: category} = useQuery(GET_CATEGORY_DATA);
  const {data: regions} = useQuery(GET_REGION_DATA);
  const [status, setStatus] = useState<string>('All');
  const [surveyData, setSurveyData] = useState<SurveyDataType[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [maxDate, setMaxDate] = useState<Date>();
  const [minDate, setMinDate] = useState<Date>();
  const [startDate, endDate] = dateRange;
  const [selectInputData, setSelectInputData] = useState< SelectInputDataType| null>({
    category: null,
    region: null,
    status: null,
  });
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);

  useEffect(() => {
    if (!data) return;
    const MaxDate = new Date(
      Math.max(
        ...data.happeningSurveys.map(
          (el: {createdAt: string}) => new Date(el.createdAt),
        ),
      ),
    );
    const MinDate = new Date(
      Math.min(
        ...data.happeningSurveys.map(
          (el: {createdAt: string}) => new Date(el.createdAt),
        ),
      ),
    );
    setDateRange([MinDate, MaxDate]);
    setMaxDate(MaxDate);
    setMinDate(MinDate);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const filterData = data.happeningSurveys.filter(
      (item: {createdAt: string, category: OptionDataType, region: OptionDataType, status: string, createdBy: {id: string}}) => {
        if (selectInputData?.category && (item.category.id !== selectInputData.category.id)) {
          return false;
        }
        if (selectInputData?.region && (item.region?.id !== selectInputData.region.id)) {
          return false;
        }
        if (selectInputData?.status && (item.status !== selectInputData.status.title)) {
          return false;
        }
        if (status === 'My Entries' && (item.createdBy.id !== userId)) {
          return false;
        }
        if (!(new Date(new Date(item.createdAt).toDateString())
            >= new Date(startDate.toDateString())
            && new Date(new Date(item.createdAt).toDateString())
            <= new Date(endDate?.toDateString()))) {
          return false;
        }
        return true;
      },
    );
    const slicedData = filterData.slice(
      rows * activePage - rows,
      rows * activePage,
    );
    setSurveyData(slicedData);
    setTotalPages(Math.ceil(filterData.length / rows));
  }, [activePage, data, endDate, rows, startDate, status, selectInputData, userId]);

  const handleClearClick = useCallback(() => {
    setSelectInputData({
      category: null,
      region: null,
      status: null,
    });
  }, []);

  const handleTab = useCallback((text: string) => {
    setStatus(text);
    setActivePage(1);
  }, []);

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

  const handleStatusChange = useCallback(({option}) => {
    setSelectInputData({...selectInputData, status: option});
    setActivePage(1);
  }, [selectInputData]);

  const handleRegionChange = useCallback(({option}) => {
    setSelectInputData({...selectInputData, region: option});
    setActivePage(1);
  }, [selectInputData]);

  const handleCategoryChange = useCallback(({option}) => {
    setSelectInputData({...selectInputData, category: option});
    setActivePage(1);
  }, [selectInputData]);

  const handleToggle = useCallback(() => {
    setToggleFilter(!toggleFilter);
  }, [toggleFilter]);

  const headers = useMemo(() => ([
    {label: 'UUID', key: 'id'},
    {label: 'Category', key: 'category.title'},
    {label: 'Title', key: 'title'},
    {label: 'Description', key: 'description'},
    {label: 'Sentiment', key: 'sentiment'},
    {label: 'Improvement', key: 'improvement'},
    {label: 'Location', key: 'location.coordinates'},
    {label: 'Longitude', key: 'location.coordinates[0]'},
    {label: 'Latitude', key: 'location.coordinates[1]'},
    {label: 'Boundary', key: 'boundary.coordinates'},
    {label: 'Status', key: 'status'},
    {label: 'Created Date', key: 'createdAt'},
  ]), []);

  const regionOptions = regions?.regions.map(({
    name: title,
    ...item
  }: {name: string}) => ({
    title,
    ...item,
  }));

  const surveyStatus = [{
    title: 'PENDING',
    id: '1',
  },
  {
    title: 'REJECTED',
    id: '2',
  },
  {
    title: 'APPROVED',
    id: '3',
  },
  ];

  return (
    <>
      <DashboardLayout hideOverflowY={showDetails}>
        <DashboardHeader title='Surveys' />
        <div className={classes.container}>
          <h2 className={classes.title}>Surveys</h2>
          <div className={classes.header}>
            <div className={classes.tabs}>
              <SurveyTab
                text='All'
                onClick={handleTab}
                isActive={status === 'All'}
                className={cs('rounded-l-lg', [
                  'border-r-0',
                  status === 'Approved',
                ])}
              />
              <SurveyTab
                text='My Entries'
                onClick={handleTab}
                isActive={status === 'My Entries'}
                className={cs('rounded-r-lg', [
                  'border-l-0',
                  status === 'Approved',
                ])}
              />
            </div>
            <div className={classes.wrapper}>
              <SurveyFilter active={toggleFilter} onClick={handleToggle} />
              <div>
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
              {surveyData && (
                <CSVLink
                  className={classes.csv}
                  filename={`Happening-Survey-Report-${new Date().toISOString()}.csv`}
                  data={surveyData}
                  headers={headers}
                >
                  <BsArrowUpRight />
                  <span className='ml-2'>Export to CSV</span>
                </CSVLink>
              )}
            </div>
          </div>
          <div className={cs(
            classes.filterWrapper,
            classes.transitionOpacity,
            [classes.opacityNone, !toggleFilter],
            [classes.opacityFull, toggleFilter],
          )}
          >
            <div className={classes.selectInputWrapper}>
              <SelectInput
                className={classes.selectInput}
                defaultValue={selectInputData?.status}
                valueExtractor={titleExtractor}
                keyExtractor={keyExtractor}
                options={surveyStatus}
                placeholder='Status'
                onChange={handleStatusChange}
              />
              <SelectInput
                className={classes.selectInput}
                defaultValue={selectInputData?.region}
                valueExtractor={titleExtractor}
                keyExtractor={keyExtractor}
                options={regionOptions}
                placeholder='Region'
                onChange={handleRegionChange}
              />
              <SelectInput
                className={classes.selectInput}
                defaultValue={selectInputData?.category}
                valueExtractor={titleExtractor}
                keyExtractor={keyExtractor}
                options={category?.protectedAreaCategories}
                placeholder='Category'
                onChange={handleCategoryChange}
              />
            </div>
            <span className={classes.clear} onClick={handleClearClick}>
              Clear all filters
            </span>
          </div>
          <div className={cs(
            classes.surveyTable,
            classes.transition,
            [classes.translate, !toggleFilter],
            [classes.tranlateNone, toggleFilter],
          )}
          >
            <SurveyTable
              data={surveyData}
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
      {showDetails && (
        <SurveyEntry
          data={surveyData[activeIndex]}
          setShowDetails={setShowDetails}
        />
      )}
    </>
  );
};

export default Surveys;
