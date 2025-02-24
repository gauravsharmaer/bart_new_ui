import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AUTH_MODES } from '../../pages/Home/authConfig'
import { NODE_API_URL } from '../../config'

describe('AUTH_MODES Configuration', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    key: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.localStorage = mockLocalStorage as Storage
  })

  describe('Capture Mode', () => {
    it('has correct API endpoint', () => {
      expect(AUTH_MODES.capture.apiEndpoint).toBe(`${NODE_API_URL}/update-face-descriptor`)
    })

    it('success check returns true for valid response', () => {
      const mockResult = {
        message: 'Face descriptor updated successfully'
      }
      expect(AUTH_MODES.capture.successCheck(mockResult)).toBe(true)
    })

    it('success check returns false for invalid response', () => {
      const mockResult = {
        message: 'Some other message'
      }
      expect(AUTH_MODES.capture.successCheck(mockResult)).toBe(false)
    })

    it('onSuccess sets localStorage correctly', () => {
      AUTH_MODES.capture.onSuccess()
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isFaceVerified', 'true')
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1)
    })
  })

  describe('Verify Mode', () => {
    it('has correct API endpoint', () => {
      expect(AUTH_MODES.verify.apiEndpoint).toBe(`${NODE_API_URL}/verify-user-face`)
    })

    it('success check returns true for matching face', () => {
      const mockResult = {
        isMatch: true
      }
      expect(AUTH_MODES.verify.successCheck(mockResult)).toBe(true)
    })

    it('success check returns false for non-matching face', () => {
      const mockResult = {
        isMatch: false
      }
      expect(AUTH_MODES.verify.successCheck(mockResult)).toBe(false)
    })

    it('onSuccess is an empty function', () => {
      expect(typeof AUTH_MODES.verify.onSuccess).toBe('function')
      expect(AUTH_MODES.verify.onSuccess()).toBeUndefined()
    })
  })

  describe('API Endpoints', () => {
    it('uses correct base URL from config', () => {
      expect(AUTH_MODES.capture.apiEndpoint).toContain(NODE_API_URL)
      expect(AUTH_MODES.verify.apiEndpoint).toContain(NODE_API_URL)
    })

    it('has different endpoints for capture and verify', () => {
      expect(AUTH_MODES.capture.apiEndpoint).not.toBe(AUTH_MODES.verify.apiEndpoint)
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined result in success check', () => {
      expect(AUTH_MODES.capture.successCheck(undefined)).toBe(false)
      expect(AUTH_MODES.verify.successCheck(undefined)).toBe(false)
    })

    it('handles null result in success check', () => {
      expect(AUTH_MODES.capture.successCheck(null)).toBe(false)
      expect(AUTH_MODES.verify.successCheck(null)).toBe(false)
    })


  })
})