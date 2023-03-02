import React, {useCallback, useRef} from 'react';
import {Link} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';

import List from '@ra/components/List';

import cs from '@utils/cs';
import organizationPlaceholder from '@images/organization-placeholder.svg';

import classes from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_PROJECTS = gql`
  query Projects($tab: String) {
    projects(tab: $tab) {
      id
      title
    }
  }
`;

const Project = () => {
  const ref = useRef();
  const {data} = useQuery(GET_PROJECTS);
  const {data: myProjects, loading: loadingProjects} = useQuery(GET_PROJECTS, {
    variables: {tab: 'my_project'},
  });
  const renderItems = useCallback(
    ({item}) => (
      <Link
        to={`/project/${item.id}`}
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
  const MyOrganizationProps = {...Props, data: myProjects?.projects || []};
  const AllOrganizationProps = {...Props, data: data?.projects || []};
  return (
    <DashboardLayout>
      <DashboardHeader title='Projects' />
      <div className={classes.section}>
        <div className={classes.header}>
          <h1 className={classes.title}>My Projects</h1>
        </div>
        <section className='w-screen md:w-[100%] '>
          <List
            ref={ref}
            loading={loadingProjects}
            {...MyOrganizationProps}
          />
        </section>
      </div>
      <div className={cs(classes.section, 'mb-[150px]')}>
        <div className={classes.header}>
          <h1 className={classes.title}>All Projects</h1>
        </div>
        <section className='w-screen md:w-[100%] '>
          <List
            ref={ref}
            loading={loadingProjects}
            {...AllOrganizationProps}
          />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Project;
