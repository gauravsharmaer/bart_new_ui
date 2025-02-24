import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import DeleteChatModal from '../../../components/DeleteChatModal'
import '@testing-library/jest-dom/vitest'

describe('DeleteChatModal Component', () => {
  const defaultProps = {
    chatName: 'Test Chat',
    chatId: '123',
    onCancel: vi.fn(),
    onDelete: vi.fn()
  }

  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderDeleteChatModal = (props = {}) => {
    return render(
      <DeleteChatModal
        {...defaultProps}
        {...props}
      />
    )
  }

  describe('Rendering', () => {
    it('renders the modal with correct title', () => {
      renderDeleteChatModal()
      expect(screen.getByText('Delete Chat?')).toBeInTheDocument()
    })

 

    it('renders both delete icons (light and dark mode)', () => {
      renderDeleteChatModal()
      const deleteIcons = screen.getAllByAltText('Delete Icon')
      expect(deleteIcons).toHaveLength(2)
      
      expect(deleteIcons[0]).toHaveClass('dark:hidden')
      expect(deleteIcons[1]).toHaveClass('hidden', 'dark:block')
    })

    it('renders cancel and delete buttons', () => {
      renderDeleteChatModal()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    it('calls onCancel when Cancel button is clicked', async () => {
      renderDeleteChatModal()
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onDelete with chatId when Delete button is clicked', async () => {
      renderDeleteChatModal()
      const deleteButton = screen.getByText('Delete')
      await user.click(deleteButton)
      expect(defaultProps.onDelete).toHaveBeenCalledWith('123')
      expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Styling', () => {
    it('renders with correct modal overlay styles', () => {
      renderDeleteChatModal()
      const overlay = screen.getByText('Delete Chat?').parentElement?.parentElement?.parentElement
      expect(overlay).toHaveClass(
        'fixed',
        'inset-0',
        'flex',
        'items-center',
        'justify-center',
        'bg-black',
        'bg-opacity-20',
        'z-50'
      )
    })

    it('renders with correct modal content styles', () => {
      renderDeleteChatModal()
      const modalContent = screen.getByText('Delete Chat?').parentElement?.parentElement
      expect(modalContent).toHaveClass(
        'bg-white',
        'rounded-2xl',
        'shadow-lg',
        'dark:bg-[#313131]'
      )
    })

    it('applies correct button styles', () => {
      renderDeleteChatModal()
      const cancelButton = screen.getByText('Cancel')
      const deleteButton = screen.getByText('Delete')
      
      expect(cancelButton).toHaveClass(
        'text-[#808080]',
        'hover:bg-gray-50',
        'dark:hover:bg-[#4f4f4f]',
        'rounded-bl-2xl'
      )
      
      expect(deleteButton).toHaveClass(
        'text-[#ED2B31]',
        'hover:bg-gray-50',
        'dark:hover:bg-[#4f4f4f]',
        'rounded-br-2xl'
      )
    })

    it('applies correct dark mode styles', () => {
      renderDeleteChatModal()
      const title = screen.getByText('Delete Chat?')
      expect(title).toHaveClass('dark:text-[#ffffff]')
      
      const divider = screen.getByText('Cancel').parentElement
      expect(divider).toHaveClass('dark:border-[#4f4f4f]')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty chat name', () => {
      renderDeleteChatModal({ chatName: '' })
      expect(screen.getByText('""')).toBeInTheDocument()
    })

    it('handles long chat names', () => {
      const longChatName = 'A'.repeat(50)
      renderDeleteChatModal({ chatName: longChatName })
      expect(screen.getByText(`"${longChatName}"`)).toBeInTheDocument()
    })

    it('handles undefined chatId', async () => {
      const onDelete = vi.fn()
      renderDeleteChatModal({ 
        chatId: undefined,
        onDelete
      })
      
      const deleteButton = screen.getByText('Delete')
      await user.click(deleteButton)
      
      expect(onDelete).toHaveBeenCalledWith(undefined)
    })
  })

  describe('Accessibility', () => {
    it('maintains focus management', async () => {
      renderDeleteChatModal()
      const cancelButton = screen.getByText('Cancel')
      const deleteButton = screen.getByText('Delete')
      
      await user.tab()
      expect(cancelButton).toHaveFocus()
      
      await user.tab()
      expect(deleteButton).toHaveFocus()
    })

    it('provides alt text for delete icons', () => {
      renderDeleteChatModal()
      const deleteIcons = screen.getAllByAltText('Delete Icon')
      deleteIcons.forEach(icon => {
        expect(icon).toHaveAttribute('alt', 'Delete Icon')
      })
    })
  })
})