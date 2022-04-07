/* eslint-disable no-param-reassign */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AuthState} from '../types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  user: {},
  token: null,
  refreshToken: null,
  idToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state) => {
      state.isAuthenticated = true;
    },
    setUser: (state, {payload}: PayloadAction<object>) => {
      state.user = payload;
    },
    setToken: (state, {payload}: PayloadAction<string>) => {
      state.token = payload;
    },
    setRefreshToken: (state, {payload}: PayloadAction<string>) => {
      state.refreshToken = payload;
    },
    setIdToken: (state, {payload}: PayloadAction<string>) => {
      state.idToken = payload;
    },
    setLogout: () => initialState,
  },
});

export const {
  setLogin,
  setUser,
  setToken,
  setRefreshToken,
  setIdToken,
  setLogout,
} = authSlice.actions;

export default authSlice.reducer;
