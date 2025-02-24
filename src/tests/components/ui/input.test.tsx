import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen} from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { Input } from '../../../components/ui/input'
import '@testing-library/jest-dom/vitest'

describe('Input Component', () => {
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })



    it('renders with provided type', () => {
      render(<Input type="email" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders with provided placeholder', () => {
      const placeholder = 'Enter your name'
      render(<Input placeholder={placeholder} />)
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })

    it('applies default classes', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-base',
        'ring-offset-background',
        'file:border-0',
        'file:bg-transparent',
        'file:text-sm',
        'file:font-medium',
        'md:text-sm'
      )
    })

    it('applies additional className when provided', () => {
      const customClass = 'custom-class'
      render(<Input className={customClass} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass(customClass)
    })
  })

  describe('Functionality', () => {
    it('handles text input', async () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      
      await user.type(input, 'Hello')
      expect(input).toHaveValue('Hello')
    })

    it('handles disabled state', () => {
      render(<Input disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('spreads additional props to input element', () => {
      const testId = 'test-input'
      render(<Input data-testid={testId} aria-label="Test Input" />)
      const input = screen.getByTestId(testId)
      expect(input).toHaveAttribute('aria-label', 'Test Input')
    })
  })

  describe('Focus States', () => {
    it('applies focus-visible styles when focused', async () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      
      await user.click(input)
      expect(input).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2'
      )
    })
  })


  describe('Edge Cases', () => {
    it('handles empty string value', async () => {
      render(<Input value="" onChange={() => {}} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('handles undefined value', () => {
      render(<Input value={undefined} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('handles long input text', async () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      const longText = 'a'.repeat(100)
      
      await user.type(input, longText)
      expect(input).toHaveValue(longText)
    })
  })
})