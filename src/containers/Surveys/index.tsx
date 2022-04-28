import React, {useCallback, useEffect, useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {BsCalendar4Event} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';

import cs from '@utils/cs';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import SurveyTable, {SurveyDataType} from '@components/SurveyTable';
import SurveyTab from '@components/SurveyTab';
import Pagination from '@components/Pagination';
import Dropdown from '@components/Dropdown';

const classes = {
  container: 'px-[20px] mt-[24px] mb-[150px]',
  title: 'md:hidden mb-[20px] font-inter font-[600] text-[24px] text-[#101828]',
  header: 'flex flex-wrap gap-4 justify-between',
  tabs: 'min-w-[275px]',
  datePicker: 'flex items-center gap-[10px] h-[42px] px-[14px] border border-[#CCDCE8] rounded-lg font-inter font-[500] text-[14px] text-[#585D69]',
  surveyTable: 'md:max-w-[calc(100vw-276px)] overflow-x-scroll',
  footer: 'w-[100%] flex flex-wrap gap-4 items-center justify-between mt-[24px]',
  dropdownWrapper: 'flex gap-[12px] items-center',
  show: 'font-inter font-[500] text-[14px] text-[#282F3E]',
  dropdownLabel: 'flex items-center gap-[15px] h-[42px] px-[14px] border border-[#CCDCE8] rounded-lg font-inter font-[500] text-[14px] text-[#585D69] cursor-pointer',
  dropdownItems: 'flex-col py-[8px] px-[14px] font-inter font-[500] border border-[#CCDCE8] text-[14px] rounded-lg',
  dropdownItem: 'cursor-pointer p-[10px] rounded-lg',
};

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
      location {
        type
        coordinates
      }
      sentiment
      status
    }
  }
`;

const Surveys = () => {
  const {data} = useQuery(GET_SURVEY_DATA);
  const [status, setStatus] = useState<string>('All');
  const [surveyData, setSurveyData] = useState<SurveyDataType[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

  useEffect(() => {
    if (!data) return;
    if (status === 'All') {
      const slicedData = data.happeningSurveys.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyData(slicedData);
      setTotalPages(Math.ceil(data.happeningSurveys.length / rows));
    } else {
      const filterData = data.happeningSurveys.filter(
        (item: {status: string}) => item.status.toLowerCase() === status.toLowerCase(),
      );
      const slicedData = filterData.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyData(slicedData);
      setTotalPages(Math.ceil(filterData.length / rows));
    }
  }, [activePage, data, rows, status]);

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

  return (
    <DashboardLayout>
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
          <div className={classes.datePicker}>
            <BsCalendar4Event size={18} color='#585D69' />
            <p>Jan 1, 2022 - Feb 2, 2022</p>
          </div>
        </div>
        <div className={classes.surveyTable}>
          <SurveyTable data={surveyData} />
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
  );
};

export default Surveys;
