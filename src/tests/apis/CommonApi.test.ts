import { describe, it, expect, vi, beforeEach } from 'vitest'
import { askBart, verifyOTP, getHistory, getUserChats, uploadImage, deleteChat, renameChat ,
    likeChat, unlikeChat, searchChatHistory,
    generalChat,
    chatWithDocs,
    getPdfChatHistory,
    getGeneralChatHistory
} from '../../Api/CommonApi'
import { NODE_API_URL } from '../../config'

const mockFetch = vi.fn()
global.fetch = mockFetch


const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    length: 0,

    key: vi.fn()
  }
  global.localStorage = mockLocalStorage as Storage




describe('askBart', () => {
  // 2. Reset mocks before each test
  beforeEach(() => {
    mockFetch.mockReset()
  })

  // 3. Test successful API call
  it('should make successful API call', async () => {
    // 3.1 Setup mock response
    const mockResponse = { 
      answer: 'Test answer',
      chat_id: '123'
    }
    // 3.2 Setup mock response (the intercepted API call will return this mock response)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    // 3.2 Make the API call from the component to real API but intercepted by mock fetch 
    // and result will capture the response we get back from the mock fetch
    const result = await askBart({
      question: 'test question',
      user_id: '123'
    })

    // 3.3 Verify fetch was called with correct parameters (the intercepted API call will return this mock response)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://bart-api-bd05237bdea5.herokuapp.com/ask',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          question: 'test question',
          user_id: '123'
        })
      }
    )

    // 3.4 Verify response (the intercepted API call will return this mock response)
    expect(result).toEqual(mockResponse)
  })

  // 4. Test API error handling
  it('should handle API error response', async () => {
    // 4.1 Setup mock error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad Request' })
    })

    // 4.2 Verify error is thrown with correct message
    await expect(askBart({
      question: 'test',
      user_id: '123'
    })).rejects.toThrow('Ask request failed (400): Bad Request')
  })

  // 5. Test network error handling
  it('should handle network error', async () => {
    // 5.1 Setup mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // 5.2 Verify error is thrown
    await expect(askBart({
      question: 'test',
      user_id: '123'
    })).rejects.toThrow('An unexpected error occurred while processing your question')
  })

  // 6. Test invalid JSON response
  it('should handle invalid JSON response', async () => {
    // 6.1 Setup mock invalid JSON response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new SyntaxError('Invalid JSON'))
    })

    // 6.2 Verify error is thrown
    await expect(askBart({
      question: 'test',
      user_id: '123'
    })).rejects.toThrow('Invalid response format from server')
  })
})

