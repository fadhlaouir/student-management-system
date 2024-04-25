/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Config
import { API_ENDPOINT } from '../common/config';

// fetch All internship
export const fetchAllInternship = createAsyncThunk('internship/fetchAllInternship', async (id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'get',
      url: `${API_ENDPOINT}/v1/api/internships`,
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

// fetch single internship object
export const fetchInternship = createAsyncThunk('internship/fetchInternship', async (id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'get',
      url: `${API_ENDPOINT}/v1/api/internships/${id}`,
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

// Create new internship
export const createInternship = createAsyncThunk('internship/createInternship', async (data, { rejectWithValue }) => {
  try {
    const config = {
      method: 'post',
      url: `${API_ENDPOINT}/v1/api/internship`,
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

// Update internship
export const updateInternship = createAsyncThunk('internship/updateInternship', async (data, { rejectWithValue }) => {
  try {
    const config = {
      method: 'put',
      url: `${API_ENDPOINT}/v1/api/internships/${data._id}`,
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

// Delete internship
export const deleteInternship = createAsyncThunk('internship/deleteInternship', async (_id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'delete',
      url: `${API_ENDPOINT}/v1/api/internships/${_id}`,
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

// Internship slice
const Internship = createSlice({
  name: 'Internship',
  initialState: {
    internships: [],
    internship: null,
    loading: false,
  },
  extraReducers: {
    [fetchAllInternship.fulfilled]: (state, action) => {
      state.internships = action.payload;
      state.loading = false;
    },
    [fetchAllInternship.pending]: (state) => {
      state.loading = true;
    },
    [fetchInternship.fulfilled]: (state, action) => {
      state.internship = action.payload;
      state.loading = false;
    },
    [fetchInternship.pending]: (state) => {
      state.loading = true;
    },
  },
});

export default Internship.reducer;

// Selectors
export const selectAllInternships = (state) => state.Internship;
export const selectInternship = (state) => state.Internship.internship;
export const selectInternshipLoading = (state) => state.Internship.loading;
