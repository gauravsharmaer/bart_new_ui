
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../../redux/themeSlice'
import Home from '../../pages/Home/Home'
import '@testing-library/jest-dom/vitest'


vi.mock('../../components/Navbar', () => ({
  SiteHeader: () => <div data-testid="site-header">Site Header</div>
}))

vi.mock('../../pages/Home/SearchSection', () => ({
  SearchSection: () => <div data-testid="search-section">Search Section</div>
}))

vi.mock('../../pages/Home/FacialConfirmationPopup', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ setShowPopup, setShowConfirmationPopup }: any) => (
    <div data-testid="facial-confirmation-popup">
      <button onClick={() => setShowPopup(true)}>Show Popup</button>
      <button onClick={() => setShowConfirmationPopup(false)}>Close</button>
    </div>
  )
}))

vi.mock('../../pages/Home/ImageUploadPopup', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ setShowImageUploadPopup }: any) => (
    <div data-testid="image-upload-popup">
      <button onClick={() => setShowImageUploadPopup(false)}>Close Upload</button>
    </div>
  )
}))

vi.mock('../../pages/Home/verifyAuthCapture', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ onVerificationComplete }: any) => (
    <div data-testid="verify-auth-capture">
      <button onClick={onVerificationComplete}>Complete Verification</button>
    </div>
  )
}))

describe('Home Component', () => {
  // Setup mock localStorage
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    key: vi.fn()
  }

  const renderHome = (isDarkMode = false) => {
    const store = configureStore({
      reducer: {
        theme: themeReducer
      },
      preloadedState: {
        theme: {
          isDarkMode
        }
      }
    })

    return render(
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.localStorage = mockLocalStorage as Storage
  })

  describe('Initial Rendering', () => {
    it('renders basic components', () => {
      mockLocalStorage.getItem.mockReturnValue('true') // Face verified by default
      renderHome()
      expect(screen.getByTestId('site-header')).toBeInTheDocument()
      expect(screen.getByTestId('search-section')).toBeInTheDocument()
    })

    it('applies correct background based on theme', () => {
      mockLocalStorage.getItem.mockReturnValue('true')
      const { container } = renderHome(false)
      expect(container.firstChild).toHaveStyle({
        backgroundImage: expect.stringContaining('bgHome')
      })

      const { container: darkContainer } = renderHome(true)
      expect(darkContainer.firstChild).toHaveStyle({
        backgroundImage: expect.stringContaining('DarkBackground')
      })
    })
  })

  describe('Facial Verification Flow', () => {
    it('shows facial confirmation popup when face is not verified', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'isFaceVerified') return 'false'
        if (key === 'image') return 'some-image'
        return null
      })
      
      renderHome()
      expect(screen.getByTestId('facial-confirmation-popup')).toBeInTheDocument()
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('isFaceVerified')
    })

    it('does not show facial confirmation popup when face is verified', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'isFaceVerified') return 'true'
        if (key === 'image') return 'some-image'
        return null
      })
      
      renderHome()
      expect(screen.queryByTestId('facial-confirmation-popup')).not.toBeInTheDocument()
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('isFaceVerified')
    })



  
  })

  describe('Image Upload Flow', () => {
    it('shows image upload popup when no image is set', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'isFaceVerified') return 'true'
        if (key === 'image') return 'undefined'
        return null
      })
      
      renderHome()
      expect(screen.getByTestId('image-upload-popup')).toBeInTheDocument()
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('image')
    })

    it('does not show image upload popup when image is set', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'isFaceVerified') return 'true'
        if (key === 'image') return 'some-image-path'
        return null
      })
      
      renderHome()
      expect(screen.queryByTestId('image-upload-popup')).not.toBeInTheDocument()
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('image')
    })

    it('closes image upload popup', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'isFaceVerified') return 'true'
        if (key === 'image') return 'undefined'
        return null
      })
      
      renderHome()
      
      const closeButton = screen.getByText('Close Upload')
      fireEvent.click(closeButton)
      
      expect(screen.queryByTestId('image-upload-popup')).not.toBeInTheDocument()
    })
  })

  describe('Theme Integration', () => {
    it('applies dark mode classes when dark mode is enabled', () => {
      const { container } = renderHome(true)
      expect(container.firstChild).toHaveClass('dark:bg-[#1a1b1e]')
    })

    it('does not apply dark mode classes when dark mode is disabled', () => {
      const { container } = renderHome(false)
      expect(container.firstChild).not.toHaveClass('dark:bg-[#1a1b1e]')
    })
  })


})