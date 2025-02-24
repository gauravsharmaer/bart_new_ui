
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import OtpInputCard from '../../../components/ui/OtpInputCard'
import '@testing-library/jest-dom/vitest'

describe('OtpInputCard Component', () => {
  const mockOnSubmitOTP = vi.fn()
  const mockSetOtp = vi.fn()
  const initialOtp = ['', '', '', '', '', '']
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderOtpInputCard = () => {
    return render(
      <OtpInputCard
        onSubmitOTP={mockOnSubmitOTP}
        otp={initialOtp}
        setOtp={mockSetOtp}
      />
    )
  }

  describe('Rendering', () => {
    it('renders the title text', () => {
      renderOtpInputCard()
      expect(screen.getByText('Please enter the OTP below:')).toBeInTheDocument()
    })

    it('renders six input fields', () => {
      renderOtpInputCard()
      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(6)
    })

    it('renders submit button', () => {
      renderOtpInputCard()
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })

    it('applies correct styling to input fields', () => {
      renderOtpInputCard()
      const inputs = screen.getAllByRole('textbox')
      
      inputs.forEach(input => {
        expect(input).toHaveClass(
          'w-12',
          'h-12',
          'text-center',
          'text-lg',
          'font-medium',
          'border',
          'border-gray-300',
          'rounded-md'
        )
      })
    })
  })

  describe('Input Handling', () => {
    it('accepts only numeric input', async () => {
      renderOtpInputCard()
      const inputs = screen.getAllByRole('textbox')
      
      await user.type(inputs[0], 'a')
      expect(mockSetOtp).not.toHaveBeenCalled()
      
      await user.type(inputs[0], '1')
      expect(mockSetOtp).toHaveBeenCalled()
    })

    it('moves focus to next input after entering a digit', async () => {
      renderOtpInputCard()
      const inputs = screen.getAllByRole('textbox')
      
      await user.type(inputs[0], '1')
      expect(document.activeElement).toBe(inputs[1])
    })

    it('moves focus to previous input on backspace when current input is empty', async () => {
      renderOtpInputCard()
      const inputs = screen.getAllByRole('textbox')
      
      // Focus second input
      inputs[1].focus()
      
      await user.keyboard('{Backspace}')
      expect(document.activeElement).toBe(inputs[0])
    })

    it('does not move focus back on backspace when current input has value', async () => {
      const otpWithValue = ['1', '', '', '', '', '']
      render(
        <OtpInputCard
          onSubmitOTP={mockOnSubmitOTP}
          otp={otpWithValue}
          setOtp={mockSetOtp}
        />
      )
      
      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus()
      
      await user.keyboard('{Backspace}')
      expect(document.activeElement).toBe(inputs[0])
    })
  })

  describe('Form Submission', () => {
    it('submits when all inputs are filled and submit button is clicked', async () => {
      const filledOtp = ['1', '2', '3', '4', '5', '6']
      render(
        <OtpInputCard
          onSubmitOTP={mockOnSubmitOTP}
          otp={filledOtp}
          setOtp={mockSetOtp}
        />
      )
      
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)
      
      expect(mockOnSubmitOTP).toHaveBeenCalledWith('123456')
    })

    it('submits when Enter key is pressed with complete OTP', async () => {
      const filledOtp = ['1', '2', '3', '4', '5', '6']
      render(
        <OtpInputCard
          onSubmitOTP={mockOnSubmitOTP}
          otp={filledOtp}
          setOtp={mockSetOtp}
        />
      )
      
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[5], '{Enter}')
      
      expect(mockOnSubmitOTP).toHaveBeenCalledWith('123456')
    })

    it('does not submit when OTP is incomplete', async () => {
      const incompleteOtp = ['1', '2', '3', '', '', '']
      render(
        <OtpInputCard
          onSubmitOTP={mockOnSubmitOTP}
          otp={incompleteOtp}
          setOtp={mockSetOtp}
        />
      )
      
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)
      
      expect(mockOnSubmitOTP).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('sets correct input mode and pattern for numeric input', () => {
      renderOtpInputCard()
      const inputs = screen.getAllByRole('textbox')
      
      inputs.forEach(input => {
        expect(input).toHaveAttribute('inputMode', 'numeric')
        expect(input).toHaveAttribute('pattern', '\\d*')
      })
    })

    it('applies focus styles to input fields', async () => {
      renderOtpInputCard()
      const inputs = screen.getAllByRole('textbox')
      
      await user.click(inputs[0])
      expect(inputs[0]).toHaveClass('focus:ring-2', 'focus:ring-orange-500')
    })
  })
})