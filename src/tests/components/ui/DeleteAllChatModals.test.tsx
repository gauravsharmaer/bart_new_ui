
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import DeleteAllChatsModal from '../../../components/DeleteAllChatsModal'
import '@testing-library/jest-dom/vitest'

describe('DeleteAllChatsModal Component', () => {
  const mockOnCancel = vi.fn()
  const mockOnDelete = vi.fn()
  const user = userEvent.setup()

  const renderDeleteModal = (props = {}) => {
    return render(
      <DeleteAllChatsModal
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        {...props}
      />
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the modal with correct title', () => {
      renderDeleteModal()
      expect(screen.getByText('Delete All Chats?')).toBeInTheDocument()
    })

    it('renders the confirmation message', () => {
      renderDeleteModal()
      expect(screen.getByText('Are you sure you want to delete all chats?')).toBeInTheDocument()
    })

    it('renders the delete icon', () => {
      renderDeleteModal()
      const deleteIcon = screen.getByAltText('Delete Icon')
      expect(deleteIcon).toBeInTheDocument()
      expect(deleteIcon).toHaveClass('w-8', 'h-8', 'text-[#FF5600]')
    })

    it('renders both buttons', () => {
      renderDeleteModal()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Delete All')).toBeInTheDocument()
    })
  })

  describe('Button Interactions', () => {
    it('calls onCancel when Cancel button is clicked', async () => {
      renderDeleteModal()
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onDelete when Delete All button is clicked', async () => {
      renderDeleteModal()
      const deleteButton = screen.getByText('Delete All')
      await user.click(deleteButton)
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })

    it('applies hover styles to Cancel button', () => {
      renderDeleteModal()
      const cancelButton = screen.getByText('Cancel')
      expect(cancelButton).toHaveClass('hover:bg-gray-50')
    })

    it('applies hover styles to Delete All button', () => {
      renderDeleteModal()
      const deleteButton = screen.getByText('Delete All')
      expect(deleteButton).toHaveClass('hover:bg-gray-50')
    })
  })

  describe('Styling', () => {
    it('renders with correct modal overlay styles', () => {
      renderDeleteModal()
      const overlay = screen.getByRole('dialog').parentElement
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
      renderDeleteModal()
      const modalContent = screen.getByRole('dialog')
      expect(modalContent).toHaveClass(
        'bg-white',
        'rounded-2xl',
        'w-[390px]',
        'h-[226px]',
        'p-6',
        'shadow-lg'
      )
    })

    it('applies correct text styles', () => {
      renderDeleteModal()
      const title = screen.getByText('Delete All Chats?')
      const message = screen.getByText('Are you sure you want to delete all chats?')
      
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-[#202B3B]')
      expect(message).toHaveClass('text-lg', 'text-[#808080]', 'text-center')
    })

    it('applies correct button styles', () => {
      renderDeleteModal()
      const cancelButton = screen.getByText('Cancel')
      const deleteButton = screen.getByText('Delete All')
      
      expect(cancelButton).toHaveClass('text-[#808080]', 'text-lg', 'font-regular')
      expect(deleteButton).toHaveClass('text-[#ED2B31]', 'text-lg', 'font-regular')
    })
  })

  describe('Accessibility', () => {
    it('renders modal with dialog role', () => {
      renderDeleteModal()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('renders buttons with correct roles', () => {
      renderDeleteModal()
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })

    it('maintains focus management', async () => {
      renderDeleteModal()
      const cancelButton = screen.getByText('Cancel')
      const deleteButton = screen.getByText('Delete All')
      
      await user.tab()
      expect(cancelButton).toHaveFocus()
      
      await user.tab()
      expect(deleteButton).toHaveFocus()
    })
  })
})