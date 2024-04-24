/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINT } from '../common/config';

export const createUser = createAsyncThunk('user/createUser', async (data, { rejectWithValue }) => {
  try {
    const config = {
      method: 'post',
      url: `${API_ENDPOINT}/v1/api/auth/register`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      data,
    };

    const payload = await axios(config);
    return payload.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', async () => {
  const config = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    url: `${API_ENDPOINT}/v1/api/users`,
  };
  const payload = await axios(config);
  return payload.data;
});

export const fetchUser = createAsyncThunk('user/fetchUser', async (_id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'get',
      url: `${API_ENDPOINT}/v1/api/users/${_id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    };

    const payload = await axios(config);
    return payload.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateUser = createAsyncThunk('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const config = {
      method: 'put',
      url: `${API_ENDPOINT}/v1/api/users/${data._id}`,
      data: data.fields,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    };
    const payload = await axios(config);
    return payload.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (_id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'delete',
      url: `${API_ENDPOINT}/v1/api/users/${_id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (err) {
    return rejectWithValue({ error: err.message });
  }
});

// Login Slice
const User = createSlice({
  name: 'User',
  initialState: {
    user: null,
    users: [],
    loading: false,
  },
  extraReducers: {
    [fetchAllUsers.fulfilled]: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    [fetchAllUsers.pending]: (state) => {
      state.loading = true;
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [fetchUser.pending]: (state) => {
      state.loading = true;
    },
  },
});

export default User.reducer;

// Selectors
export const selectAllUsers = (state) => state.User.users;
export const selectUser = (state) => state.User.user;
export const selectUserLoading = (state) => state.User.loading;
