import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogin: false,
    nickname: '',
    userId: '',
    signupType:'',
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.nickname = action.payload.nickname;
      state.userId = action.payload.userId;
      state.signupType = action.payload.signupType;
    },
    logout: (state) => {
      state.isLogin = false;
      state.nickname = '';
      state.userId = '';
      state.signupType = '';
    }
  }
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
