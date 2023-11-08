import React, {useCallback, useRef} from 'react';
import {Link} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';
import {useSelector} from 'react-redux';

import DashboardHeader from '@components/DashboardHeader';

import List from '@ra/components/List';

import cs from '@utils/cs';
import {rootState} from '@store/rootReducer';

import organizationPlaceholder from '@images/organization-placeholder.svg';

import classes from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_ORGANIZATIONS = gql`
  query Organizations($id: Float) {
    organizations(members_Id: $id) {
      id
      title
      logo
    }
  }
`;

const Organization = () => {
  const {
    auth: {
      user: {id: userId},
    },
  } = useSelector((state: rootState) => state);
  const ref = useRef();
  const {data} = useQuery(GET_ORGANIZATIONS);
  const {data: myOrganizations} = useQuery(GET_ORGANIZATIONS, {
    variables: {id: Number(userId)},
  });
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
          <span className='material-symbols-rounded text-[#0a52a1] bg-color-white rounded-3xl p-1'>
            arrow_forward
          </span>
        </div>
      </Link>
    ),
    [],
  );
  const Props = {
    className: 'w-[100%] flex flex-wrap gap-y-3 gap-x-[1%] mt-[16px] md:gap-x-[2%] lg:gap-x-[2%] xl:gap-x-[1.33%]',
    renderItem: renderItems,
    keyExtractor,
  };
  const MyOrganizationProps = {...Props, data: myOrganizations?.organizations || []};
  const AllOrganizationProps = {...Props, data: data?.organizations || []};
  return (
    <>
      <DashboardHeader title='Organization' />
      <div className={classes.section}>
        <div className={classes.header}>
          <h1 className={classes.title}>My Organization</h1>
        </div>
        <section className='w-screen md:w-[100%] '>
          <List
            ref={ref}
            {...MyOrganizationProps}
          />
        </section>
      </div>
      <div className={cs(classes.section, 'mb-[150px]')}>
        <div className={classes.header}>
          <h1 className={classes.title}>All Organization</h1>
        </div>
        <section className='w-screen md:w-[100%] '>
          <List
            ref={ref}
            {...AllOrganizationProps}
          />
        </section>
      </div>
    </>
  );
};

export default Organization;
