import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import userSlice from "./userSlice";
import themeSlice from "./themeSlice";
import chatSlice from "./chatSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    theme: themeSlice,
    chat: chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
