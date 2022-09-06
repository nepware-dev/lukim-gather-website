/* eslint-disable */
// @ts-nocheck

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  fromPromise,
  gql,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';

import {store} from '@store/index';
import {setLogout, setToken, setRefreshToken} from '@store/slices/auth';

const {dispatch} = store;

const resolvePendingRequests = () => {
  pendingRequests.map((callback: any) => callback());
  pendingRequests = [];
};

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_BASE_URL,
});

const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String) {
        refreshToken(refreshToken: $refreshToken) {
            token
            refreshToken
        }
    }
`;

let isRefreshing = false;
let pendingRequests: any = [];

const errorLink = onError(
  ({
    graphQLErrors, networkError, operation, forward,
  }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        const {
          auth: {refreshToken},
        } = store.getState();
        if (
          err?.message?.toLowerCase()
                        === 'error decoding signature'
                    && refreshToken
        ) {
          let _forward;
          if (!isRefreshing) {
            isRefreshing = true;
            _forward = fromPromise(
              client
                .mutate({
                  mutation: REFRESH_TOKEN,
                  variables: {
                    refreshToken,
                  },
                })
                .then(
                  ({
                    data: {refreshToken: refToken},
                  }) => {
                    if(refToken) {
                      dispatch(setToken(refToken.token));
                      dispatch(setRefreshToken(refToken.refreshToken));
                    }
                    return true;
                  },
                )
                .then(() => {
                  resolvePendingRequests();
                  return true;
                })
                .catch((error) => {
                  pendingRequests = [];
                  if(error?.message?.toLowerCase() === "invalid refresh token") {
                    dispatch(setLogout());
                  }
                  return false;
                })
                .finally(() => {
                  isRefreshing = false;
                }),
            );
          } else {
            _forward = fromPromise(
              new Promise((resolve) => {
                pendingRequests.push(resolve);
              }),
            );
          }
          return _forward.flatMap(() => forward(operation));
        }
        console.log(
          `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`,
        );
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  },
);

const authLink = setContext((operation, {headers}) => {
  const {
    auth: {token},
  } = store.getState();

  if (operation.operationName === 'RefreshToken') {
    return headers;
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
