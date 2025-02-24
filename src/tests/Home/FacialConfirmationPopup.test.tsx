
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import FacialConfirmationPopup from '../../pages/Home/FacialConfirmationPopup'
import '@testing-library/jest-dom/vitest'

describe('FacialConfirmationPopup Component', () => {
  const defaultProps = {
    setShowConfirmationPopup: vi.fn(),
    setShowPopup: vi.fn(),
    showConfirmationPopup: true,
  }

  const renderPopup = (props = defaultProps) => {
    return render(<FacialConfirmationPopup {...props} />)
  }

  describe('Rendering', () => {
    it('renders the popup with correct content', () => {
      renderPopup()
      
      // Check for title and description
      expect(screen.getByText('Face Description Not Found')).toBeInTheDocument()
      expect(screen.getByText(/Your face description is not in our database/)).toBeInTheDocument()
      
      // Check for buttons
      expect(screen.getByText('Yes, Add Now')).toBeInTheDocument()
      expect(screen.getByText('No, Skip')).toBeInTheDocument()
    })

    it('renders close button with correct aria-label', () => {
      renderPopup()
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    })


  })

  describe('Button Interactions', () => {
    it('closes popup when clicking close button', () => {
      renderPopup()
      
      const closeButton = screen.getByLabelText('Close modal')
      fireEvent.click(closeButton)
      
      expect(defaultProps.setShowConfirmationPopup).toHaveBeenCalledWith(false)
      expect(defaultProps.setShowConfirmationPopup).toHaveBeenCalledTimes(1)
    })

    it('handles "Yes, Add Now" button click correctly', () => {
      renderPopup()
      
      const addButton = screen.getByText('Yes, Add Now')
      fireEvent.click(addButton)
      
      expect(defaultProps.setShowConfirmationPopup).toHaveBeenCalledWith(false)
      expect(defaultProps.setShowPopup).toHaveBeenCalledWith(true)
    })

  
  })

  describe('Accessibility', () => {
    it('has accessible button elements', () => {
      renderPopup()
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
        expect(button).toBeEnabled()
      })
    })

    it('has proper heading hierarchy', () => {
      renderPopup()
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Face Description Not Found')
    })


  })

  describe('Props Validation', () => {
    it('calls setShowConfirmationPopup with correct arguments', () => {
      const mockSetShowConfirmationPopup = vi.fn()
      renderPopup({
        ...defaultProps,
        setShowConfirmationPopup: mockSetShowConfirmationPopup
      })
      
      const closeButton = screen.getByLabelText('Close modal')
      fireEvent.click(closeButton)
      
      expect(mockSetShowConfirmationPopup).toHaveBeenCalledWith(false)
    })

    it('calls setShowPopup with correct arguments', () => {
      const mockSetShowPopup = vi.fn()
      renderPopup({
        ...defaultProps,
        setShowPopup: mockSetShowPopup
      })
      
      const addButton = screen.getByText('Yes, Add Now')
      fireEvent.click(addButton)
      
      expect(mockSetShowPopup).toHaveBeenCalledWith(true)
    })
  })
})