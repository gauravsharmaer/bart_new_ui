
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/test-utils'

import TicketCard from '../../../components/ui/ticketcard'
import '@testing-library/jest-dom/vitest'

describe('TicketCard Component', () => {
  const defaultProps = {
    name: 'Test Ticket',
    description: 'Test Description',
    ticket_id: 'TICK-123',
    assignee_name: 'John Doe',
    ticket_link: '/ticket/123'
  }


  const renderTicketCard = (props = {}) => {
    return render(
  
        <TicketCard {...defaultProps} {...props} />
    )
  }

  describe('Rendering', () => {
    it('renders with all provided props', () => {
      renderTicketCard()

      expect(screen.getByText('Test Ticket')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('TICK-123')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('renders ticket status as Open', () => {
      renderTicketCard()
      
      const status = screen.getByText('Open')
      expect(status).toBeInTheDocument()
      expect(status).toHaveClass('text-red-500', 'dark:text-red-400', 'font-semibold')
    })

    it('renders link with correct href', () => {
      renderTicketCard()
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/ticket/123')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  describe('Fallback Values', () => {
    it('renders "Untitled Ticket" when name is not provided', () => {
      renderTicketCard({ name: undefined })
      expect(screen.getByText('Untitled Ticket')).toBeInTheDocument()
    })

    it('renders "No description provided" when description is not provided', () => {
      renderTicketCard({ description: undefined })
      expect(screen.getByText('No description provided')).toBeInTheDocument()
    })

    it('renders "N/A" when ticket_id is not provided', () => {
      renderTicketCard({ ticket_id: undefined })
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('renders "Unassigned" when assignee_name is not provided', () => {
      renderTicketCard({ assignee_name: undefined })
      expect(screen.getByText('Unassigned')).toBeInTheDocument()
    })

    it('renders "#" as link when ticket_link is not provided', () => {
      renderTicketCard({ ticket_link: undefined })
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '#')
    })
  })

  describe('Styling', () => {
    it('applies correct base styles to container', () => {
      renderTicketCard()
      
      const container = screen.getByRole('link').parentElement
      expect(container).toHaveClass(
        'bg-white',
        'dark:bg-[#2c2d32]',
        'shadow-md',
        'rounded-lg',
        'p-4',
        'mt-4',
        'border',
        'border-gray-200'
      )
    })

    it('applies correct styles to ticket name', () => {
      renderTicketCard()
      
      const name = screen.getByText('Test Ticket')
      expect(name).toHaveClass(
        'font-semibold',
        'text-gray-800',
        'dark:text-gray-200',
        'text-lg',
        'mb-2'
      )
    })

    it('applies correct styles to ticket details section', () => {
      renderTicketCard()
      
      const detailsSection = screen.getByText('Ticket No').parentElement?.parentElement
      expect(detailsSection).toHaveClass(
        'bg-gray-100',
        'dark:bg-[#1a1b1e]',
        'rounded-lg',
        'p-3'
      )
    })
  })

  describe('Layout Structure', () => {
    it('renders ticket information in correct order', () => {
      renderTicketCard()
      
      const content = screen.getByRole('link')
      const elements = content.children
      
      expect(elements[0]).toHaveTextContent(/Ticket Status/)
      expect(elements[1]).toHaveTextContent('Test Ticket')
      expect(elements[2]).toHaveTextContent('Test Description')
      expect(elements[3]).toContainElement(screen.getByText('Ticket No'))
    })

    it('renders ticket details in correct layout', () => {
      renderTicketCard()
      
      const ticketNoRow = screen.getByText('Ticket No').parentElement
      const assigneeRow = screen.getByText('Assigned to').parentElement
      
      expect(ticketNoRow).toHaveClass('flex', 'justify-between', 'items-center')
      expect(assigneeRow).toHaveClass('flex', 'justify-between', 'items-center')
    })
  })

  describe('Accessibility', () => {
    it('renders link with accessible attributes', () => {
      renderTicketCard()
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('maintains text contrast in dark mode', () => {
      renderTicketCard()
      
      const description = screen.getByText('Test Description')
      expect(description).toHaveClass('dark:text-gray-400')
    })
  })
})