import { describe, it, expect, beforeEach, vi } from 'vitest'
import authReducer, {
  handleFacialAuth,
  handleOneloginAuth,
  currentProfile,
  
} from '../../redux/authSlice'
import { AuthState } from '../../Interface/Interface'


const mockFetch = vi.fn()
global.fetch = mockFetch

describe('authSlice', () => {
  let initialState: AuthState

  beforeEach(() => {
 
    initialState = {
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
    }
  })


  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

 
  it('should handle facial authentication', () => {
    expect(authReducer(initialState, handleFacialAuth(true))).toEqual({
      ...initialState,
      authenticated: true,
    })

    expect(authReducer(initialState, handleFacialAuth(false))).toEqual({
      ...initialState,
      authenticated: false,
    })
  })


  it('should handle onelogin authentication', () => {
    expect(authReducer(initialState, handleOneloginAuth(true))).toEqual({
      ...initialState,
      authenticated: true,
    })

    expect(authReducer(initialState, handleOneloginAuth(false))).toEqual({
      ...initialState,
      authenticated: false,
    })
  })


  describe('currentProfile async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: currentProfile.pending.type }
      const state = authReducer(initialState, action)
      expect(state.loading).toBe(true)
    })

    it('should handle successful profile fetch', () => {
      const mockProfileData = {
        data: {
          _id: "123",
          name: "John Doe",
          email: "john@example.com",
          image: "profile.jpg",
          phoneNumber: "1234567890",
        }
      }

      const action = {
        type: currentProfile.fulfilled.type,
        payload: mockProfileData
      }

      const state = authReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.authenticated).toBe(true)
      expect(state.data).toEqual(mockProfileData.data)
    })

    it('should handle profile fetch with no data', () => {
      const action = {
        type: currentProfile.fulfilled.type,
        payload: {}
      }

      const state = authReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.authenticated).toBe(false)
      expect(state.data).toEqual(initialState.data)
    })
  })


  describe('currentProfile thunk', () => {
    it('should fetch profile successfully', async () => {
      const mockProfileData = {
        data: {
          _id: "123",
          name: "John Doe",
          email: "john@example.com",
          image: "profile.jpg",
          phoneNumber: "1234567890",
        }
      }


      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockProfileData)
      })


      const dispatch = vi.fn()
      const getState = vi.fn()

      
      await currentProfile()(dispatch, getState, undefined)


      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/profile'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include'
        })
      )

     
      const actions = dispatch.mock.calls.map(call => call[0].type)
      expect(actions).toContain(currentProfile.pending.type)
      expect(actions).toContain(currentProfile.fulfilled.type)
    })

    it('should handle fetch error', async () => {
   
      mockFetch.mockRejectedValueOnce(new Error('Fetch failed'))

      const dispatch = vi.fn()
      const getState = vi.fn()

      try {
        await currentProfile()(dispatch, getState, undefined)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe('Fetch failed')
      }

      const actions = dispatch.mock.calls.map(call => call[0].type)
      expect(actions).toContain(currentProfile.pending.type)
      expect(actions).toContain(currentProfile.rejected.type)
    })
  })
})