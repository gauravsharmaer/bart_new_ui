import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/test-utils'
import VoiceChatCard from '../../../components/VoiceChatCard'

describe('VoiceChatCard Component', () => {
  
  const mockOnClose = vi.fn()

  
  beforeEach(() => {
    mockOnClose.mockClear()
  })


  describe('rendering', () => {
    it('renders with default text when no text provided', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      expect(screen.getByText('Listening...')).toBeInTheDocument()
    })

    it('renders with provided text', () => {
      const testText = 'Hello, how can I help?'
      render(<VoiceChatCard onClose={mockOnClose} text={testText} />)
      expect(screen.getByText(testText)).toBeInTheDocument()
    })

    it('renders the avatar image', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      const avatarImg = screen.getByAltText('BART Genie')
      expect(avatarImg).toBeInTheDocument()
      expect(avatarImg).toHaveAttribute('src')
    })

    it('renders the close button', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
   
      const closeButton = screen.getByRole('button')
      expect(closeButton).toBeInTheDocument()
    })
  })


  describe('interactions', () => {
    it('calls onClose when close button is clicked', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      const closeButton = screen.getByRole('button')
      
      fireEvent.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  // Style tests
  describe('styling', () => {
    it('has correct background overlay', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      const overlay = screen.getByRole('dialog')
      expect(overlay).toHaveClass('bg-black/30')
    })

    it('has correct card styling', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      const card = screen.getByRole('dialog')
      expect(card).toHaveClass('fixed', 'inset-0', 'flex')
    })

    it('has correct avatar container styling', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      const avatarContainer = screen.getByAltText('BART Genie').parentElement
      expect(avatarContainer).toHaveClass('relative', 'w-full', 'h-full')
    })

    it('has correct text styling', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="Test" />)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('text-center', 'text-[#4A4A4A]', 'text-2xl')
    })
  })


  describe('accessibility', () => {
    it('renders as a dialog', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('close button is accessible', () => {
      render(<VoiceChatCard onClose={mockOnClose} text="" />)
      const closeButton = screen.getByRole('button')
      expect(closeButton).toHaveClass('hover:bg-gray-100')
    })
  })


  describe('edge cases', () => {
    it('handles very long text', () => {
      const longText = 'A'.repeat(100)
      render(<VoiceChatCard onClose={mockOnClose} text={longText} />)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('handles special characters in text', () => {
      const specialText = '!@#$%^&*()'
      render(<VoiceChatCard onClose={mockOnClose} text={specialText} />)
      expect(screen.getByText(specialText)).toBeInTheDocument()
    })
  })
})
