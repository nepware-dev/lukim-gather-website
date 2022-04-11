import {store} from '../store';

import {
  setLogin,
  setUser,
  setToken,
  setRefreshToken,
  setLogout,
} from '../store/slices/auth';

const {dispatch} = store;

export const dispatchLogin = async (accessToken: string, refreshToken: string, user: object) => {
  dispatch(setToken(accessToken));
  setRefreshToken(refreshToken);
  dispatch(setUser(user));
  dispatch(setLogin());
};

export const dispatchLogout = () => {
  dispatch(setLogout());
};
