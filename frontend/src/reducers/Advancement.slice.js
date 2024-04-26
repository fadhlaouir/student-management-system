/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Config
import { API_ENDPOINT } from '../common/config';

export const fetchAllAdvancements = createAsyncThunk(
  'advancement/fetchAllAdvancements',
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        method: 'get',
        url: `${API_ENDPOINT}/v1/api/advancements`,
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

export const fetchAdvancement = createAsyncThunk('advancement/fetchAdvancement', async (id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'get',
      url: `${API_ENDPOINT}/v1/api/advancements/${id}`,
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

export const createAdvancement = createAsyncThunk(
  'advancement/createAdvancement',
  async (data, { rejectWithValue }) => {
    try {
      const config = {
        method: 'post',
        url: `${API_ENDPOINT}/v1/api/advancement`,
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

export const updateAdvancement = createAsyncThunk(
  'advancement/updateAdvancement',
  async (data, { rejectWithValue }) => {
    try {
      const config = {
        method: 'put',
        url: `${API_ENDPOINT}/v1/api/advancements/${data._id}`,
        data,
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

export const deleteAdvancement = createAsyncThunk('advancement/deleteAdvancement', async (_id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'delete',
      url: `${API_ENDPOINT}/v1/api/advancements/${_id}`,
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

const Advancement = createSlice({
  name: 'Advancement',
  initialState: {
    advancements: [],
    advancement: null,
    loading: false,
  },
  extraReducers: {
    [fetchAllAdvancements.fulfilled]: (state, action) => {
      state.advancements = action.payload;
      state.loading = false;
    },
    [fetchAllAdvancements.pending]: (state) => {
      state.loading = true;
    },
    [fetchAdvancement.fulfilled]: (state, action) => {
      state.advancement = action.payload;
      state.loading = false;
    },
    [fetchAdvancement.pending]: (state) => {
      state.loading = true;
    },
  },
});

export default Advancement.reducer;

// Selectors
export const selectAllAdvencements = (state) => state.Advancement?.advancements;
export const selectAdvancement = (state) => state.Advancement.advancement;
export const selectAdvancementLoading = (state) => state.Advancement.loading;
