import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';
import parse from 'html-react-parser';

import DashboardHeader from '@components/DashboardHeader';

import organizationPlaceholder from '@images/organization-placeholder.svg';
import {RiShareBoxLine} from 'react-icons/ri';

import classes from './styles';

const GET_ORGANIZATION = gql`
query Organization ($id: Float) {
    organizations(id: $id) {
      id
      title
      title
      acronym
      description
      logo
      email
      phoneNumber
      pointOfContact
      website
      address
      membersCount
    }
  }
`;

const OrganizationDetails = () => {
  const {id} = useParams();
  const {data} = useQuery(GET_ORGANIZATION, {
    variables: {id: Number(id)},
  });
  return (
    <>
      <DashboardHeader title='Organization detail' />
      <section className={classes.section}>
        <Link to='/organization' className={classes.backWrapper}>
          <span className='material-symbols-rounded text-[#101828]'>
            arrow_back
          </span>
          <p className={classes.backTitle}>Back to organizations</p>
        </Link>
        <div className={classes.itemCard}>
          <div className={classes.itemHeader}>
            <div className={classes.logoWrapper}>
              <img
                className={classes.logo}
                src={data?.organizations[0]?.logo || organizationPlaceholder}
                alt={data?.organizations[0]?.title.split(' ')[0]}
              />
            </div>
            <div className='divide-dashed'>
              <h2 className={classes.title}>{data?.organizations[0]?.title || 'N/A'}</h2>
              <div className={classes.infoWrapper}>
                <div className={classes.info}>
                  <h5 className={classes.infoHeading}>FOCAL POINT</h5>
                  <p className={classes.infoData}>{data?.organizations[0]?.pointOfContact || 'N/A'}</p>
                </div>
                <hr className={classes.seperator} />
                <div className={classes.info}>
                  <h5 className={classes.infoHeading}>NUMBER OF MEMBER</h5>
                  <p className={classes.infoData}>{data?.organizations[0]?.membersCount}</p>
                </div>
              </div>
            </div>
          </div>
          <p className={classes.description}>
            {parse(data?.organizations[0]?.description || 'N/A')}
          </p>
          <div className='mb-6'>
            <h4 className={classes.contactHeading}>WEBSITE</h4>
            <a href={data?.organizations[0]?.website} className={classes.website} target='_blank' rel='noreferrer'>
              {data?.organizations[0]?.website || 'N/A'}
              <RiShareBoxLine color='#EC6D25' size={20} />
            </a>
          </div>
          <h4 className={classes.contactHeading}>CONTACT</h4>
          <div className={classes.contactWrapper}>
            <div className={classes.contactItem}>
              <span className='material-symbols-rounded text-[#888C94] text-base'>
                call
              </span>
              <h6 className={classes.contactTitle}>Phone:</h6>
              <p className={classes.contactValue}>{data?.organizations[0]?.phoneNumber || 'N/A'}</p>
            </div>
            <div className={classes.contactItem}>
              <span className='material-symbols-rounded text-[#888C94] text-base'>
                mail
              </span>
              <h6 className={classes.contactTitle}>Email:</h6>
              <p className={classes.contactValue}>{data?.organizations[0]?.email || 'N/A'}</p>
            </div>
            <div className={classes.contactItem}>
              <span className='material-symbols-rounded text-[#888C94] text-base'>
                inbox
              </span>
              <h6 className={classes.contactTitle}>Postal Address:</h6>
              <p className={classes.contactValue}>{data?.organizations[0]?.address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrganizationDetails;
