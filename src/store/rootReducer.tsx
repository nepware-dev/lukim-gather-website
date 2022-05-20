import {combineReducers} from 'redux';

import authReducer from './slices/auth';
import toastsReducer from './slices/toasts';

const rootReducer = combineReducers({
  auth: authReducer,
  notification: toastsReducer,
});

export type rootState = ReturnType<typeof rootReducer>;
export default rootReducer;
