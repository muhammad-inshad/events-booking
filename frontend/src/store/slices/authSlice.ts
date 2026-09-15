import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import api from '../../utils/axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!Cookies.get('accessToken'),
  status: 'idle',
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/user/me');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

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
      state.status = 'succeeded';
      
      Cookies.set('accessToken', action.payload.accessToken, { expires: 1 });
      if (action.payload.refreshToken) {
        Cookies.set('refreshToken', action.payload.refreshToken, { expires: 7 });
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
