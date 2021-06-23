import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLoged } from "../../apis/UserDatabaseApi";

//Thunk used to get weather loged in or not
export const getLogedAsync = createAsyncThunk("loged/getLoged", async () => {
  const response = await getLoged();
  return response;
});

const initialState = {
  logedIn: false,
};

const logedSlice = createSlice({
  name: "loged",
  initialState,
  reducers: {
    logedTrue: (state) => {
      state.logedIn = true;
    },
    logedFalse: (state) => {
      state.logedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLogedAsync.fulfilled, (state, action) => {
      state.logedIn = action.payload;
    });
  },
});

export const { logedTrue, logedFalse } = logedSlice.actions;

export const getLogedState = (state) => state.loged.logedIn;

export const logedReducer = logedSlice.reducer;
