import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { logedReducer } from "./reducers/logedIn";
import pullListReducer from "./reducers/pullList";
import collectionReducer from "./reducers/collection";
export const store = configureStore({
  reducer: {
    loged: logedReducer,
    pullList: pullListReducer,
    collection: collectionReducer,
  },
});
