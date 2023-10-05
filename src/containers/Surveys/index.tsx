import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useSelector} from 'react-redux';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {gql, useQuery} from '@apollo/client';
import {BsCalendar4Event, BsArrowUpRight} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';

import {formatISO} from 'date-fns';
import {Parser} from 'json2csv';

import Button from '@components/Button';
import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import SurveyTable, {SurveyDataType} from '@components/SurveyTable';
import SurveyTab from '@components/SurveyTab';
import Pagination from '@components/Pagination';
import Dropdown from '@components/Dropdown';
import SurveyEntry from '@components/SurveyEntry';
import EditSurveyModal from '@components/EditSurveyModal';
import SurveyFilter from '@components/SurveyFilter';

import SelectInput from '@ra/components/Form/SelectInput'; // eslint-disable-line no-eval

import {rootState} from '@store/rootReducer';
import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';
import {formatName} from '@utils/formatName';
import sentimentName from '@utils/sentimentName';
import {useBodyOverflow} from '@hooks/useBodyOverflow';

import 'react-datepicker/dist/react-datepicker.css';

import classes from './styles';

export const GET_SURVEY_DATA = gql`
  query {
    happeningSurveys (ordering: "-created_at") {
      id
      title
      description
      attachment {
        id
        media
      }
      audioFile
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
      modifiedAt
      createdBy {
        id
        firstName
        lastName
      }
      project {
        id
        title
        isAdmin
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
        id
        media
      }
      audioFile
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
      modifiedAt
      createdBy {
        id
        firstName
        lastName
      }
      project {
        id
        title
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
  createdBy?: {
    id: string,
    firstName: string,
    lastName: string
  } | null,
  status?: {
    id: number,
    title: string
  } | null,
  project?: {
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
  {label: 'Project', value: 'project.title'},
  {label: 'Sentiment', value: 'sentiment'},
  {label: 'Condition', value: 'improvement'},
  {label: 'Location', value: 'location.coordinates'},
  {label: 'Boundary', value: 'boundary.coordinates'},
  {label: 'Created At', value: 'createdAt'},
  {label: 'Status', value: 'status'},
  {label: 'Audio', value: 'audioFile'},
  {label: 'Photos', value: 'attachment'},
];

const happeningSurveyParser = new Parser({
  fields: headers,
  defaultValue: '',
});

type State = {
  project: {
    id: number;
    title: string;
  }
}

const Surveys = () => {
  const {
    auth: {
      user: {id: userId, isStaff},
    },
  } = useSelector((state: rootState) => state);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as State;
  const {uuid} = useParams();

  const {data, refetch: refetchSurveyData, loading: loadingSurvey} = useQuery(GET_SURVEY_DATA);
  const {data: category} = useQuery(GET_CATEGORY_DATA);
  const {data: regions} = useQuery(GET_REGION_DATA);
  const {data: protectedAreas} = useQuery(GET_PROTECTED_AREA_DATA);

  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [visibleEditModal, setEditModalVisible] = useState<boolean>(false);
  const handleOpenEditModal = useCallback((isUpdateMode = false) => {
    setShowDetails(false);
    setEditModalVisible(true);
    setUpdateMode(isUpdateMode);
    navigate('/surveys');
  }, [navigate]);
  const handleCloseEditModal = useCallback(() => {
    setEditModalVisible(false);
    setUpdateMode(false);
    navigate('/surveys');
  }, [navigate]);

  const [status, setStatus] = useState<string>('All');
  const [surveyData, setSurveyData] = useState<SurveyDataType[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [activeIndex, setActiveIndex] = useState<number>(0);
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
    createdBy: null,
    project: state?.project?.id ? state.project : null,
  });
  const [toggleFilter, setToggleFilter] = useState<boolean>(Boolean(state?.project));

  useBodyOverflow(showDetails || visibleEditModal);

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
    if (!showDetails && !visibleEditModal) {
      setSurveyEntryData(null);
    }
  }, [showDetails, visibleEditModal]);

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
              createdBy: {id: string},
              project: OptionDataType,
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
      if (selectInputData?.createdBy
          && (item.createdBy?.id !== selectInputData.createdBy.id)) {
        return false;
      }
      if (selectInputData?.project
          && (item.project?.id !== selectInputData.project.id)) {
        return false;
      }
      if (status === 'My Entries' && (item?.createdBy?.id !== userId)) {
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
    if (rows !== 5) {
      setRows(5);
      setActivePage(1);
    }
  }, [rows]);

  const handle10rows = useCallback(() => {
    if (rows !== 10) {
      setRows(10);
      setActivePage(1);
    }
  }, [rows]);

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
            'bg-color-blue-alt text-[white]',
            rows === 5,
          ])}
        >
          5 rows
        </div>
        <div
          onClick={handle10rows}
          className={cs(classes.dropdownItem, ['bg-color-blue-alt text-[white]', rows === 10])}
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

  const handleCreatedByChange = useCallback(({option}) => {
    setSelectInputData({...selectInputData, createdBy: option});
    setActivePage(1);
  }, [selectInputData]);

  const handleProjectChange = useCallback(({option}) => {
    setSelectInputData({...selectInputData, project: option});
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

  const createdByData = data?.happeningSurveys?.map((item: SurveyDataType) => ({
    title: formatName(item?.createdBy),
    id: item?.createdBy?.id,
  }));

  const projectOptions = data?.happeningSurveys?.filter((item: SurveyDataType) => !!item.project)
    .map((item: SurveyDataType) => item.project)
    .filter((item: SurveyDataType['project'], index: boolean, self: any) => self.indexOf(item) === index);

  const createdByOptionsId = createdByData?.map((item: OptionDataType) => item.id);
  const createdByOptions = createdByData?.filter(
    ({id}: OptionDataType, index: number) => !createdByOptionsId.includes(id, index + 1),
  );

  const handleCSVClick = useCallback(() => {
    const data = surveyData.map((item) => ({
      ...item,
      sentiment: sentimentName[item.sentiment],
      attachment: item?.attachment.map((_attachment: any) => _attachment.media),
    }));
    const dateVal = formatISO(new Date(), {format: 'basic'}).replace(/\+|:/g, '');
    const happeningSurveyCSV = happeningSurveyParser.parse(data);
    const url = window.URL.createObjectURL(new Blob([happeningSurveyCSV]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `Happening_survey_report_${dateVal}.csv`;
    a.click();
  }, [surveyData]);

  const handleAnalyticsClick = useCallback(() => {
    navigate('/surveys/analytics');
  }, [navigate]);

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

  const allowEdit = useMemo(
    () => userId === surveyEntryData?.createdBy?.id || isStaff || surveyEntryData?.project?.isAdmin,
    [isStaff, surveyEntryData?.createdBy?.id, surveyEntryData?.project?.isAdmin, userId],
  );

  return (
    <>
      <DashboardLayout hideOverflowY={showDetails}>
        <DashboardHeader title='Surveys List' />
        <div className={classes.container}>
          <h2 className={classes.title}>Surveys List</h2>
          <div className={classes.header}>
            <div className={classes.tabs}>
              <SurveyTab
                text='All'
                onClick={handleTab}
                isActive={status === 'All'}
                className={cs('rounded-l-lg w-[50%] sm:w-auto', [
                  'border-r-0',
                  status === 'Approved',
                ])}
              />
              <SurveyTab
                text='My Entries'
                onClick={handleTab}
                isActive={status === 'My Entries'}
                className={cs('rounded-r-lg w-[50%] sm:w-auto', [
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
                  showYearDropdown
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
              <Button className={classes.analyticsButton} onClick={handleAnalyticsClick} text='View analytics' />
            </div>
          </div>
          {toggleFilter && (
            <div className={classes.filterWrapper}>
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
                <SelectInput
                  className={classes.selectInput}
                  defaultValue={selectInputData?.createdBy}
                  valueExtractor={titleExtractor}
                  keyExtractor={keyExtractor}
                  options={createdByOptions}
                  placeholder='User'
                  onChange={handleCreatedByChange}
                />
                <SelectInput
                  className={classes.selectInput}
                  defaultValue={selectInputData?.project}
                  valueExtractor={titleExtractor}
                  keyExtractor={keyExtractor}
                  options={projectOptions}
                  placeholder='Project'
                  onChange={handleProjectChange}
                />
              </div>
              <span className={classes.clear} onClick={handleClearClick}>
                Clear all filters
              </span>
            </div>
          )}
          <div className={classes.surveyTable}>
            <SurveyTable
              loading={loadingSurvey}
              data={surveyData}
              setActiveIndex={setActiveIndex}
              setShowDetails={setShowDetails}
            />
          </div>
          <div className={classes.footer}>
            <div className={classes.dropdownWrapper}>
              <p className={classes.show}>Show</p>
              <Dropdown alignRight alignTop renderLabel={renderLabel}>
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
      {
        (showDetails && surveyEntryData) && (
          <SurveyEntry
            allowEdit={allowEdit || false}
            data={surveyEntryData}
            setShowDetails={setShowDetails}
            onEditClick={handleOpenEditModal}
          />
        )
      }
      {visibleEditModal && (
        <EditSurveyModal
          onCompleteUpdate={refetchSurveyData}
          updateMode={updateMode}
          onClose={handleCloseEditModal}
          data={surveyEntryData}
        />
      )}
    </>
  );
};

export default Surveys;
