// src/slices/loginSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogin: false,
    nickname: '',
    userId: ''
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.nickname = action.payload.nickname;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.isLogin = false;
      state.nickname = '';
      state.userId = '';
    }
  }
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
