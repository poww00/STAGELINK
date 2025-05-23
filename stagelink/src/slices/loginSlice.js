import { createSlice } from '@reduxjs/toolkit';

// Redux 상태 관리
const loginSlice = createSlice({
  name: 'login',
  initialState: { 
    isLogin: false,
    email: '',
    nickname: '',
    userId: ''
  },
  reducers: {
    login: (state, action) => {
        state.isLogin = true;
        state.email = action.payload.email;
        state.nickname = action.payload.nickname;
        state.userId = action.payload.userId;
    },
    logout: (state) => {
        state.isLogin = false;
        state.email = '';
        state.nickname = '';
        state.userId = '';
    }
  }
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
