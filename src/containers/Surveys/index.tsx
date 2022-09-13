import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {gql, useQuery} from '@apollo/client';
import {BsCalendar4Event, BsArrowUpRight} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';

import {formatISO} from 'date-fns';
import {Parser} from 'json2csv';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

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
    happeningSurveys (ordering: "-created_at") {
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
      protectedArea {
        id
      }
      improvement
      sentiment
      status
      isTest
      isPublic
      createdAt
      createdBy {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_SURVEY = gql`
  query HappeningSurveys ($id: UUID!) {
    happeningSurveys (id: $id) {
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
      protectedArea {
        id
      }
      improvement
      sentiment
      status
      isTest
      isPublic
      createdAt
      createdBy {
        id
        firstName
        lastName
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

export const GET_PROTECTED_AREA_DATA = gql`
  query {
    protectedAreas(parent: 1, ordering: "id") {
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
  protectedArea?: {
    id: number,
    title: string,
  } | null,
  status?: {
    id: number,
    title: string
  } | null,
}

const titleExtractor = (item: OptionDataType) => item?.title;
const keyExtractor = (item: OptionDataType) => item?.id;

const headers = [
  {label: 'UUID', value: 'id'},
  {label: 'Category', value: 'category.title'},
  {label: 'Title', value: 'title'},
  {label: 'Description', value: 'description'},
  {label: 'Sentiment', value: 'sentiment'},
  {label: 'Condition', value: 'improvement'},
  {label: 'Location', value: 'location.coordinates'},
  {label: 'Longitude', value: 'location.coordinates[0]'},
  {label: 'Latitude', value: 'location.coordinates[1]'},
  {label: 'Boundary', value: 'boundary.coordinates'},
  {label: 'Status', value: 'status'},
  {label: 'Created Date', value: 'createdAt'},
];

const happeningSurveyLocationParser = new Parser({
  fields: headers.filter((header) => header.label !== 'Boundary'),
  defaultValue: 'No matching data found in selection',
});

const happeningSurveyBoundaryParser = new Parser({
  fields: headers.filter((header) => !(header.label === 'Location' || header.label === 'Longitude' || header.label === 'Latitude')),
  defaultValue: 'No matching data found in selection',
});

const Surveys = () => {
  const {
    auth: {
      user: {id: userId},
    },
  } = useSelector((state: rootState) => state);
  const {uuid} = useParams();

  const {data} = useQuery(GET_SURVEY_DATA);
  const {data: category} = useQuery(GET_CATEGORY_DATA);
  const {data: regions} = useQuery(GET_REGION_DATA);
  const {data: protectedAreas} = useQuery(GET_PROTECTED_AREA_DATA);
  const [status, setStatus] = useState<string>('All');
  const [surveyData, setSurveyData] = useState<SurveyDataType[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [surveyEntryData, setSurveyEntryData] = useState<SurveyDataType | null>(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [maxDate, setMaxDate] = useState<Date>();
  const [minDate, setMinDate] = useState<Date>();
  const [startDate, endDate] = dateRange;
  const [selectInputData, setSelectInputData] = useState<SelectInputDataType| null>({
    category: null,
    region: null,
    status: null,
    protectedArea: null,
  });
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);

  const {refetch} = useQuery(GET_SURVEY, {
    variables: {id: uuid},
    fetchPolicy: !uuid ? 'cache-only' : 'cache-first',
  });

  useEffect(() => {
    if (!uuid) return;
    const index = data?.happeningSurveys?.map((value: SurveyDataType) => value.id).indexOf(uuid);
    if (index) {
      setShowDetails(true);
      setSurveyEntryData(data?.happeningSurveys?.[index]);
      return;
    }
    refetch({id: uuid}).then((res) => {
      setShowDetails(true);
      setSurveyEntryData(res?.data?.happeningSurveys?.[0]);
    });
  }, [uuid, activeIndex, refetch, surveyData, data]);

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
    const filterData = data.happeningSurveys.filter((item: {createdAt: string,
              category: OptionDataType,
              region: OptionDataType,
              protectedArea: OptionDataType,
              status: string,
              createdBy: {id: string}
              }) => {
      if (selectInputData?.category && (item.category.id !== selectInputData.category.id)) {
        return false;
      }
      if (selectInputData?.region && (item.region?.id !== selectInputData.region.id)) {
        return false;
      }
      if (selectInputData?.status && (item.status !== selectInputData.status.title)) {
        return false;
      }
      if (selectInputData?.protectedArea
          && (item.protectedArea?.id !== selectInputData.protectedArea.id)) {
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
    });
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

  const handleProtectedAreaChange = useCallback(({option}) => {
    setSelectInputData({...selectInputData, protectedArea: option});
    setActivePage(1);
  }, [selectInputData]);

  const handleToggle = useCallback(() => {
    setToggleFilter(!toggleFilter);
  }, [toggleFilter]);

  const regionOptions = regions?.regions.map(({
    name: title,
    ...item
  }: {name: string}) => ({
    title,
    ...item,
  }));

  const protectedAreaOptions = protectedAreas?.protectedAreas.map(({
    name: title,
    ...item
  }: {name: string}) => ({
    title,
    ...item,
  }));

  const handleCSVClick = useCallback(() => {
    const dateVal = formatISO(new Date(), {format: 'basic'}).replace(/\+|:/g, '');
    const happeningSurveyLocationCSV = happeningSurveyLocationParser.parse(
      surveyData.filter((surveyLocation) => surveyLocation.location !== null),
    );
    const happeningSurveyBoundaryCSV = happeningSurveyBoundaryParser.parse(
      surveyData.filter((surveyBoundary) => surveyBoundary.boundary !== null),
    );
    const zip = new JSZip();
    zip.file(`Happening_survey_report_location_${dateVal}.csv`, happeningSurveyLocationCSV);
    zip.file(`Happening_survey_report_boundary_${dateVal}.csv`, happeningSurveyBoundaryCSV);
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `Survey_report_${dateVal}.zip`);
    });
  }, [surveyData]);

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
                <button
                  className={classes.csv}
                  onClick={handleCSVClick}
                  type='button'
                >
                  <BsArrowUpRight />
                  <span className='ml-2'>Export to CSV</span>
                </button>
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
                placeholder='Province'
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
              <SelectInput
                className={classes.selectInput}
                defaultValue={selectInputData?.protectedArea}
                valueExtractor={titleExtractor}
                keyExtractor={keyExtractor}
                options={protectedAreaOptions}
                placeholder='Protected Area'
                onChange={handleProtectedAreaChange}
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
      {(showDetails && surveyEntryData) && (
        <SurveyEntry
          data={surveyEntryData}
          setShowDetails={setShowDetails}
        />
      )}
    </>
  );
};

export default Surveys;
