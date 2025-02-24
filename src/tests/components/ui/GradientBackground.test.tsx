import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import GradientBackground from '../../../components/GradientBackground'
import '@testing-library/jest-dom/vitest'

describe('GradientBackground Component', () => {
  const renderGradientBackground = (children: React.ReactNode = null) => {
    return render(
      <GradientBackground>{children}</GradientBackground>
    )
  }

  describe('Rendering', () => {
    it('renders the background container', () => {
      renderGradientBackground()
      const container = screen.getByTestId('gradient-background')
      expect(container).toBeInTheDocument()
    })

    it('renders children content', () => {
      renderGradientBackground(<div>Test Content</div>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders all gradient elements', () => {
      renderGradientBackground()
      expect(screen.getByTestId('coral-gradient-1')).toBeInTheDocument()
      expect(screen.getByTestId('coral-gradient-2')).toBeInTheDocument()
      expect(screen.getByTestId('yellow-gradient-1')).toBeInTheDocument()
      expect(screen.getByTestId('yellow-gradient-2')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies correct base styles to main container', () => {
      renderGradientBackground()
      const mainContainer = screen.getByTestId('gradient-background')
      expect(mainContainer).toHaveClass('bg-white', 'min-h-screen', 'w-full')
    })

    it('applies correct styles to inner container', () => {
      renderGradientBackground()
      const innerContainer = screen.getByTestId('gradient-inner')
      expect(innerContainer).toHaveClass(
        'bg-white',
        'overflow-hidden',
        'min-h-screen',
        'w-full',
        'relative'
      )
    })

    it('applies correct styles to content container', () => {
      renderGradientBackground()
      const contentContainer = screen.getByTestId('gradient-content')
      expect(contentContainer).toHaveClass('relative', 'z-10', 'min-h-screen')
    })

    it('verifies coral gradient styles', () => {
      const { container } = renderGradientBackground()
      const coralGradients = container.querySelectorAll('[style*="#F9C6B9"]')
      
      coralGradients.forEach(gradient => {
        expect(gradient).toHaveStyle({
          background: 'radial-gradient(50% 50% at 50% 50%, #F9C6B9 0%, #EF613C 100%)',
          filter: 'blur(193px)'
        })
        expect(gradient).toHaveClass('opacity-30')
      })
    })

    it('verifies yellow-orange gradient styles', () => {
      const { container } = renderGradientBackground()
      const yellowGradients = container.querySelectorAll('[style*="#FFA462"]')
      
      yellowGradients.forEach(gradient => {
        expect(gradient).toHaveStyle({
          background: 'radial-gradient(50% 50% at 50% 50%, #FFA462 0%, #F4D564 100%)',
          filter: 'blur(193px)'
        })
        expect(gradient).toHaveClass('opacity-30')
      })
    })
  })

  describe('Layout', () => {
    it('maintains correct gradient positioning', () => {
      const { container } = renderGradientBackground()
      
      const gradients = container.querySelectorAll('[style*="radial-gradient"]')
      const positions = [
        'left-[485px]',
        'left-[820px]',
        'left-[111px]',
        'left-[1194px]'
      ]
      
      gradients.forEach((gradient, index) => {
        expect(gradient).toHaveClass(positions[index])
      })
    })

    it('ensures content is above gradients with z-index', () => {
      renderGradientBackground(<div>Content</div>)
      const contentContainer = screen.getByTestId('gradient-content')
      expect(contentContainer).toHaveClass('z-10')
    })
  })

  describe('Accessibility', () => {
    it('preserves content visibility over background', () => {
      renderGradientBackground(<button>Click Me</button>)
      const button = screen.getByRole('button')
      expect(button).toBeVisible()
    })

  
  })
})