describe('verifyOTP', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should verify OTP successfully', async () => {
      // Setup mock response
      const mockResponse = { 
        success: true,
        message: 'OTP verified successfully'
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
  
      // Make the API call with correct interface
      const result = await verifyOTP({
        email: 'test@example.com',
        otp: 123456,           // number instead of string
        chat_id: 'chat123'     // added chat_id
      })
  
      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/verification/verify_otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            email: 'test@example.com',
            otp: 123456,        // number instead of string
            chat_id: 'chat123'  // added chat_id
          })
        }
      )
  
      // Verify response
      expect(result).toEqual(mockResponse)
    })
  
    it('should handle invalid OTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid OTP' })
      })
  
      await expect(verifyOTP({
        email: 'test@example.com',
        otp: 999999,           // number instead of string
        chat_id: 'chat123'     // added chat_id
      })).rejects.toThrow('OTP verification failed (400): Invalid OTP')
    })
  
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
      await expect(verifyOTP({
        email: 'test@example.com',
        otp: 123456,           // number instead of string
        chat_id: 'chat123'     // added chat_id
      })).rejects.toThrow('An unexpected error occurred during OTP verification')
    })
  
    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
      await expect(verifyOTP({
        email: 'test@example.com',
        otp: 123456,           // number instead of string
        chat_id: 'chat123'     // added chat_id
      })).rejects.toThrow('Invalid response format from server')
    })
  })

  describe('getHistory', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should fetch chat history successfully', async () => {
      // Setup mock chat history response
      const mockHistory = [
        [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' }
        ],
        [
          { role: 'user', content: 'How are you?' },
          { role: 'assistant', content: 'I am good!' }
        ]
      ]
  
      // Setup mock fetch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHistory)
      })
  
      // Make the API call
      const result = await getHistory('chat123')
  
      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/chat_histories/chat123',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  
      // Verify response
      expect(result).toEqual(mockHistory)
    })
  
    it('should handle API error', async () => {
      // Setup mock error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Chat history not found' })
      })
  
      // Verify error is thrown
      await expect(getHistory('invalid-chat-id'))
        .rejects
        .toThrow('Failed to fetch chat history')
    })
  
    it('should handle network error', async () => {
      // Setup mock network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Verify the original error is thrown
      await expect(getHistory('chat123'))
        .rejects
        .toThrow('Network error')  // Changed to match original error
    })
  
    it('should handle invalid JSON response', async () => {
      // Setup mock invalid JSON response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })

      // Verify the original error is thrown
      await expect(getHistory('chat123'))
        .rejects
        .toThrow('Invalid JSON')  // Changed to match original error
    })
  })

  describe('getUserChats', () => {
    beforeEach(() => {
        mockFetch.mockReset()
        
        mockLocalStorage.getItem.mockReset()
    })
  
    it('should fetch user chats successfully', async () => {

      mockLocalStorage.getItem.mockReturnValue('user123')
  
     
      const mockChats = [
        {
          chat_id: 'chat1',
          name: 'Chat 1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        {
          chat_id: 'chat2',
          name: 'Chat 2',
          created_at: '2024-01-02',
          updated_at: '2024-01-02'
        }
      ]
  
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChats)
      })
  
      
      const result = await getUserChats()
  
    
      expect(localStorage.getItem).toHaveBeenCalledWith('user_id')
  
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/chats/user123',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  
     
      expect(result).toEqual(mockChats)
    })
  
    it('should handle API error', async () => {

      mockLocalStorage.getItem.mockReturnValue('user123')
  
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Chats not found' })
      })
  
   
      await expect(getUserChats())
        .rejects
        .toThrow('Failed to fetch chat history')
    })
  
    it('should handle network error', async () => {

      mockLocalStorage.getItem.mockReturnValue('user123')
  
 
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
      // Verify error is thrown
      await expect(getUserChats())
        .rejects
        .toThrow('Network error')
    })
  
    it('should handle invalid JSON response', async () => {
      // Setup localStorage mock
      mockLocalStorage.getItem.mockReturnValue('user123')
  
      // Setup mock invalid JSON response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
      // Verify error is thrown
      await expect(getUserChats())
        .rejects
        .toThrow('Invalid JSON')
    })
  })  



describe('uploadImage', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should upload image successfully', async () => {
   
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' })
    

    const mockResponse = {
      success: true,
      imageUrl: 'https://example.com/image.png'
    }

  
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })


    const result = await uploadImage('user123', mockFile)

   
    expect(mockFetch).toHaveBeenCalledWith(
      `${NODE_API_URL}/upload-user-image?userId=user123`,
      {
        method: 'POST',
        body: expect.any(FormData)  
      }
    )

   
    const fetchCall = mockFetch.mock.calls[0]
    const sentFormData = fetchCall[1].body as FormData
    expect(sentFormData.get('image')).toEqual(mockFile)


    expect(result).toEqual(mockResponse)
  })

  it('should throw error if userId is null', async () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' })

    await expect(uploadImage(null, mockFile))
      .rejects
      .toThrow('User ID is required')
  })

  it('should handle upload error', async () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' })

    // Setup mock error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Invalid image format')
    })

    await expect(uploadImage('user123', mockFile))
      .rejects
      .toThrow('Invalid image format')
  })

  it('should handle network error', async () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' })

    // Setup mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(uploadImage('user123', mockFile))
      .rejects
      .toThrow('Network error')
  })
})

