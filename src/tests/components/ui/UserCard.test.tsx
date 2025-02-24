import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import UserCard from '../../../components/ui/UserCard'
import { BackendBaseUrl } from '../../../config'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

describe('UserCard Component', () => {
  const defaultProps = {
    name: 'John Doe',
    text: 'Hello, this is a test message',
    timestamp: '2024-01-01T12:00:00'
  }

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Mock the Date to ensure consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderUserCard = (props = {}) => {
    return render(
      <UserCard {...defaultProps} {...props} />
    )
  }

  describe('Rendering', () => {
    it('renders user message correctly', () => {
      renderUserCard()
      expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument()
    })

    it('renders formatted name correctly', () => {
      renderUserCard()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('renders formatted time correctly', () => {
      renderUserCard()
      // Use a more flexible matcher with regex
      const timeRegex = /12:00 PM/i
      expect(screen.getByText(timeRegex)).toBeInTheDocument()
    })

    it('renders dot separator', () => {
      renderUserCard()
      expect(screen.getByText('•')).toBeInTheDocument()
    })


  })

  describe('Profile Image Handling', () => {
    it('renders initials when no image in localStorage', () => {
      localStorage.setItem('name', 'John Doe')
      renderUserCard()
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('renders profile image when image exists in localStorage', () => {
      localStorage.setItem('image', 'profile.jpg')
      renderUserCard()
      
      const img = screen.getByAltText('Profile')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', `${BackendBaseUrl}/profile.jpg`)
    })


  })

  describe('Styling', () => {
    it('applies correct container styles', () => {
      renderUserCard()
      
      const container = screen.getByText(defaultProps.text).closest('.rounded-lg')
      expect(container).toHaveClass(
        'bg-[#A3A3A3]/[0.07]',
        'dark:bg-[#222121]',
        'transition-colors',
        'duration-200'
      )
    })

    it('applies correct text styles', () => {
      renderUserCard()
      
      const messageText = screen.getByText(defaultProps.text)
      expect(messageText).toHaveClass(
        'text-[14px]',
        'font-passenger',
        'font-normal',
        'text-gray-900',
        'dark:text-gray-200'
      )
    })

  })


  describe('Layout Structure', () => {
    it('maintains correct flex layout', () => {
      renderUserCard()
      
      const mainContainer = screen.getByText(defaultProps.text)
        .closest('.w-full')
      expect(mainContainer).toHaveClass('flex', 'justify-end')
    })

    it('maintains correct message content layout', () => {
      renderUserCard()
      
      const contentContainer = screen.getByText(defaultProps.text)
        .parentElement
      expect(contentContainer).toHaveClass('flex-grow')
    })
  })
})