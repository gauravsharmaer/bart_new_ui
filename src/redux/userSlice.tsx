import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  value: number;
  searchPopupOpen: boolean;
}

const initialState: UserState = {
  value: 0,
  searchPopupOpen: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setSearchPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.searchPopupOpen = action.payload;
    },
  },
  extraReducers: () => {},
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, setSearchPopupOpen } =
  userSlice.actions;

export default userSlice.reducer;
