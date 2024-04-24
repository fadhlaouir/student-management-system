/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Config
import { API_ENDPOINT } from '../common/config';

// fetch All question and answer
export const fetchAllCompanies = createAsyncThunk('companies/fetchAllCompanies', async (id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'get',
      url: `${API_ENDPOINT}/v1/api/companys`,
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

// fetch single question and answer object
export const fetchCompany = createAsyncThunk('companies/fetchCompany', async (id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'get',
      url: `${API_ENDPOINT}/v1/api/companys/${id}`,
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

// Create new question and answer
export const createCompnay = createAsyncThunk('companies/createCompnay', async (data, { rejectWithValue }) => {
  try {
    const config = {
      method: 'post',
      url: `${API_ENDPOINT}/v1/api/company`,
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

// Update questionAndAnswer
export const updateCompany = createAsyncThunk('companies/updateCompany', async (data, { rejectWithValue }) => {
  try {
    const config = {
      method: 'put',
      url: `${API_ENDPOINT}/v1/api/companys/${data._id}`,
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

// Delete questionAndAnswer
export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (_id, { rejectWithValue }) => {
  try {
    const config = {
      method: 'delete',
      url: `${API_ENDPOINT}/v1/api/companys/${_id}`,
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

// Companies slice
const Companies = createSlice({
  name: 'Companies',
  initialState: {
    companies: [],
    company: null,
    loading: false,
  },
  extraReducers: {
    [fetchAllCompanies.fulfilled]: (state, action) => {
      state.companies = action.payload;
      state.loading = false;
    },
    [fetchAllCompanies.pending]: (state) => {
      state.loading = true;
    },
    [fetchCompany.fulfilled]: (state, action) => {
      state.company = action.payload;
      state.loading = false;
    },
    [fetchCompany.pending]: (state) => {
      state.loading = true;
    },
  },
});

export default Companies.reducer;

// Selectors
export const selectAllCompanies = (state) => state.Companies;
export const selectCompany = (state) => state.Companies.company;
export const selectCompanyLoading = (state) => state.Companies.loading;
