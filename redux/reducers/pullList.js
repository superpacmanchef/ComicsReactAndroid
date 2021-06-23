import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPull } from "../../apis/UserDatabaseApi";
const initialState = {
  pullList: [],
};

//Thunk used to obtain pullList
export const getPullListAsync = createAsyncThunk(
  "pullList/getPullList",
  async () => {
    const response = await getPull();
    return response;
  }
);

const pullListSlice = createSlice({
  name: "pullList",
  initialState,
  reducers: {
    addComicToPull: (state, action) => {
      state.pullList.push(action.payload);
    },
    removeAllPull: (state) => {
      state.pullList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPullListAsync.fulfilled, (state, action) => {
      state.pullList = action.payload;
    });
  },
});

export const { removeAllPull, addComicToPull } = pullListSlice.actions;
export const getPullListState = (state) => state.pullList.pullList;
export default pullListSlice.reducer;
