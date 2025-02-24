
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import ChatButtonCard from '../../../components/ui/ChatButtonCard'
import type { ChatButtonCardProps } from '../../../props/Props'
import '@testing-library/jest-dom/vitest'

describe('ChatButtonCard Component', () => {
  const mockButtons = ['Button 1', 'Button 2', 'Button 3']
  const mockOnButtonClick = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper function to render the component with proper types
  const renderChatButtonCard = (props: Partial<ChatButtonCardProps> = {}) => {
    const defaultProps: ChatButtonCardProps = {
      buttons: mockButtons,
      onButtonClick: mockOnButtonClick,
      clickedButton: null
    }

    return render(
      <ChatButtonCard
        {...defaultProps}
        {...props}
      />
    )
  }

  describe('Rendering', () => {
    it('renders all buttons', () => {
      renderChatButtonCard()
      
      mockButtons.forEach(buttonText => {
        expect(screen.getByText(buttonText)).toBeInTheDocument()
      })
    })

    it('renders correct number of buttons', () => {
      renderChatButtonCard()
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(mockButtons.length)
    })

    it('applies default styling to buttons', () => {
      renderChatButtonCard()
      
      const button = screen.getByText(mockButtons[0])
      expect(button).toHaveClass(
        'px-5',
        'py-2.5',
        'border',
        'rounded-lg',
        'text-sm',
        'font-medium'
      )
    })
  })

  describe('Button States', () => {
    it('applies active state styling to clicked button', () => {
      const clickedButton = mockButtons[0]
      renderChatButtonCard({ clickedButton })
      
      const button = screen.getByText(clickedButton)
      expect(button).toHaveClass(
        'bg-orange-500',
        'text-white',
        'border-transparent'
      )
    })

    it('maintains inactive styling for non-clicked buttons', () => {
      const clickedButton = mockButtons[0]
      renderChatButtonCard({ clickedButton })
      
      const inactiveButton = screen.getByText(mockButtons[1])
      expect(inactiveButton).toHaveClass(
        'bg-white',
        'text-gray-700'
      )
    })

    it('applies dark mode classes when in dark mode', () => {
      // Simulate dark mode
      document.documentElement.classList.add('dark')
      
      renderChatButtonCard()
      const button = screen.getByText(mockButtons[0])
      expect(button).toHaveClass(
        'dark:border-[#4f4f4f]',
        'dark:bg-[#111111]',
        'dark:text-[#ffffff]'
      )

      // Cleanup
      document.documentElement.classList.remove('dark')
    })
  })

  describe('Interactions', () => {
    it('calls onButtonClick with correct button text when clicked', async () => {
      renderChatButtonCard()
      
      const button = screen.getByText(mockButtons[0])
      await user.click(button)
      
      expect(mockOnButtonClick).toHaveBeenCalledWith(mockButtons[0])
    })

    it('handles multiple button clicks', async () => {
      renderChatButtonCard()
      
      // Clear any previous calls
      mockOnButtonClick.mockClear()
      
      for (const buttonText of mockButtons) {
        const button = screen.getByText(buttonText)
        await user.click(button)
        expect(mockOnButtonClick).toHaveBeenCalledWith(buttonText)
      }
      
      expect(mockOnButtonClick).toHaveBeenCalledTimes(3)
    })

    it('maintains clickable state for all buttons', async () => {
      renderChatButtonCard()
      
      // Clear any previous calls
      mockOnButtonClick.mockClear()
      
      const button = screen.getByText(mockButtons[0])
      await user.click(button)
      await user.click(button)
      
      expect(mockOnButtonClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accessibility', () => {
    it('buttons are keyboard accessible', async () => {
      renderChatButtonCard()
      
      const button = screen.getByText(mockButtons[0])
      button.focus()
      await user.keyboard('{Enter}')
      
      expect(mockOnButtonClick).toHaveBeenCalledWith(mockButtons[0])
    })

    it('applies hover styles to buttons', () => {
      renderChatButtonCard()
      
      const button = screen.getByText(mockButtons[0])
      expect(button).toHaveClass('hover:bg-gray-50')
    })

    it('applies dark mode hover styles', () => {
      document.documentElement.classList.add('dark')
      renderChatButtonCard()
      
      const button = screen.getByText(mockButtons[0])
      expect(button).toHaveClass('dark:hover:bg-[#3a3b40]')
      
      document.documentElement.classList.remove('dark')
    })
  })

  describe('Edge Cases', () => {
    it('renders nothing when no buttons provided', () => {
      renderChatButtonCard({ buttons: [] })
      const buttonContainer = screen.getByTestId('chat-button-container')
      expect(buttonContainer.children).toHaveLength(0)
    })

    it('handles undefined clickedButton prop', () => {
      renderChatButtonCard({ clickedButton: undefined })
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).not.toHaveClass('bg-orange-500')
      })
    })

    it('handles long button text', () => {
      const longButtons = ['Very Long Button Text That Might Wrap']
      renderChatButtonCard({ buttons: longButtons })
      
      const button = screen.getByText(longButtons[0])
      expect(button).toBeInTheDocument()
    })
  })
})