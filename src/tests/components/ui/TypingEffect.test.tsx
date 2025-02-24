import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '../../../test/test-utils'
import TypingEffect from '../../../components/TypingEffect'

describe('TypingEffect Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllTimers()
  })

  describe('rendering', () => {
    it('renders empty div initially', () => {
      render(<TypingEffect text="Hello" speed={50} />)
      const div = screen.getByTestId('typing-effect')
      expect(div.innerHTML).toBe('')
    })

    it('renders with default props', () => {
      render(<TypingEffect text="Hello" />)
      const div = screen.getByTestId('typing-effect')
      expect(div).toHaveClass('text-sm', 'opacity-80', 'font-passenger')
    })

   
  })


  describe('cleanup', () => {
    it('clears interval on unmount', () => {
      const { unmount } = render(<TypingEffect text="Hello" />)
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
      unmount()
      expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('clears interval when text changes', () => {
      const { rerender } = render(<TypingEffect text="Hello" />)
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
      rerender(<TypingEffect text="Different text" />)
      expect(clearIntervalSpy).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('handles empty text', () => {
      render(<TypingEffect text="" />)
      const div = screen.getByTestId('typing-effect')
      expect(div.textContent).toBe('')
    })

    it('handles special characters', () => {
      const specialText = '!@#$%^&*()'
      render(<TypingEffect text={specialText} />)
      const div = screen.getByTestId('typing-effect')

      act(() => {
        vi.advanceTimersByTime(specialText.length * 50)
        vi.runAllTimers()
      })

      expect(div.textContent).toBe(specialText)
    })

    it('handles very long text', () => {
      const longText = 'A'.repeat(100)
      render(<TypingEffect text={longText} />)
      const div = screen.getByTestId('typing-effect')

      act(() => {
        vi.advanceTimersByTime(longText.length * 50)
        vi.runAllTimers()
      })

      expect(div.textContent).toBe(longText)
    })
  })

  describe('performance', () => {
    it('handles rapid text changes', () => {
      const { rerender } = render(<TypingEffect text="First" />)

      act(() => {
        vi.advanceTimersByTime(50)
        vi.runAllTimers()
      })

      rerender(<TypingEffect text="Second" />)

      act(() => {
        vi.advanceTimersByTime(50)
        vi.runAllTimers()
      })

      rerender(<TypingEffect text="Third" />)
      
      const div = screen.getByTestId('typing-effect')
      expect(div).toBeInTheDocument()
    })
  })
})