import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { NODE_API_URL } from "../config";
import { AuthState } from "../Interface/Interface";

const initialState: AuthState = {
  loading: true,
  authenticated: false,
  logged_in: false,
  data: {
    _id: "",
    name: "",
    email: "",

    image: "",
    phoneNumber: "",
  },
};

export const currentProfile = createAsyncThunk(
  "getCurrentProfile",
  async () => {
    const response = await fetch(`${NODE_API_URL}/profile`, {
      method: "GET",
      credentials: "include",
    });

    const jsonResponse = await response.json();

    return jsonResponse;
  }
);

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    handleFacialAuth: (state, action) => {
      state.authenticated = action.payload;
    },
    handleOneloginAuth: (state, action) => {
      state.authenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(currentProfile.fulfilled, (state, action) => {
      if (action.payload.data) {
        state.data = action.payload.data;
        state.authenticated = true;
      }
      state.loading = false;
    });

    builder.addCase(currentProfile.pending, (state) => {
      state.loading = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { handleFacialAuth, handleOneloginAuth } = authSlice.actions;

export default authSlice.reducer;
