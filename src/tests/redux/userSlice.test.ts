import { describe, it, expect } from 'vitest'
import userReducer, { setSearchPopupOpen } from '../../redux/userSlice'
import type { UserState } from '../../Interface/Interface'

describe('userSlice', () => {
  it('should handle initial state', () => {
    const initialState: UserState = {
      searchPopupOpen: false
    }
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setSearchPopupOpen to true', () => {
    const initialState: UserState = {
      searchPopupOpen: false
    }
    expect(userReducer(initialState, setSearchPopupOpen(true))).toEqual({
      searchPopupOpen: true
    })
  })

  it('should handle setSearchPopupOpen to false', () => {
    const initialState: UserState = {
      searchPopupOpen: true
    }
    expect(userReducer(initialState, setSearchPopupOpen(false))).toEqual({
      searchPopupOpen: false
    })
  })

  it('should handle toggling searchPopupOpen', () => {
    let state = userReducer(undefined, { type: 'unknown' })
    
    state = userReducer(state, setSearchPopupOpen(true))
    expect(state.searchPopupOpen).toBe(true)
    
    state = userReducer(state, setSearchPopupOpen(false))
    expect(state.searchPopupOpen).toBe(false)
  })
})