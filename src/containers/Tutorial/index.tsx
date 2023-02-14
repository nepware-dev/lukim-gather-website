import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {gql, useQuery} from '@apollo/client';

import Layout from '@components/Layout';
import TopicCard, {ChildTopicCard} from '@components/SupportCategoryCard';
import FaqAccordion from '@components/FaqAccordion';

import useSupportCategory from '@hooks/useSupportCategory';

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
  const contentRef = useRef<HTMLElement>();
  const topicRef = useRef();
  const {data, loading} = useQuery(GET_TUTORIAL);

  const [filterCategory, setFilterCategory] = useState({treeId: null, childCategory: null});
  const [searchedData, setSearchedData] = useState<string>('');

  const {parentCategory, childCategory} = useSupportCategory(filterCategory?.treeId);

  const filteredData = useMemo(() => {
    if (filterCategory?.treeId) {
      const dt = data?.tutorial?.filter(
        (el: {
          category: {title: string; treeId: number}
        }) => el?.category?.treeId === filterCategory?.treeId,
      );
      return filterCategory?.childCategory
        ? dt?.filter((el: any) => el?.category?.title === filterCategory?.childCategory) : dt;
    }
    return data?.tutorial?.filter((el: {
          [s: string]: unknown;
        } | ArrayLike<unknown>) => Object.values(el)
      .join('')
      .toLowerCase()
      .includes(searchedData));
  }, [
    data?.tutorial,
    filterCategory?.childCategory,
    filterCategory?.treeId,
    searchedData,
  ]);

  const handleClickSearch = useCallback(() => {
    contentRef?.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  const handleSearchChange = useCallback((e) => {
    setFilterCategory({treeId: null, childCategory: null});
    setSearchedData(e.target.value.toLowerCase());
  }, []);

  const handleClickTopic = useCallback((item: any) => {
    if (filterCategory?.treeId === item?.treeId) {
      setFilterCategory({treeId: null, childCategory: null});
    } else {
      setFilterCategory({treeId: item?.treeId, childCategory: null});
    }
  }, [filterCategory]);

  const renderTopic = useCallback(({item}) => (
    <TopicCard
      isActive={item?.treeId === filterCategory?.treeId}
      item={item}
      onClick={handleClickTopic}
    />
  ), [filterCategory?.treeId, handleClickTopic]);

  const handleClickChildCategory = useCallback((item: any) => {
    if (filterCategory?.childCategory === item.title) {
      setFilterCategory({...filterCategory, childCategory: null});
    } else {
      setFilterCategory({...filterCategory, childCategory: item.title});
    }
  }, [filterCategory]);

  const renderChild = useCallback(({item}) => (
    <ChildTopicCard
      item={item}
      onClick={handleClickChildCategory}
      isActive={item.title === filterCategory.childCategory}
    />
  ), [filterCategory.childCategory, handleClickChildCategory]);

  const renderContent = useCallback(
    ({item}) => <FaqAccordion item={item} />,
    [],
  );

  return (
    <Layout isContainer={false} isDarkNavbar>
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
          <List
            ref={topicRef}
            data={parentCategory || []}
            className={classes.topicList}
            renderItem={renderTopic}
            keyExtractor={keyExtractor}
            EmptyComponent={<div />}
          />
          {childCategory?.parent?.children.length > 0 && (
            <List
              ref={topicRef}
              data={childCategory?.parent?.children || []}
              className={classes.topicList}
              renderItem={renderChild}
              keyExtractor={keyExtractor}
              EmptyComponent={<div />}
            />
          )}
        </div>
        <div className={classes.bgContentWrapper}>
          <List
            ref={contentRef}
            data={filteredData || data?.tutorial || []}
            className={classes.bgContent}
            renderItem={renderContent}
            keyExtractor={keyExtractor}
            loading={loading}
            EmptyComponent={<p>No data found!</p>}
          />
        </div>
      </section>
    </Layout>
  );
};

export default Tutorial;
