
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen,  waitFor } from '../../test/test-utils'

import userEvent from '@testing-library/user-event'
import LoginCard from '../../pages/Login/LoginCard'
import { LoginApiService } from '../../pages/Login/api'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import '@testing-library/jest-dom/vitest'
import { initiateOneLogin } from '../../utils/OneLoginAuth'

// Mock dependencies
vi.mock('../../pages/Login/api', () => ({
  LoginApiService: {
    postLogin: vi.fn()
  }
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('../../utils/OneLoginAuth', () => ({
  initiateOneLogin: vi.fn()
}))

describe('LoginCard Component', () => {
  const user = userEvent.setup()

  const renderLoginCard = () => {
    const store = configureStore({
      reducer: {
        auth: (state = {}) => state
      }
    })

    return render(
      <Provider store={store}>
       
          <LoginCard />
      
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Rendering', () => {
    it('renders all main components', () => {
      renderLoginCard()
      expect(screen.getByAltText('Bart Logo')).toBeInTheDocument()
      expect(screen.getByText('Login to your account')).toBeInTheDocument()
      expect(screen.getByText('Login with OneLogin')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Password')).toBeInTheDocument()
      expect(screen.getByText('Continue')).toBeInTheDocument()
      expect(screen.getByText('Facial Login')).toBeInTheDocument()
    })

    it('renders sign up link', () => {
      renderLoginCard()
      const signUpLink = screen.getByText('Sign Up')
      expect(signUpLink).toBeInTheDocument()
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup')
    })
  })

  describe('Form Interactions', () => {
    it('allows email input', async () => {
      renderLoginCard()
      const emailInput = screen.getByRole('textbox', { name: '' }) // or use a better selector
      await user.type(emailInput, 'test@example.com')
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('allows password input', async () => {
      renderLoginCard()
      const passwordInput = screen.getByRole('textbox', { name: '' }) // or use a better selector
      await user.type(passwordInput, 'password123')
      expect(passwordInput).toHaveValue('password123')
    })
  })

  describe('Login Functionality', () => {


    it('handles login failure', async () => {
      const error = new Error('Invalid credentials')
      vi.mocked(LoginApiService.postLogin).mockRejectedValueOnce(error)

      renderLoginCard()
      
      const emailInput = screen.getByRole('textbox', { name: '' }) // Update selector
      const passwordInput = screen.getByRole('textbox', { name: '' }) // Update selector
      const continueButton = screen.getByText('Continue')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(continueButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
      })
    })
  })

  describe('OneLogin Integration', () => {
        it('initiates OneLogin when clicking OneLogin button', async () => {
      renderLoginCard()
      const oneLoginButton = screen.getByText('Login with OneLogin').closest('div')
      expect(oneLoginButton).toBeInTheDocument()
      
      if (oneLoginButton) {
        await user.click(oneLoginButton)
        expect(initiateOneLogin).toHaveBeenCalled()
      }
    })
  })

 

  describe('Accessibility', () => {
    it('has accessible form inputs', () => {
      renderLoginCard()
      expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument() // Update selector
      expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument() // Update selector
    })

    it('has accessible buttons', () => {
      renderLoginCard()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Facial Login' })).toBeInTheDocument()
    })
  })
})
