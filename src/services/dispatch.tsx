import {AddToast, DeleteToast} from '@store/slices/toasts';
import {UserType} from '@store/types/auth';
import {
  setLogin,
  setUser,
  setToken,
  setRefreshToken,
  setLogout,
} from '@store/slices/auth';
import {store} from '../store';
import client from './client';

const {dispatch} = store;

export const dispatchLogin = async (accessToken: string, refreshToken: string, user: UserType) => {
  dispatch(setToken(accessToken));
  dispatch(setRefreshToken(refreshToken));
  dispatch(setUser(user));
  dispatch(setLogin());
};

export const dispatchLogout = () => {
  dispatch(setLogout());
  client.clearStore();
};

export const dispatchAddToast = (type: string, message: string, id: string | number) => {
  dispatch(AddToast({type, message, id}));
};

export const dispatchDeleteToast = (id: string | number) => {
  dispatch(DeleteToast(id));
};
