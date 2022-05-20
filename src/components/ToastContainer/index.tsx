import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';

import List from '@ra/components/List';
import Toast from '@components/Toast';
import {rootState} from '@store/rootReducer';

const keyExtractor = (item: {id: string}) => item.id;

export default function ToastContainer() {
  const {
    notification: {
      toasts,
    },
  } = useSelector((state: rootState) => state);

  const renderToasts = useCallback(
    ({item}) => <Toast key={item.id} id={item.id} type={item.type} message={item.message} />,
    [],
  );

  const renderEmpty = useCallback(
    () => <p className='w-0 h-0 hidden'>Empty component</p>,
    [],
  );

  return (
    <div className='absolute top-10 w-full z-50'>
      <List
        data={toasts}
        className='max-w-xl mx-auto'
        renderItem={renderToasts}
        EmptyComponent={renderEmpty}
        keyExtractor={keyExtractor}
      />
    </div>
  );
}
