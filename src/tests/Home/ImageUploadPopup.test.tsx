
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import ImageUploadPopup from '../../pages/Home/ImageUploadPopup'
import { uploadImage } from '../../Api/CommonApi'
import { toast } from 'react-toastify'
import '@testing-library/jest-dom/vitest'

// Mock dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('../../Api/CommonApi', () => ({
  uploadImage: vi.fn()
}))

vi.mock('react-webcam', () => ({
  default: vi.fn().mockImplementation(() => {
    return {
      getScreenshot: () => 'mock-screenshot-data'
    }
  })
}))

describe('ImageUploadPopup Component', () => {
  const mockSetShowImageUploadPopup = vi.fn()
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
    mockLocalStorage.getItem.mockReturnValue('123') // Mock user_id
  })

  const renderPopup = () => {
    return render(
      <ImageUploadPopup setShowImageUploadPopup={mockSetShowImageUploadPopup} />
    )
  }

  describe('Rendering', () => {
    it('renders initial state correctly', () => {
      renderPopup()
      expect(screen.getByAltText('Profile Placeholder')).toBeInTheDocument()
      expect(screen.getByText('Take Photo')).toBeInTheDocument()
      expect(screen.getByText('Upload Photo')).toBeInTheDocument()
    })

    it('renders close button with correct aria-label', () => {
      renderPopup()
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    })
  })

  describe('File Upload', () => {
    it('handles file selection', async () => {
      renderPopup()
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        Object.defineProperty(fileInput, 'files', {
          value: [file]
        })
        fireEvent.change(fileInput)
      }

      await waitFor(() => {
        expect(screen.getByText('Upload Image')).toBeInTheDocument()
      })
    })

    it('shows error for invalid file type', async () => {
      renderPopup()
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      
      if (fileInput) {
        Object.defineProperty(fileInput, 'files', {
          value: [file]
        })
        fireEvent.change(fileInput)
      }

      const uploadButton = screen.getByText('Upload Image')
      fireEvent.click(uploadButton)

      expect(toast.error).toHaveBeenCalledWith('Only JPEG and PNG images are allowed')
    })
  })



  describe('Upload Functionality', () => {


    it('handles upload failure', async () => {
      vi.mocked(uploadImage).mockRejectedValueOnce(new Error('Upload failed'))
      renderPopup()
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      
      if (fileInput) {
        Object.defineProperty(fileInput, 'files', {
          value: [file]
        })
        fireEvent.change(fileInput)
      }

      const uploadButton = await screen.findByText('Upload Image')
      fireEvent.click(uploadButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Upload failed')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles missing user ID', async () => {
      mockLocalStorage.getItem.mockReturnValueOnce(null)
      renderPopup()
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      
      if (fileInput) {
        Object.defineProperty(fileInput, 'files', {
          value: [file]
        })
        fireEvent.change(fileInput)
      }

      const uploadButton = await screen.findByText('Upload Image')
      fireEvent.click(uploadButton)

      expect(toast.error).toHaveBeenCalledWith('User ID not found. Please log in again.')
    })

    it('handles missing file selection', async () => {
      renderPopup()
      const uploadButton = screen.queryByText('Upload Image')
      if (uploadButton) {
        fireEvent.click(uploadButton)
        expect(toast.error).toHaveBeenCalledWith('Please select an image')
      }
    })
  })
})