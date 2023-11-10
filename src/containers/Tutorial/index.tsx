import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {gql, useQuery} from '@apollo/client';

import {ChildTopicCard} from '@components/SupportCategoryCard';
import FaqAccordion from '@components/FaqAccordion';

import List from '@ra/components/List';

import classes from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_TUTORIAL = gql`
  query{
    tutorial {
      id
      question
      answer
      category {
        id
        title
        treeId
      }
    }
  }
`;

const Tutorial = () => {
  const contentRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef();
  const {data, loading} = useQuery(GET_TUTORIAL);

  const [filterCategory, setFilterCategory] = useState<any>();
  const [searchedData, setSearchedData] = useState<string>('');

  const topicList = useMemo(() => {
    const dt = data?.tutorial.map((item: any) => ({
      id: item?.category?.id,
      title: item?.category?.title,
    }));
    return dt?.filter(
      (obj: any, index: any) => index === dt.findIndex((o: any) => obj.title === o.title),
    );
  }, [data?.tutorial]);

  const handleClickSearch = useCallback(() => {
    contentRef?.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  const handleSearchChange = useCallback((e) => {
    setFilterCategory(null);
    setSearchedData(e.target.value.toLowerCase());
  }, []);

  const handleClickChildCategory = useCallback((item: any) => {
    setFilterCategory(filterCategory === item?.id ? null : item?.id);
  }, [filterCategory]);

  const tutorialData = useMemo(() => {
    if (filterCategory) {
      return data?.tutorial?.filter(
        (el: any) => el?.category?.id === filterCategory,
      );
    }
    if (searchedData) {
      return data?.tutorial?.filter((el: {
          [s: string]: unknown;
        } | ArrayLike<unknown>) => Object.values(el)
        .join('')
        .toLowerCase()
        .includes(searchedData));
    }
    return data?.tutorial;
  }, [data?.tutorial, filterCategory, searchedData]);

  const renderChild = useCallback(({item}) => (
    <ChildTopicCard
      item={item}
      onClick={handleClickChildCategory}
      isActive={item.id === filterCategory}
    />
  ), [filterCategory, handleClickChildCategory]);

  const renderContent = useCallback(
    ({item}) => <FaqAccordion item={item} />,
    [],
  );

  return (
    <section className={classes.content}>
      <div className={classes.tutorialHeader}>
        <h2 className={classes.heading}>
          Tutorials
        </h2>
        <div className={classes.inputWrapper}>
          <input
            placeholder='Search any tutorials'
            onChange={handleSearchChange}
            className={classes.input}
          />
          <button
            type='button'
            className={classes.button}
            onClick={handleClickSearch}
            disabled={!searchedData}
          >
            Search
          </button>
        </div>
        {topicList?.length > 0 && (
          <List
            ref={topicRef}
            data={topicList}
            className={classes.topicList}
            renderItem={renderChild}
            keyExtractor={keyExtractor}
            EmptyComponent={<div />}
          />
        )}
      </div>
      <div className={classes.bgContentWrapper} ref={contentRef}>
        <List
          data={tutorialData}
          className={classes.bgContent}
          renderItem={renderContent}
          keyExtractor={keyExtractor}
          loading={loading}
          EmptyComponent={<p>No data found!</p>}
        />
      </div>
    </section>
  );
};

export default Tutorial;
