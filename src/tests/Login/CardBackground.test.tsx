import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/test-utils'
import CardBackground from '../../pages/Login/CardBackground'
import '@testing-library/jest-dom/vitest'

describe('CardBackground Component', () => {
  const renderCardBackground = (children: React.ReactNode = null) => {
    return render(
      <CardBackground>{children}</CardBackground>
    )
  }

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderCardBackground()
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      renderCardBackground(<div data-testid="test-child">Test Content</div>)
      expect(screen.getByTestId('test-child')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies correct base classes', () => {
      const { container } = renderCardBackground()
      const backgroundDiv = container.firstChild as HTMLElement
      
      expect(backgroundDiv).toHaveClass(
        'items-center',
        'gap-2.5',
        'px-0',
        'py-2',
        'relative',
        'rounded-[20px]',
        'overflow-hidden',
        'flex',
        'flex-col',
        'w-full',
        'max-w-[500px]',
        'mx-auto'
      )
    })

    it('applies correct gradient background style', () => {
      const { container } = renderCardBackground()
      const backgroundDiv = container.firstChild as HTMLElement
      
      expect(backgroundDiv).toHaveStyle({
        background: 'linear-gradient(to top, #FF3F0C0A, rgba(255, 63, 12, 0) 50%, white)'
      })
    })

    it('applies correct border styles', () => {
      const { container } = renderCardBackground()
      const backgroundDiv = container.firstChild as HTMLElement
      
      expect(backgroundDiv).toHaveClass(
        'border',
        'border-solid',
        'border-transparent'
      )
    })
  })

  describe('Layout', () => {
    it('maintains correct width and centering', () => {
      const { container } = renderCardBackground()
      const backgroundDiv = container.firstChild as HTMLElement
      
      expect(backgroundDiv).toHaveClass('w-full', 'max-w-[500px]', 'mx-auto')
    })

    it('uses flex column layout for children', () => {
      const { container } = renderCardBackground(
        <>
          <div>Child 1</div>
          <div>Child 2</div>
        </>
      )
      const backgroundDiv = container.firstChild as HTMLElement
      
      expect(backgroundDiv).toHaveClass('flex', 'flex-col')
    })
  })
})
