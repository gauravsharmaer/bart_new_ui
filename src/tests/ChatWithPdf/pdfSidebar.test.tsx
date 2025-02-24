
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import PdfSidebar from '../../pages/ChatWithPdf/pdfSidebar'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../../redux/themeSlice'
import '@testing-library/jest-dom/vitest'

describe('PdfSidebar Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    pdfUrl: 'https://example.com/test.pdf'
  }

  const renderPdfSidebar = (props = defaultProps, isDarkMode = false) => {
    const store = configureStore({
      reducer: {
        theme: themeReducer
      },
      preloadedState: {
        theme: { isDarkMode }
      }
    })

    return render(
      <Provider store={store}>
        <PdfSidebar {...props} />
      </Provider>
    )
  }

  describe('Rendering', () => {


 

    it('renders close icon', () => {
      renderPdfSidebar()
      const closeIcon = screen.getByAltText('Close')
      expect(closeIcon).toBeInTheDocument()
      expect(closeIcon).toHaveClass('cursor-pointer')
    })

    it('renders iframe with correct URL', () => {
      renderPdfSidebar()
      const iframe = screen.getByTitle('PDF Preview')
      const expectedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(defaultProps.pdfUrl)}&embedded=true`
      expect(iframe).toHaveAttribute('src', expectedUrl)
    })
  })

  describe('Styling', () => {
    it('applies correct base styling', () => {
      const { container } = renderPdfSidebar()
      const sidebar = container.firstChild as HTMLElement
      expect(sidebar).toHaveStyle({
        backgroundColor: '#f3f5f9',
        height: 'calc(100% - 50px)',
        marginTop: '55px',
        borderRadius: '16px',
        width: '460px'
      })
    })

 

  
  })

  describe('Interactions', () => {
    it('calls onClose when clicking close icon', () => {
      renderPdfSidebar()
      const closeIcon = screen.getByAltText('Close')
      fireEvent.click(closeIcon)
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('URL Handling', () => {
    it('correctly encodes PDF URL for Google Docs viewer', () => {
      const testUrl = 'https://example.com/test file with spaces.pdf'
      renderPdfSidebar({ ...defaultProps, pdfUrl: testUrl })
      const iframe = screen.getByTitle('PDF Preview')
      const expectedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(testUrl)}&embedded=true`
      expect(iframe).toHaveAttribute('src', expectedUrl)
    })

  
  })

  describe('Accessibility', () => {
    it('provides alt text for close icon', () => {
      renderPdfSidebar()
      expect(screen.getByAltText('Close')).toBeInTheDocument()
    })

    it('provides title for iframe', () => {
      renderPdfSidebar()
      expect(screen.getByTitle('PDF Preview')).toBeInTheDocument()
    })

    it('ensures iframe is properly contained', () => {
      renderPdfSidebar()
      const iframe = screen.getByTitle('PDF Preview')
      expect(iframe.parentElement).toHaveClass('flex-1', 'overflow-hidden')
    })
  })

  describe('Animation', () => {
    it('has correct transition classes', () => {
      const { container } = renderPdfSidebar()
      const sidebar = container.firstChild as HTMLElement
      expect(sidebar).toHaveClass(
        'transition-all',
        'duration-300',
        'ease-in-out'
      )
    })
  })

  describe('Layout', () => {


    it('applies correct padding and margins', () => {
      renderPdfSidebar()
      const header = screen.getByAltText('Close').parentElement
      expect(header).toHaveClass('p-2')
      const pdfContainer = screen.getByTitle('PDF Preview').parentElement
      expect(pdfContainer).toHaveClass('p-3', 'mt-[-5px]')
    })
  })
})