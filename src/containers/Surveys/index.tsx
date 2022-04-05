import React, {useCallback, useEffect, useState} from 'react';
import {BsCalendar4Event} from 'react-icons/bs';
import {RiArrowDownSLine} from 'react-icons/ri';
import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';

import SurveyTable, {Data} from '@components/SurveyTable';
import SurveyTab from '@components/SurveyTab';
import Pagination from '@components/Pagination';
import Dropdown from '@components/Dropdown';

import data from '../../data/mockData.js';

const Surveys = () => {
  const [status, setStatus] = useState<string>('All');
  const [surveyData, setSurveyData] = useState<Data[]>(data);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

  useEffect(() => {
    if (status === 'All') {
      const slicedData = data.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyData(slicedData);
      setTotalPages(Math.ceil(data.length / rows));
    } else {
      const filterData = data.filter((item) => item.status === status);
      const slicedData = filterData.slice(
        rows * activePage - rows,
        rows * activePage,
      );
      setSurveyData(slicedData);
      setTotalPages(Math.ceil(filterData.length / rows));
    }
  }, [activePage, rows, status]);

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
      <div
        className={`${'flex items-center gap-[15px] h-[42px] px-[14px] border border-[#CCDCE8] '} 
        ${'rounded-lg font-inter font-[500] text-[14px] text-[#585D69] cursor-pointer'}`}
      >
        <p>{`${rows} rows`}</p>
        <RiArrowDownSLine size={20} color='#585D69' />
      </div>
    ),
    [rows],
  );

  const DropdownItem = useCallback(
    () => (
      <div
        className={`${'flex-col py-[8px] px-[14px] font-inter font-[500]'} 
          ${'border border-[#CCDCE8] text-[14px] rounded-lg'}`}
      >
        <div
          className={`mb-[5px] cursor-pointer p-[10px] rounded-lg ${
            rows === 5 && 'bg-[#F2F5F9]'
          }`}
          onClick={handle5rows}
        >
          5 rows
        </div>
        <div
          className={`cursor-pointer p-[10px] rounded-lg ${
            rows === 10 && 'bg-[#F2F5F9]'
          }`}
          onClick={handle10rows}
        >
          10 rows
        </div>
      </div>
    ),
    [handle10rows, handle5rows, rows],
  );

  return (
    <DashboardLayout>
      <DashboardHeader title='Surveys' name='Andrew30' />
      <div className='px-[20px] mt-[24px] mb-[150px]'>
        <div className='flex justify-between'>
          <div>
            <SurveyTab
              text='All'
              className={`rounded-l-lg ${
                status === 'Approved' && 'border-r-0'
              }`}
              onClick={handleTab}
              isActive={status === 'All'}
            />
            <SurveyTab
              text='Approved'
              className={`${status === 'Approved' ? 'border-x' : 'border-x-0'}`}
              onClick={handleTab}
              isActive={status === 'Approved'}
            />
            <SurveyTab
              text='Pending'
              className={`rounded-r-lg ${
                status === 'Approved' && 'border-l-0'
              }`}
              onClick={handleTab}
              isActive={status === 'Pending'}
            />
          </div>
          <div
            className={`${'flex items-center h-[42px] px-[14px] border border-[#CCDCE8]'} 
            ${'rounded-lg font-inter font-[500] text-[14px] text-[#585D69]'}`}
          >
            <BsCalendar4Event size={18} color='#585D69' />
            <p className='ml-[10px]'>Jan 1, 2022 - Feb 2, 2022</p>
          </div>
        </div>
        <SurveyTable data={surveyData} />
        <div className='w-[100%] flex items-center justify-between mt-[24px]'>
          <div className='flex gap-[12px] items-center'>
            <p className='font-inter font-[500] text-[14px] text-[#282F3E]'>
              Show
            </p>
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
