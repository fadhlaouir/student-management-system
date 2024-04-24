/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_ENDPOINT } from '../common/config';
/**
 * Helper for the redundant initial state
 */
const getInitialState = () => ({
  user: null,
  emailToReset: null,
  userRecoverData: null,
  activeAccountToken: undefined,
  loadig: false,
});

/**
 * Creates a login session
 */
export const $login = createAsyncThunk('Session/login', async (data, { rejectWithValue }) => {
  try {
    const request = {
      method: 'post',
      url: `${API_ENDPOINT}/v1/api/auth/login`,
      data,
    };
    const payload = await axios(request);

    return payload.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

/**
 * Forgot password
 * Sending email to reset password
 */
export const $forgotPassword = createAsyncThunk('Session/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const request = {
      method: 'post',
      url: `${API_ENDPOINT}/v1/api/auth/user/forget-password`,
      data,
    };
    const payload = await axios(request);

    return payload.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

/**
 * Reset password
 */
export const $resetPassword = createAsyncThunk('Session/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const request = {
      method: 'post',
      url: `${API_ENDPOINT}/v1/api/auth/user/reset-password/${data.token}`,
      data,
    };
    const payload = await axios(request);

    return payload.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

/**
 * Active user account
 */
export const $activeAccount = createAsyncThunk('Session/resetPassword', async (token, { rejectWithValue }) => {
  try {
    const request = {
      method: 'post',
      url: `${API_ENDPOINT}/v1/api/account/${token}/enable`,
      token,
    };
    const payload = await axios(request);

    return payload.token;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Session Slice
const Session = createSlice({
  name: 'Session',
  initialState: getInitialState(),
  reducers: {
    $logout() {
      const stateUpdate = getInitialState();
      localStorage.removeItem('access_token');
      return stateUpdate;
    },
  },
  extraReducers: {
    // Login ($login)
    [$login.fulfilled]: (state, action) => {
      const stateUpdate = { ...state };
      const { token, ...user } = action.payload;
      // Persist auth token
      localStorage.setItem('access_token', token);
      stateUpdate.user = user.user;
      stateUpdate.loading = false;
      return stateUpdate;
    },
    [$login.pending]: (state) => {
      const stateUpdate = { ...state };
      stateUpdate.loading = true;
      return stateUpdate;
    },
    [$login.rejected]: (state) => {
      const stateUpdate = { ...state };
      stateUpdate.loading = false;
      return stateUpdate;
    },
    [$forgotPassword.fulfilled]: (state, action) => {
      state.emailToReset = action.payload;
      state.loading = false;
    },
    [$forgotPassword.pending]: (state) => {
      state.loading = true;
    },
    [$forgotPassword.rejected]: (state) => {
      const stateUpdate = { ...state };
      stateUpdate.loading = false;
      return stateUpdate;
    },
    [$resetPassword.fulfilled]: (state, action) => {
      state.userRecoverData = action.payload;
      state.loading = false;
    },
    [$resetPassword.pending]: (state) => {
      state.loading = true;
    },
    [$resetPassword.rejected]: (state) => {
      const stateUpdate = { ...state };
      stateUpdate.loading = false;
      return stateUpdate;
    },
    [$activeAccount.fulfilled]: (state, action) => {
      state.activeAccountToken = action.payload;
      state.loading = false;
    },
    [$activeAccount.pending]: (state) => {
      state.loading = true;
    },
    [$activeAccount.rejected]: (state) => {
      const stateUpdate = { ...state };
      stateUpdate.loading = false;
      return stateUpdate;
    },
  },
});

export default Session.reducer;

// Simple actions
export const { $logout } = Session.actions;

// Selectors
export const selectSessionUser = (state) => state.Session.user;
export const selectSessionRoles = (state) => state.Session.roles;
export const selectSessionLoading = (state) => state.Session.loading;
export const selectActiveAccountToken = (state) => state.Session.activeAccountToken;
