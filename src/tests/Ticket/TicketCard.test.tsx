
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/test-utils'
import { act } from '@testing-library/react'
import TicketCard from '../../pages/Ticket/TicketCard'
import TicketApiService from '../../pages/Ticket/api'
import '@testing-library/jest-dom/vitest'

// Mock the API service
vi.mock('../../pages/Ticket/api', () => ({
  default: {
    getResolvedTickets: vi.fn(),
    getUnResolvedTickets: vi.fn(),
    getTicketHistory: vi.fn()
  }
}))

describe('TicketCard Component', () => {
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
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('user_id', 'test-user-id')
  })

  const renderTicketCard = async (type = 'all' as 'all' | 'resolved' | 'unresolved') => {
    let component
    await act(async () => {
      component = render(<TicketCard type={type} />)
    })
    return component
  }

  describe('Loading State', () => {


    it('hides loading spinner after data loads', async () => {
      vi.mocked(TicketApiService.getTicketHistory).mockResolvedValueOnce({
        ticketHistory: mockTicketData
      })

      await renderTicketCard()
      
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })
  })

  describe('Data Fetching', () => {
    it('fetches all tickets by default', async () => {
      vi.mocked(TicketApiService.getTicketHistory).mockResolvedValueOnce({
        ticketHistory: mockTicketData
      })

      await renderTicketCard()

      await waitFor(() => {
        expect(TicketApiService.getTicketHistory).toHaveBeenCalledWith('test-user-id')
      })
    })

    it('fetches resolved tickets when type is resolved', async () => {
      vi.mocked(TicketApiService.getResolvedTickets).mockResolvedValueOnce({
        ticketHistory: mockTicketData
      })

      await renderTicketCard('resolved')

      await waitFor(() => {
        expect(TicketApiService.getResolvedTickets).toHaveBeenCalledWith('test-user-id')
      })
    })
  })

  describe('Card Rendering', () => {
    beforeEach(async () => {
      vi.mocked(TicketApiService.getTicketHistory).mockResolvedValueOnce({
        ticketHistory: mockTicketData
      })
    })


    it('renders correct number of cards', async () => {
      await renderTicketCard()

      await waitFor(() => {
        const cards = screen.getAllByRole('link')
        expect(cards).toHaveLength(2)
      })
    })

    it('applies correct styling to cards', async () => {
      await renderTicketCard()

      await waitFor(() => {
        const cards = screen.getAllByRole('link')
        expect(cards[0]).toHaveClass('block', 'transition-transform', 'hover:scale-[1.02]')
      })
    })
  })




  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log')
      vi.mocked(TicketApiService.getTicketHistory).mockRejectedValueOnce(
        new Error('API Error')
      )

      await renderTicketCard()

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalled()
      })
    })
  })
})
