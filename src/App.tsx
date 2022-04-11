import React, {BrowserRouter} from 'react-router-dom';
import {
  ApolloProvider, ApolloClient, InMemoryCache, createHttpLink,
} from '@apollo/client';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {setContext} from '@apollo/client/link/context';

import {store, persistor} from './store';
import Routes from './routes';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_BASE_URL,
});

const authLink = setContext((_, {headers}) => {
  const {
    auth: {token},
  } = store.getState();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
