
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import Notification from '../../pages/Home/Notification'
import '@testing-library/jest-dom/vitest'

describe('Notification Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn()
  }

  const renderNotification = (props = defaultProps) => {
    return render(<Notification {...props} />)
  }

  describe('Rendering', () => {
    it('renders the notification sidebar when open', () => {
      renderNotification()
      expect(screen.getByText('Your Notification')).toBeInTheDocument()
      expect(screen.getByText('Get timely updates and alerts when you need them most.')).toBeInTheDocument()
    })

    it('renders filter buttons', () => {
      renderNotification()
      expect(screen.getByText('All')).toBeInTheDocument()
      expect(screen.getByText('Unread')).toBeInTheDocument()
    })

    it('renders notification items', () => {
      renderNotification()
      expect(screen.getByText('Update on password recovery')).toBeInTheDocument()
      expect(screen.getByText('Laptop Recovery')).toBeInTheDocument()
    })

    it('shows correct timestamp for notifications', () => {
      renderNotification()
      expect(screen.getByText('Just now')).toBeInTheDocument()
      expect(screen.getByText('2 day ago')).toBeInTheDocument()
    })


  })

  describe('Filter Functionality', () => {
    it('shows all notifications by default', () => {
      renderNotification()
      const notifications = screen.getAllByRole('heading', { level: 3 })
      expect(notifications).toHaveLength(2)
    })

    it('filters unread notifications when clicking Unread', () => {
      renderNotification()
      const unreadButton = screen.getByText('Unread')
      fireEvent.click(unreadButton)
      
      const notifications = screen.getAllByRole('heading', { level: 3 })
      expect(notifications).toHaveLength(1)
      expect(screen.getByText('Update on password recovery')).toBeInTheDocument()
      expect(screen.queryByText('Laptop Recovery')).not.toBeInTheDocument()
    })

    it('shows unread notification count', () => {
      renderNotification()
      const unreadCount = screen.getByText('1')
      expect(unreadCount).toHaveClass('bg-[#EF613C]')
    })

    it('switches back to all notifications', () => {
      renderNotification()
      
      // Switch to unread
      fireEvent.click(screen.getByText('Unread'))
      expect(screen.queryByText('Laptop Recovery')).not.toBeInTheDocument()
      
      // Switch back to all
      fireEvent.click(screen.getByText('All'))
      expect(screen.getByText('Laptop Recovery')).toBeInTheDocument()
    })
  })

  describe('Interactive Elements', () => {
    it('calls onClose when clicking close button', () => {
      renderNotification()
      const closeButton = screen.getByText('←')
      fireEvent.click(closeButton)
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

   

    it('renders clickable links in notifications', () => {
      renderNotification()
      const timelineLink = screen.getByText('timeline')
      const clickHereLink = screen.getByText('click here')
      
      expect(timelineLink).toHaveAttribute('href', '#')
      expect(clickHereLink).toHaveAttribute('href', '#')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderNotification()
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Your Notification')
      const h3Headers = screen.getAllByRole('heading', { level: 3 })
      expect(h3Headers).toHaveLength(2)
    })

    it('maintains focus trap when open', () => {
      renderNotification()
      const closeButton = screen.getByText('←')
      const allButton = screen.getByText('All')
      const unreadButton = screen.getByText('Unread')
      
      expect(closeButton).toBeVisible()
      expect(allButton).toBeVisible()
      expect(unreadButton).toBeVisible()
    })

   
  })

  describe('Click Outside Behavior', () => {
    it('closes notification when clicking outside', () => {
      renderNotification()
      
      // Simulate click outside
      fireEvent.mouseDown(document.body)
      
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

 
  })

  describe('Styling and Visual Elements', () => {
    it('applies correct styling to active filter', () => {
      renderNotification()
      const allButton = screen.getByText('All')
      expect(allButton).toHaveClass('bg-white', 'text-gray-900')
    })

    it('renders notification avatars', () => {
      renderNotification()
      const avatars = screen.getAllByText('DR')
      expect(avatars[0]).toHaveClass('bg-[#EF613C]')
    })

  })
})