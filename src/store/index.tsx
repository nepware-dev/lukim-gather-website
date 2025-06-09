import {configureStore, Middleware} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './rootReducer';

const middlewares: Middleware[] = [];

if (import.meta.env.NODE_ENV === 'development') {
  import('redux-logger').then(({logger}) => {
    middlewares.push(logger);
  });
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
      ],
    },
  }).concat(middlewares),
});

const persistor = persistStore(store);

export {store, persistor};

export type RootState = ReturnType<typeof store.getState>;
