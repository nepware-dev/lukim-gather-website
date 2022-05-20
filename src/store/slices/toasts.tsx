/* eslint-disable no-param-reassign */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ToastsState, ToastType} from '@store/types/toasts';

const initialState: ToastsState = {
  toasts: [],
};

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    AddToast: (state: ToastsState, {payload}: PayloadAction<ToastType>) => {
      state.toasts = [...state.toasts, payload];
    },
    DeleteToast: (state: ToastsState, {payload}: PayloadAction<string | number>) => {
      const updatedToasts = state.toasts.filter((e) => e.id !== payload);
      state.toasts = updatedToasts;
    },
  },
});

export const {AddToast, DeleteToast} = toastsSlice.actions;

export default toastsSlice.reducer;
