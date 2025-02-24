import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '../../test/test-utils'
import RealTimeChat from '../../pages/RealTimeChat/RealTimeChat'
import { io } from 'socket.io-client'
import { saveMessage } from '../../pages/RealTimeChat/api'
import '@testing-library/jest-dom/vitest'

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    close: vi.fn(),
    id: 'mock-socket-id'
  }))
}))

// Mock API functions
vi.mock('../../pages/RealTimeChat/api', () => ({
  saveMessage: vi.fn(),
  getChatHistory: vi.fn(),
  deleteChat: vi.fn(),
  editMessage: vi.fn()
}))

describe('RealTimeChat Component', () => {
  const mockUser = {
    userId: 'user-2',
    username: 'Test User',
    socketId: 'socket-1'
  }

  const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    close: vi.fn(),
    id: 'mock-socket-id'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('user_id', 'user-1')
    localStorage.setItem('name', 'Test User')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(io).mockImplementation(() => mockSocket as any)
  })

  const simulateSocketConnection = async () => {
    await act(async () => {
      // Find and call the 'connect' handler
      const connectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'connect')?.[1]
      if (connectHandler) connectHandler()

      // Simulate users-updated event
      const usersHandler = mockSocket.on.mock.calls.find(call => call[0] === 'users-updated')?.[1]
      if (usersHandler) usersHandler([mockUser])
    })
  }

  const renderChat = () => {
    return render(<RealTimeChat />)
  }

  describe('Initial Rendering', () => {
    it('renders loading state initially', () => {
      renderChat()
      expect(screen.getByText('Connecting to chat server...')).toBeInTheDocument()
    })

    it('establishes socket connection on mount', () => {
      renderChat()
      expect(io).toHaveBeenCalledWith('http://localhost:4000', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket']
      })
    })
  })

  describe('Error Handling', () => {
    it('handles message sending errors', async () => {
      vi.mocked(saveMessage).mockRejectedValueOnce(new Error('Failed to send'))
      render(<RealTimeChat />)
      
      await simulateSocketConnection()

      await waitFor(() => {
        expect(screen.queryByText('Connecting to chat server...')).not.toBeInTheDocument()
      })

      // Select a user
      await act(async () => {
        const userElement = await screen.findByText('Test User')
        fireEvent.click(userElement)
      })

      // Now we can find the input and send button
      const input = screen.getByPlaceholderText(/Message Test User.../)
      const sendButton = screen.getByText('Send')

      // Attempt to send a message
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Hello' } })
        fireEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/Failed to send message/)).toBeInTheDocument()
      })
    })
  })

  describe('Socket Events', () => {
    it('handles private message reception', async () => {
      render(<RealTimeChat />)
      await simulateSocketConnection()

      await act(async () => {
        const messageHandler = mockSocket.on.mock.calls.find(call => call[0] === 'private-message')?.[1]
        if (messageHandler) {
          messageHandler({
            _id: 'msg-1',
            content: 'Hello there!',
            sender: 'user-2',
            timestamp: new Date().toISOString()
          })
        }
      })

      await waitFor(() => {
        expect(screen.getByText('Hello there!')).toBeInTheDocument()
      })
    })
  })

  describe('Message Editing', () => {
    const mockMessage = {
      _id: 'msg-1',
      content: 'Original message',
      sender: 'user-1',
      timestamp: new Date().toISOString()
    }

    beforeEach(async () => {
      renderChat()
      await simulateSocketConnection()
      
      // Add a message to edit
      const messageHandler = mockSocket.on.mock.calls.find(call => call[0] === 'private-message')?.[1]
      if (messageHandler) messageHandler(mockMessage)
      
      await waitFor(() => {
        expect(screen.getByText('Original message')).toBeInTheDocument()
      })
    })

    it('allows canceling edit', async () => {
      const editButton = await screen.findByText('Edit')
      fireEvent.click(editButton)

      const editInput = screen.getByDisplayValue('Original message')
      fireEvent.change(editInput, { target: { value: 'Edited message' } })
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      await waitFor(() => {
        expect(screen.getByText('Original message')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('Edited message')).not.toBeInTheDocument()
      })
    })
  })

  describe('Chat Management', () => {
    beforeEach(() => {
      renderChat()
      simulateSocketConnection()
    })

    it('allows selecting a user to chat with', async () => {
      const userElement = await screen.findByText('Test User')
      fireEvent.click(userElement)

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Message Test User.../)).toBeInTheDocument()
      })
    })

    it('handles chat deletion', async () => {
      // Select a user first
      const userElement = await screen.findByText('Test User')
      fireEvent.click(userElement)

      const deleteButton = await screen.findByText('Delete Chat')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(screen.queryByText('Original message')).not.toBeInTheDocument()
      })
    })
  })

  describe('UI States', () => {
    it('shows online status correctly', async () => {
      renderChat()
      simulateSocketConnection()

      await waitFor(() => {
        const statusIndicator = screen.getByText('Connected')
        expect(statusIndicator).toBeInTheDocument()
        expect(statusIndicator.previousElementSibling).toHaveClass('bg-green-500')
      })
    })
  })

  describe('Input Handling', () => {
    it('handles Enter key press to send message', async () => {
      renderChat()
      simulateSocketConnection()

      // Select a user
      const userElement = await screen.findByText('Test User')
      fireEvent.click(userElement)

      const input = screen.getByPlaceholderText(/Message Test User.../)
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      await waitFor(() => {
        expect(saveMessage).toHaveBeenCalled()
      })
    })

    it('prevents sending empty messages', async () => {
      renderChat()
      simulateSocketConnection()

      // Select a user
      const userElement = await screen.findByText('Test User')
      fireEvent.click(userElement)

      const sendButton = screen.getByText('Send')
      fireEvent.click(sendButton)

      expect(saveMessage).not.toHaveBeenCalled()
    })
  })
})