describe('deleteChat', () => {
    beforeEach(() => {
      mockFetch.mockReset()
      mockLocalStorage.getItem.mockReset()
    })
  
    it('should delete chat successfully', async () => {

      mockLocalStorage.getItem.mockReturnValue('user123')
  
    
      const mockRemainingChats = [
        {
          chat_id: 'chat2',
          name: 'Chat 2',
          created_at: '2024-01-02',
          updated_at: '2024-01-02'
        }
      ]
  

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRemainingChats)
      })
  
     
      const result = await deleteChat('chat1')
  
    
      expect(localStorage.getItem).toHaveBeenCalledWith('user_id')
  
   
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/delete_chat/user123/chat1',
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  
   
      expect(result).toEqual(mockRemainingChats)
    })
  
    it('should handle API error', async () => {
   
      mockLocalStorage.getItem.mockReturnValue('user123')
  
     
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Chat not found' })
      })
  
 
      await expect(deleteChat('nonexistent-chat'))
        .rejects
        .toThrow('Failed to delete chat history')
    })
  
    it('should handle network error', async () => {
      
      mockLocalStorage.getItem.mockReturnValue('user123')
  
  
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
     
      await expect(deleteChat('chat1'))
        .rejects
        .toThrow('Network error')
    })
  
    it('should handle invalid JSON response', async () => {

      mockLocalStorage.getItem.mockReturnValue('user123')
 
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
 
      await expect(deleteChat('chat1'))
        .rejects
        .toThrow('Invalid JSON')
    })
  })



  describe('renameChat', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should rename chat successfully', async () => {

      const mockUpdatedChats = [
        {
          chat_id: 'chat1',
          name: 'New Chat Name',  
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        {
          chat_id: 'chat2',
          name: 'Chat 2',
          created_at: '2024-01-02',
          updated_at: '2024-01-02'
        }
      ]
  

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUpdatedChats)
      })
  
   
      const result = await renameChat('chat1', 'New Chat Name')
  
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/rename_chat/chat1/New Chat Name',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  

      expect(result).toEqual(mockUpdatedChats)
    })
  
    it('should handle API error', async () => {
   
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Chat not found' })
      })
  
   
      await expect(renameChat('nonexistent-chat', 'New Name'))
        .rejects
        .toThrow('Failed to rename chat')
    })
  
    it('should handle network error', async () => {
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
  
      await expect(renameChat('chat1', 'New Name'))
        .rejects
        .toThrow('Network error')
    })
  
    it('should handle invalid JSON response', async () => {
     
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
     
      await expect(renameChat('chat1', 'New Name'))
        .rejects
        .toThrow('Invalid JSON')
    })
  
    it('should handle special characters in new name', async () => {

      const mockUpdatedChats = [
        {
          chat_id: 'chat1',
          name: 'Special & Name!',  
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        }
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUpdatedChats)
      })
  
     
      const result = await renameChat('chat1', 'Special & Name!')
  
    
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/rename_chat/chat1/Special & Name!',
        expect.any(Object)
      )
  
      expect(result).toEqual(mockUpdatedChats)
    })
  })





  describe('likeChat', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should like chat successfully', async () => {
     
      const mockUpdatedHistory = [
        [
          { role: 'user', content: 'Hello', like: true },
          { role: 'assistant', content: 'Hi there!' }
        ],
        [
          { role: 'user', content: 'How are you?', like: true },
          { role: 'assistant', content: 'I am good!' }
        ]
      ]
  
 
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUpdatedHistory)
      })
  
   
      const result = await likeChat('chat123')
  

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/like_chat/chat123',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          }
        }
      )

      expect(result).toEqual(mockUpdatedHistory)
    })
  
    it('should handle API error', async () => {
   
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Chat not found' })
      })
  
    
      await expect(likeChat('nonexistent-chat'))
        .rejects
        .toThrow('Failed to like chat')
    })
  
    it('should handle network error', async () => {

      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  

      await expect(likeChat('chat123'))
        .rejects
        .toThrow('Network error')
    })
  
    it('should handle invalid JSON response', async () => {
    
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
   
      await expect(likeChat('chat123'))
        .rejects
        .toThrow('Invalid JSON')
    })
  
    it('should handle already liked chat', async () => {
    
      const mockExistingHistory = [
        [
          { role: 'user', content: 'Hello', like: true },  
          { role: 'assistant', content: 'Hi there!' }
        ]
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExistingHistory)
      })

  
      const result = await likeChat('chat123')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/like_chat/chat123',
        expect.any(Object)
      )

      expect(result[0][0].like).toBe(true)  
    })
  })




  describe('unlikeChat', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should unlike chat successfully', async () => {
    
      const mockUpdatedHistory = [
        [
          { role: 'user', content: 'Hello', like: false },
          { role: 'assistant', content: 'Hi there!' }
        ],
        [
          { role: 'user', content: 'How are you?', like: false },
          { role: 'assistant', content: 'I am good!' }
        ]
      ]
  
 
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUpdatedHistory)
      })
  
    
      const result = await unlikeChat('chat123')
  

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/un_like_chat/chat123',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  
    
      expect(result).toEqual(mockUpdatedHistory)
    })
  
    it('should handle API error', async () => {
 
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Chat not found' })
      })
  
      await expect(unlikeChat('nonexistent-chat'))
        .rejects
        .toThrow('Failed to unlike chat')
    })
  
    it('should handle network error', async () => {

      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  

      await expect(unlikeChat('chat123'))
        .rejects
        .toThrow('Network error')
    })
  
    it('should handle invalid JSON response', async () => {

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
  
      await expect(unlikeChat('chat123'))
        .rejects
        .toThrow('Invalid JSON')
    })
  
    it('should handle already unliked chat', async () => {
   
      const mockExistingHistory = [
        [
          { role: 'user', content: 'Hello', like: false },
          { role: 'assistant', content: 'Hi there!' }
        ]
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExistingHistory)
      })
  
    
      const result = await unlikeChat('chat123')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/un_like_chat/chat123',
        expect.any(Object)
      )
  
    
      expect(result[0][0].like).toBe(false)
    })
  })







  describe('searchChatHistory', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should search chat history with all parameters', async () => {

      const mockChats = [
        {
          chat_id: 'chat1',
          name: 'React Discussion',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          chat_type: 'technical'
        }
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChats)
      })
  
      const result = await searchChatHistory('user123', 'React', 'technical')
  
   
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/chat_search/user123?name=React&chat_type=technical',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  

      expect(result).toEqual(mockChats)
    })
  
    it('should search chat history with only userId', async () => {
      const mockChats = [
        {
          chat_id: 'chat1',
          name: 'General Chat',
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        }
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChats)
      })
  
      const result = await searchChatHistory('user123')
  

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/chat_search/user123',
        expect.any(Object)
      )
  
      expect(result).toEqual(mockChats)
    })
  
    it('should search chat history with name only', async () => {
      const mockChats = [
        {
          chat_id: 'chat1',
          name: 'JavaScript',
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        }
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChats)
      })
  
      const result = await searchChatHistory('user123', 'JavaScript')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/chat_search/user123?name=JavaScript',
        expect.any(Object)
      )
  
      expect(result).toEqual(mockChats)
    })
  
    it('should search chat history with chat_type only', async () => {
      const mockChats = [
        {
          chat_id: 'chat1',
          name: 'Technical Discussion',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          chat_type: 'technical'
        }
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChats)
      })
  
      const result = await searchChatHistory('user123', undefined, 'technical')
  
    
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/chat_search/user123?chat_type=technical',
        expect.any(Object)
      )
  
      expect(result).toEqual(mockChats)
    })
  
    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'No chats found' })
      })
  
      await expect(searchChatHistory('user123', 'nonexistent'))
        .rejects
        .toThrow('Failed to search chat history')
    })
  
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
      await expect(searchChatHistory('user123'))
        .rejects
        .toThrow('Network error')
    })
  
    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
      await expect(searchChatHistory('user123'))
        .rejects
        .toThrow('Invalid JSON')
    })
  })



  describe('generalChat', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should send general chat request successfully', async () => {

      const requestData = {
        question: 'What is React?',
        user_id: 'user123',
        chat_id: 'chat123'  
      }
  
 
      const mockResponse = {
        answer: 'React is a JavaScript library for building user interfaces.',
        chat_id: 'chat123',
        message_id: 'msg123'
      }
  
   
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
  
     
      const result = await generalChat(requestData)
  
     
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/general_chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(requestData)
        }
      )
  

      expect(result).toEqual(mockResponse)
    })
  
    it('should handle request without chat_id', async () => {

      const requestData = {
        question: 'What is React?',
        user_id: 'user123'
      }
  
      const mockResponse = {
        answer: 'React is a JavaScript library.',
        chat_id: 'new_chat_123',  
        message_id: 'msg123'
      }
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
  
      const result = await generalChat(requestData)
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/general_chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(requestData)
        }
      )
  
      expect(result).toEqual(mockResponse)
    })
  
    it('should handle API error with message', async () => {
      const requestData = {
        question: 'What is React?',
        user_id: 'user123'
      }
  
   
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Invalid question format',
          status: 400
        })
      })
  
   
      await expect(generalChat(requestData))
        .rejects
        .toThrow('General chat request failed (400): Invalid question format')
    })
  
    it('should handle API error without message', async () => {
      const requestData = {
        question: 'What is React?',
        user_id: 'user123'
      }
  
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      })
  
      await expect(generalChat(requestData))
        .rejects
        .toThrow('General chat request failed (500): General chat request failed')
    })
  
    it('should handle invalid JSON response', async () => {
      const requestData = {
        question: 'What is React?',
        user_id: 'user123'
      }
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
      await expect(generalChat(requestData))
        .rejects
        .toThrow('Invalid response format from server')
    })
  
    it('should handle network error', async () => {
      const requestData = {
        question: 'What is React?',
        user_id: 'user123'
      }
  
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
      await expect(generalChat(requestData))
        .rejects
        .toThrow('An unexpected error occurred while processing your question')
    })
  })




  describe('chatWithDocs', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should send chat with docs request successfully with file', async () => {

      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const userId = 'user123'
      const question = 'What does this document say?'
      const chatId = 'chat123'
  
   
      const mockResponse = {
        answer: 'The document discusses...',
        chat_id: chatId,
        message_id: 'msg123',
        file_name: 'test.pdf'
      }
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
  
    
      const result = await chatWithDocs(mockFile, userId, question, chatId)
  
    
      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/chat_with_docs',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          },
          body: expect.any(FormData)
        }
      )
  
      
      const fetchCall = mockFetch.mock.calls[0]
      const sentFormData = fetchCall[1].body as FormData
      expect(sentFormData.get('file')).toEqual(mockFile)
      expect(sentFormData.get('user_id')).toBe(userId)
      expect(sentFormData.get('question')).toBe(question)
      expect(sentFormData.get('chat_id')).toBe(chatId)
  
      expect(result).toEqual(mockResponse)
    })
  
    it('should send chat with docs request without file (follow-up question)', async () => {
      const userId = 'user123'
      const question = 'Can you explain more?'
      const chatId = 'chat123'
  
      const mockResponse = {
        answer: 'Here is more information...',
        chat_id: chatId,
        message_id: 'msg124'
      }
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
  
      const result = await chatWithDocs(null, userId, question, chatId)

      const fetchCall = mockFetch.mock.calls[0]
      const sentFormData = fetchCall[1].body as FormData
      expect(sentFormData.has('file')).toBe(false)
      expect(sentFormData.get('user_id')).toBe(userId)
      expect(sentFormData.get('question')).toBe(question)
      expect(sentFormData.get('chat_id')).toBe(chatId)
  
      expect(result).toEqual(mockResponse)
    })
  
    it('should handle API error with message', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
  
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Invalid file format',
          status: 400
        })
      })
  
      await expect(chatWithDocs(mockFile, 'user123', 'question'))
        .rejects
        .toThrow('Chat with docs request failed (400): Invalid file format')
    })
  
    it('should handle invalid file type', async () => {
      const mockFile = new File(['test content'], 'test.exe', { type: 'application/x-msdownload' })
  
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Unsupported file type',
          status: 400
        })
      })
  
      await expect(chatWithDocs(mockFile, 'user123', 'question'))
        .rejects
        .toThrow('Chat with docs request failed (400): Unsupported file type')
    })
  
    it('should handle network error', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
  
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
      await expect(chatWithDocs(mockFile, 'user123', 'question'))
        .rejects
        .toThrow('An unexpected error occurred while processing your document chat')
    })
  
    it('should handle invalid JSON response', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
      await expect(chatWithDocs(mockFile, 'user123', 'question'))
        .rejects
        .toThrow('Invalid response format from server')
    })
  
    it('should handle large file size', async () => {
 
      const largeContent = 'x'.repeat(11 * 1024 * 1024) // 11MB
      const mockFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' })
  
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: () => Promise.resolve({
          message: 'File too large',
          status: 413
        })
      })
  
      await expect(chatWithDocs(mockFile, 'user123', 'question'))
        .rejects
        .toThrow('Chat with docs request failed (413): File too large')
    })
  })




  describe('getPdfChatHistory', () => {
    beforeEach(() => {
      mockFetch.mockReset()
    })
  
    it('should fetch PDF chat history successfully', async () => {
    
      const mockPdfChats = [
        {
          chat_id: 'pdf1',
          name: 'Technical Document',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          file_name: 'tech-doc.pdf',
          messages: [
            {
              role: 'user',
              content: 'What is in this document?',
              timestamp: '2024-01-01T10:00:00Z'
            },
            {
              role: 'assistant',
              content: 'This document contains technical specifications...',
              timestamp: '2024-01-01T10:00:01Z'
            }
          ]
        }
      ]
  

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPdfChats)
      })
  
    
      const result = await getPdfChatHistory('user123')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/doc_chats/user123',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  

      expect(result).toEqual(mockPdfChats)
    })
  
    it('should handle empty chat history', async () => {

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      })
  
      const result = await getPdfChatHistory('user123')
  
      expect(result).toEqual([])
    })
  
    it('should handle API error with message', async () => {
  
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({
          message: 'User not found',
          status: 404
        })
      })
  
      await expect(getPdfChatHistory('nonexistent-user'))
        .rejects
        .toThrow('PDF chat history fetch failed (404): User not found')
    })
  
    it('should handle API error without message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      })
  
      await expect(getPdfChatHistory('user123'))
        .rejects
        .toThrow('PDF chat history fetch failed (500): Failed to fetch PDF chat history')
    })
  
    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
      await expect(getPdfChatHistory('user123'))
        .rejects
        .toThrow('Invalid response format from server')
    })
  
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
      await expect(getPdfChatHistory('user123'))
        .rejects
        .toThrow('An unexpected error occurred while fetching PDF chat history')
    })
  
    it('should handle malformed response data', async () => {

      const malformedResponse = [
        {
          chat_id: 'pdf1',

          messages: []
        }
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(malformedResponse)
      })
  
  
      const result = await getPdfChatHistory('user123')
      expect(result).toEqual(malformedResponse)
    })
  })





  describe('getGeneralChatHistory', () => {
    beforeEach(() => {
      mockFetch.mockReset()
      mockLocalStorage.getItem.mockReset()
    })
  
    it('should fetch general chat history successfully', async () => {
     
      mockLocalStorage.getItem.mockReturnValue('user123')
  

      const mockGeneralChats = [
        {
          chat_id: 'general1',
          name: 'General Discussion',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          messages: [
            {
              role: 'user',
              content: 'What is JavaScript?',
              timestamp: '2024-01-01T10:00:00Z'
            },
            {
              role: 'assistant',
              content: 'JavaScript is a programming language...',
              timestamp: '2024-01-01T10:00:01Z'
            }
          ]
        }
      ]
  
   
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGeneralChats)
      })
  
 
      const result = await getGeneralChatHistory()

      expect(localStorage.getItem).toHaveBeenCalledWith('user_id')
  

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bart-api-bd05237bdea5.herokuapp.com/general_chats/user123',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      )
  
  
      expect(result).toEqual(mockGeneralChats)
    })
  
    it('should handle empty chat history', async () => {

      mockLocalStorage.getItem.mockReturnValue('user123')
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      })
  
      const result = await getGeneralChatHistory()
  
      expect(result).toEqual([])
    })
  
    it('should handle API error with message', async () => {
    
      mockLocalStorage.getItem.mockReturnValue('user123')
  

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({
          message: 'User not found',
          status: 404
        })
      })
  
      await expect(getGeneralChatHistory())
        .rejects
        .toThrow('General chat history fetch failed (404): User not found')
    })
  
    it('should handle API error without message', async () => {
 
      mockLocalStorage.getItem.mockReturnValue('user123')
  
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      })
  
      await expect(getGeneralChatHistory())
        .rejects
        .toThrow('General chat history fetch failed (500): Failed to fetch general chat history')
    })
  
    it('should handle invalid JSON response', async () => {
   
      mockLocalStorage.getItem.mockReturnValue('user123')
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON'))
      })
  
      await expect(getGeneralChatHistory())
        .rejects
        .toThrow('Invalid response format from server')
    })
  
    it('should handle network error', async () => {

      mockLocalStorage.getItem.mockReturnValue('user123')
  
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
      await expect(getGeneralChatHistory())
        .rejects
        .toThrow('An unexpected error occurred while fetching general chat history')
    })
  
    it('should handle missing user_id in localStorage', async () => {
   
      mockLocalStorage.getItem.mockReturnValue(null)
  

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'User ID is required',
          status: 400
        })
      })
  
      await expect(getGeneralChatHistory())
        .rejects
        .toThrow('General chat history fetch failed (400): User ID is required')
    })
  
    it('should handle malformed response data', async () => {
  
      mockLocalStorage.getItem.mockReturnValue('user123')
  

      const malformedResponse = [
        {
          chat_id: 'general1',
     
          messages: []
        }
      ]
  
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(malformedResponse)
      })
  

      const result = await getGeneralChatHistory()
      expect(result).toEqual(malformedResponse)
    })
  })