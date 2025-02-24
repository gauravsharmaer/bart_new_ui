
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import PdfFileDisplay from '../../pages/ChatWithPdf/PdfFileDisplay'
import '@testing-library/jest-dom/vitest'

describe('PdfFileDisplay Component', () => {
  const defaultProps = {
    fileName: 'test-document.pdf',
    onClick: vi.fn()
  }

  const renderPdfDisplay = (props = defaultProps) => {
    return render(<PdfFileDisplay {...props} />)
  }

  describe('Rendering', () => {
    it('displays the PDF icon', () => {
      renderPdfDisplay()
      const pdfIcon = screen.getByAltText('PDF')
      expect(pdfIcon).toBeInTheDocument()
      expect(pdfIcon).toHaveClass('w-12', 'h-12')
    })

    it('displays the file name', () => {
      renderPdfDisplay()
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
    })

    it('displays the click instruction', () => {
      renderPdfDisplay()
      expect(screen.getByText('Click to open file')).toBeInTheDocument()
    })

    it('applies correct base styling', () => {
      const { container } = renderPdfDisplay()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-2',
        'bg-[#f8f8f8]',
        'dark:bg-[#f8f8f8]',
        'rounded-[14px]'
      )
    })

    it('applies border styling', () => {
      const { container } = renderPdfDisplay()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass(
        'border',
        'border-dotted',
        'border-[#d1cfc5]'
      )
    })

    it('applies correct text styling', () => {
      renderPdfDisplay()
      const fileName = screen.getByText('test-document.pdf')
      expect(fileName).toHaveClass(
        'text-sm',
        'text-gray-900',
        'dark:text-[#000000]',
        'font-medium'
      )
    })
  })

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      renderPdfDisplay()
      const container = screen.getByText('test-document.pdf').closest('div')
      if (container) {
        fireEvent.click(container)
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
      }
    })

    it('shows hover state styles', () => {
      const { container } = renderPdfDisplay()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass('hover:bg-gray-50')
    })

    it('has cursor pointer style', () => {
      const { container } = renderPdfDisplay()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass('cursor-pointer')
    })
  })

  describe('Props Handling', () => {
    it('renders with different file names', () => {
      renderPdfDisplay({
        ...defaultProps,
        fileName: 'different-file.pdf'
      })
      expect(screen.getByText('different-file.pdf')).toBeInTheDocument()
    })

    it('handles long file names', () => {
      renderPdfDisplay({
        ...defaultProps,
        fileName: 'very-long-file-name-that-might-need-truncation.pdf'
      })
      expect(screen.getByText('very-long-file-name-that-might-need-truncation.pdf')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('provides alt text for PDF icon', () => {
      renderPdfDisplay()
      expect(screen.getByAltText('PDF')).toBeInTheDocument()
    })

    it('maintains text contrast for readability', () => {
      renderPdfDisplay()
      const instruction = screen.getByText('Click to open file')
      expect(instruction).toHaveClass('opacity-60')
    })
  })

  describe('Layout Structure', () => {
  

    it('applies correct margin', () => {
      const { container } = renderPdfDisplay()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveStyle({ marginRight: '32px' })
    })
  })
})