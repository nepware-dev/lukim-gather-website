import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {gql, useQuery} from '@apollo/client';

import Layout from '@components/Layout';
import FaqAccordion from '@components/FaqAccordion';

import cs from '@ra/cs';
import List from '@ra/components/List';

import {CategoryType, GET_SUPPORT_CATEGORY} from '@containers/FAQ';

import classes from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_TUTORAL = gql`
  query{
    tutorial {
      id
      question
      answer
      category {
        id
      }
    }
  }
`;

const topicIcon = [
  {id: 2, icon: 'flag'},
  {id: 3, icon: 'description'},
  {id: 4, icon: 'build'},
  {id: 5, icon: 'person'},
];

const Tutorial = () => {
  const contentRef = useRef<HTMLElement>();
  const topicRef = useRef();
  const {data} = useQuery(GET_TUTORAL);
  const {data: category} = useQuery(GET_SUPPORT_CATEGORY, {
    variables: {id: Number(6)},
  });
  const [tutorialTopicId, setTutorialTopicId] = useState<number | null>(null);
  const [searchedData, setSearchedData] = useState<string>('');

  const filteredData = useMemo(() => (
    tutorialTopicId
      ? data?.tutorial.filter(
        (el: { category: {id: string} }) => el?.category?.id === tutorialTopicId.toString(),
      )
      : data?.tutorial.filter((el: {
    [s: string]: unknown;
  } | ArrayLike<unknown>) => Object.values(el)
        .join('')
        .toLowerCase()
        .includes(searchedData))), [data, tutorialTopicId, searchedData]);

  const handleClickSearch = useCallback(() => {
    contentRef?.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  const handleSearchChange = useCallback((e) => {
    setTutorialTopicId(null);
    setSearchedData(e.target.value.toLowerCase());
  }, []);

  const renderTopic = useCallback(({item}) => (
    <div
      className={cs(classes.topicCard, tutorialTopicId === item.id ? 'bg-[#00518B] border-[#fff]' : 'bg-[#0B4570] border-[#3B75B4]')}
      onClick={() => {
        if (tutorialTopicId === item.id) {
          setTutorialTopicId(null);
        } else {
          setTutorialTopicId(item.id);
          handleClickSearch();
        }
      }}
    >
      <span className={cs('material-symbols-rounded text-[28px] group-hover:text-color-white', tutorialTopicId === item.id ? 'text-[#fff]' : 'text-[#C7E5FB]')}>
        {item.icon}
      </span>
      <h6 className={classes.topicTitle}>{item.title}</h6>
    </div>
  ), [tutorialTopicId, handleClickSearch]);

  const renderContent = useCallback(
    ({item}) => <FaqAccordion key={item.id} question={item.question} answer={item.answer || 'N/A'} />,
    [],
  );

  const topic = category?.supportCategory.map(
    (item: CategoryType) => {
      const icon = topicIcon.find((iconItem) => (iconItem.id === Number(item.id)));
      return {...item, icon: icon?.icon};
    },
  );

  const topicProps = {
    data: topic || [],
    className: classes.topicList,
    renderItem: renderTopic,
    keyExtractor,
  };

  const contentProps = {
    data: filteredData || data?.tutorial,
    className: classes.bgContent,
    renderItem: renderContent,
    keyExtractor,
  };
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
            {...topicProps}
            ref={topicRef}
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
