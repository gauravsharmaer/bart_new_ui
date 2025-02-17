import { describe, it, expect } from 'vitest'
import { modelLoadingState } from '../../utils/modelState'

describe('modelLoadingState', () => {
  it('should have initial state with isLoaded false', () => {
    expect(modelLoadingState.isLoaded).toBe(false)
  })

  it('should have initial error state as null', () => {
    expect(modelLoadingState.error).toBeNull()
  })

  it('should have the correct structure', () => {
    expect(modelLoadingState).toEqual({
      isLoaded: false,
      error: null
    })
  })

  it('should be mutable', () => {
    modelLoadingState.isLoaded = true
    expect(modelLoadingState.isLoaded).toBe(true)

    modelLoadingState.error = 'Test error'
    expect(modelLoadingState.error).toBe('Test error')

 
    modelLoadingState.isLoaded = false
    modelLoadingState.error = null
  })
})