/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Config
import { API_ENDPOINT } from '../common/config';

// fetch All internshipRequest
export const fetchAllInternshipRequest = createAsyncThunk(
  'internshipRequest/fetchAllInternshipRequest',
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        method: 'get',
        url: `${API_ENDPOINT}/v1/api/internshipRequests`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      };
      const payload = await axios(config);
      return payload.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// fetch single internship object
export const fetchInternshipRequest = createAsyncThunk(
  'internshipRequest/fetchInternshipRequest',
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        method: 'get',
        url: `${API_ENDPOINT}/v1/api/internshipRequests/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      };

      const payload = await axios(config);
      return payload.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// Create new internship
export const createInternshipRequest = createAsyncThunk(
  'internshipRequest/createInternshipRequest',
  async (data, { rejectWithValue }) => {
    try {
      const config = {
        method: 'post',
        url: `${API_ENDPOINT}/v1/api/internshipRequest`,
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
  },
);

// Update internship
export const updateInternshipRequest = createAsyncThunk(
  'internshipRequest/updateInternshipRequest',
  async (data, { rejectWithValue }) => {
    try {
      const config = {
        method: 'put',
        url: `${API_ENDPOINT}/v1/api/internshipRequests/${data._id}`,
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
  },
);

// Delete internship
export const deleteInternshipRequest = createAsyncThunk(
  'internshipRequest/deleteInternshipRequest',
  async (_id, { rejectWithValue }) => {
    try {
      const config = {
        method: 'delete',
        url: `${API_ENDPOINT}/v1/api/internshipRequests/${_id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      };
      const payload = await axios(config);
      return payload.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// Internship slice
const InternshipRequest = createSlice({
  name: 'InternshipRequest',
  initialState: {
    internshipRequests: [],
    internshipRequest: null,
    loading: false,
  },
  extraReducers: {
    [fetchAllInternshipRequest.fulfilled]: (state, action) => {
      state.internshipRequests = action.payload;
      state.loading = false;
    },
    [fetchAllInternshipRequest.pending]: (state) => {
      state.loading = true;
    },
    [fetchInternshipRequest.fulfilled]: (state, action) => {
      state.internshipRequest = action.payload;
      state.loading = false;
    },
    [fetchInternshipRequest.pending]: (state) => {
      state.loading = true;
    },
  },
});

export default InternshipRequest.reducer;

// Selectors
export const selectAllInternshipRequests = (state) => state.InternshipRequest.internshipRequests;
export const selectInternshipRequest = (state) => state.InternshipRequest.internshipRequest;
export const selectInternshipRequestLoading = (state) => state.InternshipRequest.loading;
