import { configureStore } from "@reduxjs/toolkit";
import api from "./api/api";
import authSlice from "./Reducer/auth.js";
import chatSlice from "./Reducer/chat.js";
import miscSlice from "./Reducer/misc.js";
const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    api.middleware,
  ],
});

export default store;
