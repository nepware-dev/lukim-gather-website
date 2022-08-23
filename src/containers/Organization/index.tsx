import React, {useCallback, useRef} from 'react';
import {Link} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';

import List from '@ra/components/List';

import organizationPlaceholder from '@images/organization-placeholder.svg';

const keyExtractor = (item: {id: string}) => item.id;

const GET_ORGANIZATIONS = gql`
  query {
    organizations {
      id
      title
      logo
    }
  }
`;

const Organization = () => {
  const ref = useRef();
  const {data} = useQuery(GET_ORGANIZATIONS);
  const renderItems = useCallback(
    ({item}) => (
      <Link
        to={`/organization/${item.id}`}
        className='rounded-lg w-[100%] md:w-[49%] lg:w-[32%] xl:w-[24%] border border-[#E7EEF6] flex flex-col justify-between'
      >
        <div className='p-[40px] flex justify-center align-center'>
          <img className='max-h-[115px]' src={item.logo || organizationPlaceholder} alt={item.title} />
        </div>
        <div className='cursor-pointer bg-[#F0F3F6] px-[12px] py-[16px] flex justify-between items-center gap-x-2'>
          <h4 className='font-semibold text-sm text-[#0a52a1]'>{item.title}</h4>
          <span className='material-symbols-rounded text-[#0a52a1] bg-[#fff] rounded-3xl p-1'>
            arrow_forward
          </span>
        </div>
      </Link>
    ),
    [],
  );
  const Props = {
    className: 'w-[100%] px-[20px] mt-[24px] mb-[150px] flex flex-wrap gap-y-3 gap-x-[1%] md:gap-x-[2%] lg:gap-x-[2%] xl:gap-x-[1.33%]',
    data: data?.organizations || [],
    renderItem: renderItems,
    keyExtractor,
  };
  return (
    <DashboardLayout>
      <DashboardHeader title='Organization' />
      <section className='w-screen md:w-[100%] '>
        <List
          ref={ref}
          {...Props}
        />
      </section>
    </DashboardLayout>
  );
};

export default Organization;
