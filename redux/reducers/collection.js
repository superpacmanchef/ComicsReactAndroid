import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCollection } from '../../apis/UserDatabaseApi'

const initialState = {
  collection: []
}

export const getCollectionAsync = createAsyncThunk(
  'collection/getCollection',
  async () => {
    const response = await getCollection()
    return response
  }
)

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    removeAllCollection: (state) => {
      state.collection = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCollectionAsync.fulfilled, (state, action) => {
      state.collection = action.payload
    })
  }
})
export const { removeAllCollection } = collectionSlice.actions
export const getCollectionState = (state) => state.collection.collection

export default collectionSlice.reducer
