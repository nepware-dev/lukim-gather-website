/* eslint-disable no-param-reassign */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AuthState, UserType} from '../types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: '', firstName: '', lastName: '', email: '', isStaff: false,
  },
  token: null,
  refreshToken: null,
  idToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state: AuthState) => {
      state.isAuthenticated = true;
    },
    setUser: (state: AuthState, {payload}: PayloadAction<UserType>) => {
      state.user = payload;
    },
    setToken: (state: AuthState, {payload}: PayloadAction<string>) => {
      state.token = payload;
    },
    setRefreshToken: (state: AuthState, {payload}: PayloadAction<string>) => {
      state.refreshToken = payload;
    },
    setIdToken: (state: AuthState, {payload}: PayloadAction<string>) => {
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
