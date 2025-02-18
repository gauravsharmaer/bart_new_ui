import { describe, it, expect } from 'vitest'
import themeReducer, { toggleTheme, setTheme } from '../../redux/themeSlice'
import type { ThemeState } from '../../Interface/Interface'

describe('themeSlice', () => {
  it('should handle initial state', () => {
    const initialState: ThemeState = {
      isDarkMode: false
    }
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle toggleTheme', () => {
    const initialState: ThemeState = {
      isDarkMode: false
    }
    expect(themeReducer(initialState, toggleTheme())).toEqual({
      isDarkMode: true
    })

    const darkState: ThemeState = {
      isDarkMode: true
    }
    expect(themeReducer(darkState, toggleTheme())).toEqual({
      isDarkMode: false
    })
  })

  it('should handle setTheme', () => {
    const initialState: ThemeState = {
      isDarkMode: false
    }
    expect(themeReducer(initialState, setTheme(true))).toEqual({
      isDarkMode: true
    })

    const darkState: ThemeState = {
      isDarkMode: true
    }
    expect(themeReducer(darkState, setTheme(false))).toEqual({
      isDarkMode: false
    })
  })

  it('should handle multiple theme changes', () => {
    let state = themeReducer(undefined, { type: 'unknown' })
    
    state = themeReducer(state, toggleTheme())
    expect(state.isDarkMode).toBe(true)
    
    state = themeReducer(state, setTheme(false))
    expect(state.isDarkMode).toBe(false)
    
    state = themeReducer(state, setTheme(true))
    expect(state.isDarkMode).toBe(true)
    
    state = themeReducer(state, toggleTheme())
    expect(state.isDarkMode).toBe(false)
  })
})