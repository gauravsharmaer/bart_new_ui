import { describe, it, expect } from 'vitest'
import chatReducer, {
  resetChat,
  startNewChat,
  setInitialMessage,
  resetNewChatFlag,
  setSelectedChatId,
  resetHistoryUpdateFlag,
  setHistoryUpdateFlag
} from '../../redux/chatSlice'
import type { ChatSliceState } from '../../Interface/Interface'

describe('chatSlice', () => {

  it('should handle initial state', () => {
    const initialState: ChatSliceState = {
      showChatUi: false,
      initialMessage: "",
      isNewChat: false,
      selectedChatId: null,
      shouldUpdateHistory: false,
    }
    expect(chatReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })


  it('should handle resetChat', () => {
    const previousState: ChatSliceState = {
      showChatUi: true,
      initialMessage: "test message",
      isNewChat: true,
      selectedChatId: "123",
      shouldUpdateHistory: true,
    }
    expect(chatReducer(previousState, resetChat())).toEqual({
      ...previousState,
      showChatUi: false,
      initialMessage: "",
      isNewChat: false,
      selectedChatId: "123",
      shouldUpdateHistory: true,
    })
  })


  it('should handle startNewChat', () => {
    const previousState: ChatSliceState = {
      showChatUi: false,
      initialMessage: "test message",
      isNewChat: false,
      selectedChatId: "123",
      shouldUpdateHistory: false,
    }
    expect(chatReducer(previousState, startNewChat())).toEqual({
      ...previousState,
      showChatUi: true,
      initialMessage: "",
      isNewChat: true,
      selectedChatId: null,
    })
  })


  it('should handle setInitialMessage', () => {
    const previousState: ChatSliceState = {
      showChatUi: false,
      initialMessage: "",
      isNewChat: true,
      selectedChatId: null,
      shouldUpdateHistory: false,
    }
    expect(chatReducer(previousState, setInitialMessage("Hello"))).toEqual({
      ...previousState,
      showChatUi: true,
      initialMessage: "Hello",
      isNewChat: false,
    })
  })


  it('should handle resetNewChatFlag', () => {
    const previousState: ChatSliceState = {
      showChatUi: true,
      initialMessage: "test",
      isNewChat: true,
      selectedChatId: null,
      shouldUpdateHistory: false,
    }
    expect(chatReducer(previousState, resetNewChatFlag())).toEqual({
      ...previousState,
      isNewChat: false,
    })
  })

  it('should handle setSelectedChatId', () => {
    const previousState: ChatSliceState = {
      showChatUi: false,
      initialMessage: "",
      isNewChat: true,
      selectedChatId: null,
      shouldUpdateHistory: false,
    }
    expect(chatReducer(previousState, setSelectedChatId("123"))).toEqual({
      ...previousState,
      showChatUi: true,
      selectedChatId: "123",
      isNewChat: false,
    })
  })


  it('should handle history update flags', () => {
  
    let state = chatReducer(undefined, setHistoryUpdateFlag())
    expect(state.shouldUpdateHistory).toBe(true)

    state = chatReducer(state, resetHistoryUpdateFlag())
    expect(state.shouldUpdateHistory).toBe(false)
  })


  it('should handle multiple actions in sequence', () => {
    let state = chatReducer(undefined, { type: 'unknown' })

    state = chatReducer(state, startNewChat())
    expect(state.showChatUi).toBe(true)
    expect(state.isNewChat).toBe(true)
    expect(state.selectedChatId).toBe(null)

    state = chatReducer(state, setInitialMessage("Hello"))
    expect(state.initialMessage).toBe("Hello")
    expect(state.isNewChat).toBe(false)

    state = chatReducer(state, setSelectedChatId("123"))
    expect(state.selectedChatId).toBe("123")

    state = chatReducer(state, resetChat())
    expect(state.showChatUi).toBe(false)
    expect(state.initialMessage).toBe("")
    expect(state.isNewChat).toBe(false)
  })
})