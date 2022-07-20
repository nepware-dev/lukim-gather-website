import React, {useCallback, useRef} from 'react';
import {gql, useQuery} from '@apollo/client';

import FaqAccordion from '@components/FaqAccordion';
import List from '@ra/components/List';

import Layout from '@components/Layout';
import classes from './styles';

const keyExtractor = (item: {id: string}) => item.id;

const GET_FAQ = gql`
  query{
    frequentlyAskedQuestion {
      id
      question
      answer
    }
  }
`;

const FAQ = () => {
  const ref = useRef();
  const {data} = useQuery(GET_FAQ);
  const renderToasts = useCallback(
    ({item}) => <FaqAccordion key={item.id} question={item.question} answer={item.answer} />,
    [],
  );
  const Props = {
    data: data?.frequentlyAskedQuestion || [],
    className: classes.bgContent,
    renderItem: renderToasts,
    keyExtractor,
  };
  return (
    <Layout>
      <section className={classes.content}>
        <h2 className={classes.backgroundTitle}>
          Frequently Asked Questions
        </h2>
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

export default FAQ;
