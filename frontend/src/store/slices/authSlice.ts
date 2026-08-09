import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('user');
const initialState: AuthState = {
  user: savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null,
  isAuthenticated: !!Cookies.get('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      
      Cookies.set('accessToken', action.payload.accessToken, { expires: 1 });
      if (action.payload.refreshToken) {
        Cookies.set('refreshToken', action.payload.refreshToken, { expires: 7 });
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
