import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../Interface/Interface";

const initialState: UserState = {
  searchPopupOpen: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setSearchPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.searchPopupOpen = action.payload;
    },
  },
  extraReducers: () => {},
});

// Action creators are generated for each case reducer function
export const { setSearchPopupOpen } = userSlice.actions;

export default userSlice.reducer;
