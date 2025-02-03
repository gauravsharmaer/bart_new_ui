import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  showChatUi: boolean;
  initialMessage: string;
  isNewChat: boolean;
  selectedChatId: string | null;
  shouldUpdateHistory: boolean;
}

const initialState: ChatState = {
  showChatUi: false,
  initialMessage: "",
  isNewChat: false,
  selectedChatId: null,
  shouldUpdateHistory: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.showChatUi = false;
      state.initialMessage = "";
      state.isNewChat = false;
    },
    startNewChat: (state) => {
      state.showChatUi = true;
      state.initialMessage = "";
      state.isNewChat = true;
      state.selectedChatId = null;
    },
    setInitialMessage: (state, action) => {
      state.initialMessage = action.payload;
      state.showChatUi = true;
      state.isNewChat = false;
    },
    resetNewChatFlag: (state) => {
      state.isNewChat = false;
    },
    setSelectedChatId: (state, action: PayloadAction<string>) => {
      state.showChatUi = true;
      state.selectedChatId = action.payload;
      state.isNewChat = false;
    },
    resetHistoryUpdateFlag: (state) => {
      state.shouldUpdateHistory = false;
    },
    setHistoryUpdateFlag: (state) => {
      state.shouldUpdateHistory = true;
    },
  },
});

export const {
  resetChat,
  startNewChat,
  setInitialMessage,
  resetNewChatFlag,
  setSelectedChatId,
  resetHistoryUpdateFlag,
  setHistoryUpdateFlag,
} = chatSlice.actions;
export default chatSlice.reducer;
