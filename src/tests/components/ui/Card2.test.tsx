
import { describe, it, expect } from 'vitest'
import { render, screen} from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import Card2 from '../../../components/ui/Card2'
import '@testing-library/jest-dom/vitest'

describe('Card2 Component', () => {
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('renders all option buttons', () => {
      render(<Card2 />)
      
      expect(screen.getByText('Email Verification')).toBeInTheDocument()
      expect(screen.getByText('Face Recognition')).toBeInTheDocument()
    })

    it('initially renders buttons with default styles', () => {
      render(<Card2 />)
      
      const emailButton = screen.getByText('Email Verification')
      const faceButton = screen.getByText('Face Recognition')

      // Check initial styling (not active)
      expect(emailButton).toHaveClass('bg-white', 'border', 'border-gray-300')
      expect(faceButton).toHaveClass('bg-white', 'border', 'border-gray-300')
    })
  })

  describe('Interaction', () => {
    it('updates active state when clicking Email Verification', async () => {
      render(<Card2 />)
      
      const emailButton = screen.getByText('Email Verification')
      await user.click(emailButton)

      // Check active styling
      expect(emailButton).toHaveClass('bg-orange-500', 'text-white')
      // Check other button remains inactive
      expect(screen.getByText('Face Recognition')).toHaveClass('bg-white')
    })

    it('updates active state when clicking Face Recognition', async () => {
      render(<Card2 />)
      
      const faceButton = screen.getByText('Face Recognition')
      await user.click(faceButton)

      // Check active styling
      expect(faceButton).toHaveClass('bg-orange-500', 'text-white')
      // Check other button remains inactive
      expect(screen.getByText('Email Verification')).toHaveClass('bg-white')
    })

    it('allows switching between options', async () => {
      render(<Card2 />)
      
      const emailButton = screen.getByText('Email Verification')
      const faceButton = screen.getByText('Face Recognition')

      // Click first option
      await user.click(emailButton)
      expect(emailButton).toHaveClass('bg-orange-500')
      expect(faceButton).toHaveClass('bg-white')

      // Click second option
      await user.click(faceButton)
      expect(faceButton).toHaveClass('bg-orange-500')
      expect(emailButton).toHaveClass('bg-white')
    })

    it('maintains hover styles on inactive buttons', () => {
      render(<Card2 />)
      
      const emailButton = screen.getByText('Email Verification')
      
      // Check hover class is present on inactive buttons
      expect(emailButton).toHaveClass('hover:bg-gray-100')
    })
  })

  describe('Accessibility', () => {
    it('buttons are keyboard accessible', async () => {
      render(<Card2 />)
      
      const emailButton = screen.getByText('Email Verification')
      
      // Focus and activate with keyboard
      emailButton.focus()
      await user.keyboard('{Enter}')
      
      expect(emailButton).toHaveClass('bg-orange-500', 'text-white')
    })

    it('buttons have proper role', () => {
      render(<Card2 />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })
})