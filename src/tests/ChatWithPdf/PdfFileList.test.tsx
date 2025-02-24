
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import PdfFileList from '../../pages/ChatWithPdf/PdfFileList'
import '@testing-library/jest-dom/vitest'

describe('PdfFileList Component', () => {
  // Create actual File objects for testing
  const mockPdfFiles = [
    new File([''], 'document1.pdf', { type: 'application/pdf' }),
    new File([''], 'test-file.pdf', { type: 'application/pdf' }),
    new File([''], 'sample-document-with-long-name.pdf', { type: 'application/pdf' })
  ]

  const defaultProps = {
    pdfFiles: mockPdfFiles,
    onRemove: vi.fn()
  }

  const renderPdfList = (props = defaultProps) => {
    return render(<PdfFileList {...props} />)
  }

  describe('Rendering', () => {
    it('renders all PDF files', () => {
      renderPdfList()
      mockPdfFiles.forEach(file => {
        expect(screen.getByText(file.name)).toBeInTheDocument()
      })
    })

    it('renders PDF icons for each file', () => {
      renderPdfList()
      const pdfIcons = screen.getAllByAltText('PDF')
      expect(pdfIcons).toHaveLength(mockPdfFiles.length)
      pdfIcons.forEach(icon => {
        expect(icon).toHaveClass('w-24', 'h-24')
      })
    })

    it('renders remove buttons for each file', () => {
      renderPdfList()
      const removeButtons = screen.getAllByAltText('Remove')
      expect(removeButtons).toHaveLength(mockPdfFiles.length)
    })

    it('applies correct container styling', () => {
      const { container } = renderPdfList()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass(
        'flex',
        'flex-wrap',
        'gap-3',
        'p-3',
        'bg-[#F7F5E]',
        'dark:bg-[#313131]',
        'rounded-2xl',
        'border',
        'border-dotted'
      )
    })
  })

  describe('File Name Display', () => {
    it('displays file names with correct styling', () => {
      renderPdfList()
      const fileNames = screen.getAllByText(/\.pdf/)
      fileNames.forEach(name => {
        expect(name).toHaveClass(
          'text-xs',
          'font-semibold',
          'text-gray-700',
          'truncate',
          'dark:text-[#ffffff]'
        )
      })
    })

    it('handles long file names with truncation', () => {
      renderPdfList()
      const longFileName = screen.getByText('sample-document-with-long-name.pdf')
      expect(longFileName.parentElement).toHaveStyle({ width: '160px' })
      expect(longFileName).toHaveClass('truncate')
    })
  })

  describe('Remove Functionality', () => {
    it('calls onRemove with correct file name when remove button clicked', () => {
      renderPdfList()
      const removeButtons = screen.getAllByAltText('Remove')
      
      fireEvent.click(removeButtons[0])
      expect(defaultProps.onRemove).toHaveBeenCalledWith('document1.pdf')
      
      fireEvent.click(removeButtons[1])
      expect(defaultProps.onRemove).toHaveBeenCalledWith('test-file.pdf')
    })

    it('positions remove button correctly', () => {
      renderPdfList()
      const removeButtons = screen.getAllByAltText('Remove')
      removeButtons.forEach(button => {
        expect(button).toHaveClass('w-5', 'h-5', 'mr-[-62px]', 'mt-[18px]')
      })
    })
  })

  describe('Layout Structure', () => {
    it('maintains correct flex layout for file items', () => {
      renderPdfList()
      const fileContainers = screen.getAllByAltText('PDF').map(icon => 
        icon.closest('.relative')
      )
      
      fileContainers.forEach(container => {
        expect(container).toHaveClass('relative', 'flex', 'flex-col', 'items-center')
      })
    })

    it('applies correct spacing and margins', () => {
      const { container } = renderPdfList()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass('ml-4', 'mr-3', 'mb-[-17px]')
    })
  })

  describe('Empty State', () => {
    it('renders empty container when no files provided', () => {
      renderPdfList({ ...defaultProps, pdfFiles: [] })
      expect(screen.queryByAltText('PDF')).not.toBeInTheDocument()
      expect(screen.queryByAltText('Remove')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('provides alt text for all images', () => {
      renderPdfList()
      expect(screen.getAllByAltText('PDF')).toHaveLength(mockPdfFiles.length)
      expect(screen.getAllByAltText('Remove')).toHaveLength(mockPdfFiles.length)
    })

    it('ensures remove buttons are clickable', () => {
      renderPdfList()
      const removeButtons = screen.getAllByRole('button')
      removeButtons.forEach(button => {
        expect(button).toBeEnabled()
      })
    })
  })

  describe('Dark Mode Support', () => {
    it('includes dark mode classes', () => {
      const { container } = renderPdfList()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass('dark:bg-[#313131]', 'dark:border-[#5d5d5d]')
      
      const fileNames = screen.getAllByText(/\.pdf/)
      fileNames.forEach(name => {
        expect(name).toHaveClass('dark:text-[#ffffff]')
      })
    })
  })
})