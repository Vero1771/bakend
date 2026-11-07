import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePage: 'landing',
  products: [],
  categories: [],
  suppliers: [],
  dashboard: null,
  loading: true,
  error: '',
  search: '',
  notice: null
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setPage: (state, action) => { state.activePage = action.payload; },
    setCatalog: (state, action) => {
      state.products = action.payload.products;
      state.categories = action.payload.categories;
      state.suppliers = action.payload.suppliers;
      state.dashboard = action.payload.dashboard;
      state.loading = false;
      state.error = '';
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
    setSearch: (state, action) => { state.search = action.payload; },
    setNotice: (state, action) => { state.notice = action.payload; },
    clearNotice: (state) => { state.notice = null; }
  }
});

export const { setPage, setCatalog, setLoading, setError, setSearch, setNotice, clearNotice } = catalogSlice.actions;
export const store = configureStore({ reducer: { catalog: catalogSlice.reducer } });
