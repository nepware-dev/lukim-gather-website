import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {gql, useQuery} from '@apollo/client';

import Layout from '@components/Layout';
import FaqAccordion from '@components/FaqAccordion';

import cs from '@ra/cs';
import List from '@ra/components/List';

import classes from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_FAQ = gql`
  query{
    frequentlyAskedQuestion {
      id
      question
      answer
      category {
        id
      }
    }
  }
`;

export const GET_SUPPORT_CATEGORY = gql`
  query SupportCategory($id: ID){
    supportCategory (parent: $id) {
      id
      icon
      title
    }
  }
`;

export type CategoryType = {
  id: string | number;
  title: string;
};

const Tutorial = () => {
  const contentRef = useRef<HTMLElement>();
  const topicRef = useRef();
  const {data, loading} = useQuery(GET_FAQ);
  const {data: category} = useQuery(GET_SUPPORT_CATEGORY, {
    variables: {id: Number(1)},
  });
  const [faqTopicId, setFaqTopicId] = useState<number | null>(null);
  const [searchedData, setSearchedData] = useState<string>('');

  const filteredData = useMemo(() => (
    faqTopicId
      ? data?.frequentlyAskedQuestion.filter(
        (el: { category: {id: string} }) => el?.category?.id === faqTopicId.toString(),
      )
      : data?.frequentlyAskedQuestion.filter((el: {
    [s: string]: unknown;
  } | ArrayLike<unknown>) => Object.values(el)
        .join('')
        .toLowerCase()
        .includes(searchedData))), [data, faqTopicId, searchedData]);

  const handleClickSearch = useCallback(() => {
    contentRef?.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  const handleSearchChange = useCallback((e) => {
    setFaqTopicId(null);
    setSearchedData(e.target.value.toLowerCase());
  }, []);

  const renderTopic = useCallback(({item}) => (
    <div
      className={cs(classes.topicCard, faqTopicId === item.id ? 'bg-[#00518B] border-[#fff]' : 'bg-[#0B4570] border-[#3B75B4]')}
      onClick={() => {
        if (faqTopicId === item.id) {
          setFaqTopicId(null);
        } else {
          setFaqTopicId(item.id);
          handleClickSearch();
        }
      }}
    >
      <span className={cs('material-symbols-rounded text-[28px] group-hover:text-color-white', faqTopicId === item.id ? 'text-[#fff]' : 'text-[#C7E5FB]')}>
        {item.icon}
      </span>
      <h6 className={classes.topicTitle}>{item.title}</h6>
    </div>
  ), [faqTopicId, handleClickSearch]);

  const renderContent = useCallback(
    ({item}) => <FaqAccordion key={item.id} question={item.question} answer={item.answer || 'N/A'} />,
    [],
  );

  const topicProps = {
    data: category?.supportCategory || [],
    className: classes.topicList,
    renderItem: renderTopic,
    keyExtractor,
  };

  const contentProps = {
    data: filteredData || data?.frequentlyAskedQuestion,
    className: classes.bgContent,
    renderItem: renderContent,
    keyExtractor,
    loading,
    EmptyComponent: <p>No data found!</p>,
  };
  return (
    <Layout isContainer={false} isDarkNavbar>
      <section className={classes.content}>
        <div className={classes.faqHeader}>
          <h2 className={classes.heading}>
            Frequently Asked Questions
          </h2>
          <div className={classes.inputWrapper}>
            <input
              placeholder='Ask any questions'
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
            {...topicProps}
            ref={topicRef}
            EmptyComponent={<div />}
          />
        </div>
        <div className={classes.bgContentWrapper}>
          <List
            {...contentProps}
            ref={contentRef}
          />
        </div>
      </section>
    </Layout>
  );
};

export default Tutorial;
