/* eslint-disable max-len */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {CSVLink} from 'react-csv';
import DatePicker from 'react-datepicker';
import {gql, useQuery} from '@apollo/client';
import {BsCalendar4Event} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';

import cs from '@utils/cs';
import {formatDate} from '@utils/formatDate';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import SurveyTable, {SurveyDataType} from '@components/SurveyTable';
import SurveyTab from '@components/SurveyTab';
import Pagination from '@components/Pagination';
import Dropdown from '@components/Dropdown';
import SurveyEntry from '@components/SurveyEntry';
import SelectInput from '@ra/components/Form/SelectInput'; // eslint-disable-line no-eval

import 'react-datepicker/dist/react-datepicker.css';

import classes from './styles';
import styles from './styles.module.scss';

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
      createdAt
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

export type SelectInputType = {
  id: number,
  title: string
}

const titleExtractor = (item: SelectInputType) => item?.title;
const keyExtractor = (item: SelectInputType) => item?.id;

const Surveys = () => {
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
  const [selectInputCategory, setSelectInputCategory] = useState<SelectInputType | null>(null);
  const [selectInputRegion, setSelectInputRegion] = useState<SelectInputType | null>(null);

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
    if (status === 'All') {
      const filterData = data.happeningSurveys.filter(
        (item: {createdAt: string, category: SelectInputType, region: SelectInputType}) => {
          const filterItem = new Date(new Date(item.createdAt).toDateString())
            >= new Date(startDate.toDateString())
            && new Date(new Date(item.createdAt).toDateString())
            <= new Date(endDate?.toDateString());
          if (selectInputCategory && selectInputRegion) {
            return filterItem && (selectInputCategory && (item.category.id === selectInputCategory.id))
            && (selectInputRegion && (item.region && (item.region.id === selectInputRegion.id)));
          }
          if (selectInputCategory) {
            return filterItem && (selectInputCategory && (item.category.id === selectInputCategory.id));
          }
          if (selectInputRegion) {
            return filterItem && (selectInputRegion && (item.region && (item.region.id === selectInputRegion.id)));
          }
          return filterItem;
        },
      );
      const slicedData = filterData.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyData(slicedData);
      setTotalPages(Math.ceil(filterData.length / rows));
    } else {
      const filterData = data.happeningSurveys.filter(
        (item: {status: string; createdAt: string, category: SelectInputType, region: SelectInputType}) => {
          const filterItem = new Date(new Date(item.createdAt).toDateString())
              >= new Date(startDate.toDateString())
            && new Date(new Date(item.createdAt).toDateString())
              <= new Date(endDate?.toDateString())
            && item.status.toLowerCase() === status.toLowerCase();
          if (selectInputCategory && selectInputRegion) {
            return filterItem && item.category.id === selectInputCategory.id
            && (item.region && (item.region && (item.region.id === selectInputRegion.id)));
          }
          if (selectInputCategory) {
            return filterItem && item.category.id === selectInputCategory.id;
          }
          if (selectInputRegion) {
            return filterItem && (item.region && (item.region && (item.region.id === selectInputRegion.id)));
          }
          return filterItem;
        },
      );
      const slicedData = filterData.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyData(slicedData);
      setTotalPages(Math.ceil(filterData.length / rows));
    }
  }, [activePage, data, endDate, rows, startDate, status, selectInputCategory, selectInputRegion]);

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

  const handleCategoryChange = useCallback(({option}) => {
    setSelectInputCategory(option);
  }, []);

  const handleRegionChange = useCallback(({option}) => {
    setSelectInputRegion(option);
  }, []);

  const headers = [
    {label: 'UUID', key: 'id'},
    {label: 'Category', key: 'category.title'},
    {label: 'Title', key: 'title'},
    {label: 'Description', key: 'description'},
    {label: 'Sentiment', key: 'sentiment'},
    {label: 'Improvement', key: 'improvement'},
    {label: 'Location', key: 'location.coordinates'},
    {label: 'Boundary', key: 'boundary.coordinates'},
    {label: 'Status', key: 'status'},
    {label: 'Created Date', key: 'createdAt'},
    {label: 'Longitude', key: 'location.coordinates[0]'},
    {label: 'Latitude', key: 'location.coordinates[1]'},
  ];

  const regionOptions = regions?.regions.map(({
    name: title,
    ...item
  }: {name: string}) => ({
    title,
    ...item,
  }));

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
                text='Approved'
                onClick={handleTab}
                isActive={status === 'Approved'}
                className={cs(
                  ['border-x', status === 'Approved'],
                  ['border-x-0', status !== 'Approved'],
                )}
              />
              <SurveyTab
                text='Pending'
                onClick={handleTab}
                isActive={status === 'Pending'}
                className={cs('rounded-r-lg', [
                  'border-l-0',
                  status === 'Approved',
                ])}
              />
            </div>
            <div className='flex gap-[24px] cursor-pointer'>
              <SelectInput
                className={cs(styles.select, 'h-[44px]', 'w-[100%]', 'rounded-lg', 'border-[#CCDCE8]')}
                valueExtractor={titleExtractor}
                keyExtractor={keyExtractor}
                options={regionOptions}
                placeholder='Region'
                onChange={handleRegionChange}
              />
              <SelectInput
                className={cs(styles.select, 'h-[44px]', 'w-[100%]', 'rounded-lg', 'border-[#CCDCE8]')}
                valueExtractor={titleExtractor}
                keyExtractor={keyExtractor}
                options={category?.protectedAreaCategories}
                placeholder='Category'
                onChange={handleCategoryChange}
              />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                maxDate={maxDate}
                onChange={handleDateChange}
                customInput={<CustomInput />}
              />
              {surveyData && (<CSVLink className='h-[44px] w-[100%] px-[12px] flex items-center rounded-lg border-[#CCDCE8] bg-[#E7E8EA] font-interMedium text-[14px] text-[#70747E]' filename={`Happening-Survey-Report-${Date.now()}`} data={surveyData} headers={headers}><span>Export to CSV</span></CSVLink>)}
            </div>
          </div>
          <div className={classes.surveyTable}>
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
