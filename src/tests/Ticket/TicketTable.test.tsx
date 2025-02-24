
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/test-utils'
import { TicketTable } from '../../pages/Ticket/TicketTable'
import TicketApiService from '../../pages/Ticket/api'
import '@testing-library/jest-dom/vitest'

// Mock the API service correctly
vi.mock('../../pages/Ticket/api', () => ({
  default: {
    getResolvedTickets: vi.fn(),
    getUnResolvedTickets: vi.fn(),
    getTicketHistory: vi.fn()
  }
}))

describe('TicketTable Component', () => {
  const mockTicketData = [
    {
        id: '1',
        name: 'Test Ticket 1',
        description: 'Test description',
        ticket_id: 'TICK-001',
        user_id: 'user1',
        status: 'Resolved',
        priority: 'High',
        created_at: '2024-01-01T12:00:00',
        link: '/ticket/1',
        assignee_name: 'No one'
    },
    {
        id: '2',
        name: 'Test Ticket 2',
        description: 'Test description',
        ticket_id: 'TICK-002',
        user_id: 'user2',
        status: 'Open',
        priority: 'Medium',
        created_at: '2024-01-01T12:00:00',
        link: '/ticket/2',
        assignee_name: 'No one'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('user_id', 'test-user-id')
    
    // Setup the mocks properly in beforeEach
    const mockGetTicketHistory = vi.fn().mockResolvedValue({ ticketHistory: mockTicketData })
    const mockGetResolvedTickets = vi.fn().mockResolvedValue({ ticketHistory: mockTicketData })
    const mockGetUnResolvedTickets = vi.fn().mockResolvedValue({ ticketHistory: mockTicketData })

    // Assign the mocks to the API service
    vi.mocked(TicketApiService.getTicketHistory).mockImplementation(mockGetTicketHistory)
    vi.mocked(TicketApiService.getResolvedTickets).mockImplementation(mockGetResolvedTickets)
    vi.mocked(TicketApiService.getUnResolvedTickets).mockImplementation(mockGetUnResolvedTickets)
  })

  describe('Loading State', () => {
    it('shows loading spinner initially', () => {
      render(<TicketTable type="all" />)
      expect(screen.getByRole('status')).toHaveClass('animate-spin')
    })
  })

  describe('Data Fetching', () => {
    it('fetches all tickets by default', async () => {
      render(<TicketTable type="all" />)

      await waitFor(() => {
        expect(TicketApiService.getTicketHistory).toHaveBeenCalledWith('test-user-id')
      })
    })

    it('fetches resolved tickets when type is resolved', async () => {
      render(<TicketTable type="resolved" />)

      await waitFor(() => {
        expect(TicketApiService.getResolvedTickets).toHaveBeenCalledWith('test-user-id')
      })
    })

    it('fetches unresolved tickets when type is unresolved', async () => {
      render(<TicketTable type="unresolved" />)

      await waitFor(() => {
        expect(TicketApiService.getUnResolvedTickets).toHaveBeenCalledWith('test-user-id')
      })
    })
  })

  describe('Table Rendering', () => {
    it('renders table headers correctly', async () => {
      render(<TicketTable type="all" />)

      await waitFor(() => {
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Ticket no')).toBeInTheDocument()
        expect(screen.getByText('Date and time')).toBeInTheDocument()
        expect(screen.getByText('Assigned to')).toBeInTheDocument()
        expect(screen.getByText('Status')).toBeInTheDocument()
        expect(screen.getByText('Updates')).toBeInTheDocument()
      })
    })

    it('renders ticket data correctly', async () => {
      render(<TicketTable type="all" />)

      await waitFor(() => {
        expect(screen.getByText('Test Ticket 1')).toBeInTheDocument()
        expect(screen.getByText('TICK-001')).toBeInTheDocument()
  
      })
    })




  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log')
      vi.mocked(TicketApiService.getTicketHistory).mockRejectedValueOnce(new Error('API Error'))

      render(<TicketTable type="all" />)

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalled()
      })
    })
  })

  describe('Links and Navigation', () => {
    it('renders ticket links with correct target', async () => {
      render(<TicketTable type="all" />)

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        links.forEach(link => {
          expect(link).toHaveAttribute('target', '_blank')
        })
      })
    })

    it('renders Genie logo for assignees', async () => {
      render(<TicketTable type="all" />)

      await waitFor(() => {
        const genieLogo = screen.getAllByAltText('Genie logo')
        expect(genieLogo[0]).toHaveClass('h-6', 'w-6', 'rounded-full')
      })
    })
  })
})