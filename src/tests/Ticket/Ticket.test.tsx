
import { describe, it, expect,  beforeEach } from 'vitest'
import { render, screen } from '../../test/test-utils'
import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tickets from '../../pages/Ticket/Ticket'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../../redux/themeSlice'
import '@testing-library/jest-dom/vitest'

describe('Tickets Component', () => {
  const user = userEvent.setup()

  // Create a mock store
  const createMockStore = (isDarkMode = false) => {
    return configureStore({
      reducer: {
        theme: themeReducer
      },
      preloadedState: {
        theme: {
          isDarkMode
        }
      }
    })
  }

  const renderTickets = async (isDarkMode = false) => {
    const store = createMockStore(isDarkMode)
    await act(async () => {
      render(
        <Provider store={store}>
          <Tickets />
        </Provider>
      )
    })
  }

  describe('Header and Search', () => {
    beforeEach(async () => {
      await renderTickets()
    })

    it('renders the header title', () => {
      expect(screen.getByText('My tickets')).toBeInTheDocument()
    })

    it('renders search input with correct placeholder', () => {
      const searchInput = screen.getByPlaceholderText('Search tickets')
      expect(searchInput).toBeInTheDocument()
    })

    it('allows typing in search input', async () => {
      const searchInput = screen.getByPlaceholderText('Search tickets')
      await user.type(searchInput, 'test ticket')
      expect(searchInput).toHaveValue('test ticket')
    })
  })

  describe('Tab Navigation', () => {
    beforeEach(async () => {
      await renderTickets()
    })



    it('highlights active tab correctly', async () => {
      const unresolvedTab = screen.getByText('Ticket not resolved')
      await user.click(unresolvedTab)
      expect(unresolvedTab).toHaveClass('border-[#523ec6]')
    })

    it('switches between tabs', async () => {
      const resolvedTab = screen.getByText('Resolved Ticket')
      await user.click(resolvedTab)
      expect(resolvedTab).toHaveClass('border-[#523ec6]')
    })
  })



  describe('Filter Controls', () => {
    beforeEach(async () => {
      await renderTickets()
    })

    it('renders apply filters button', () => {
      expect(screen.getByText('Apply filters')).toBeInTheDocument()
    })

    it('renders filter button with dropdown icon', () => {
      const filterButton = screen.getByText('Apply filters')
      expect(filterButton.querySelector('svg')).toBeInTheDocument()
    })
  })



 

  describe('Responsive Design', () => {
    it('maintains layout on different screen sizes', async () => {
      await renderTickets()
      
      const container = screen.getByRole('main')
      expect(container).toHaveClass('flex', 'flex-col', 'px-6', 'py-8')
    })
  })
})
