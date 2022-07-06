/* eslint-disable array-callback-return */
import React, {useCallback, useRef, useState} from 'react';
import {gql, useQuery} from '@apollo/client';

import List from '@ra/components/List';
import Layout from '@components/Layout';

import classes from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_RESOURCE = gql`
  query{
    resource {
      id
      title
      description
      resourceType
      attachment
    }
  }
`;

const Resource = () => {
  const ref = useRef();
  const {data} = useQuery(GET_RESOURCE);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedData, setSearchedData] = useState();

  const handleSearch = useCallback(() => {
    // eslint-disable-next-line max-len
    const filteredData = data?.resource.filter((el: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(el)
      .join('')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()));
    setSearchedData(filteredData);
  }, [data?.resource, searchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    handleSearch();
  }, [handleSearch]);

  const renderItems = useCallback(
    ({item}) => (
      <div key={item.id} className={classes.card}>
        <div>
          <h3 className={classes.cardTitle}>{item.title}</h3>
          <div className={classes.cardDescription}>
            {item.description}
          </div>
        </div>
        <div className='mt-5'>
          <a href={item.attachment} className={classes.cardButton}>Download</a>
        </div>
      </div>
    ),
    [],
  );

  const Props = {
    data: searchedData || data?.resource,
    className: classes.bgContent,
    renderItem: renderItems,
    keyExtractor,
  };
  return (
    <Layout>
      <section className={classes.content}>
        <div>
          <h2 className={classes.backgroundTitle}>
            Resource
          </h2>
          <input className={classes.input} onChange={handleSearchChange} placeholder='Search ...' />
        </div>
        <div className={classes.bgContentWrapper}>
          <List
            {...Props}
            ref={ref}
          />
        </div>
      </section>
    </Layout>

  );
};

export default Resource;
