import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IAvailableCar, ICarsSlice } from "../../Data/AppInterface";
import axiosInstance from "../../component/axiosInstance";
import type { RootState } from "../store";

const initialState: ICarsSlice = {
  cars: [],
  page: 1,
  limit: 6,
  totalRecords: 0,
  totalPages: 0,
  search: null,
  isLoading: false,
  error: null,
};

export const fetchCars = createAsyncThunk(

  "cars/fetchCars",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { page, limit, search } = state.cars;
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) {
        params.append("search", search);
      }
      const res = await axiosInstance.get(
        `/car/available?${params.toString()}`,
      );
      return res.data.data;
    } catch (error: any) {
      
      return rejectWithValue("Server issue try again later");
    }
  },
);

export const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string | null>) => {
      state.search = action.payload;
      state.page = 1; // Reset to first page when searching
    },
    resetFilters: (state) => {
      state.cars= [],
      state.page = 1;
      state.limit = 6;
      state.totalRecords = 0;
      state.totalPages = 0;
      state.search = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCars.fulfilled,
        (
          state,
          action: PayloadAction<{
            car: IAvailableCar[];
            pagination: {
              totalRecords: number;
              page: number;
              totalPages: number;
              limit: number;
            };
          }>,
        ) => {
          state.cars = action.payload.car;
          state.totalRecords = action.payload.pagination.totalRecords;
          state.page = action.payload.pagination.page;
          state.totalPages = action.payload.pagination.totalPages;
          state.limit = action.payload.pagination.limit;
          state.isLoading = false;
        },
      )
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.cars = [];
      });
  },
});

export const { setPage, setLimit, setSearch, resetFilters } = carSlice.actions;
export default carSlice.reducer;
