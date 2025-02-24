
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import { Button } from '../../../components/ui/button'
import '@testing-library/jest-dom/vitest'

describe('Button Component', () => {
  // Base rendering
  it('renders button with children', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Click me')
  })

  // Variant tests
  describe('variants', () => {
    it('renders default variant', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Default')
    })

    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Delete')
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Outline')
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Secondary')
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Ghost')
    })

    it('renders link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Link')
    })
  })

  // Size tests
  describe('sizes', () => {
    it('renders default size', () => {
      render(<Button>Default Size</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Default Size')
    })

    it('renders sm size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Small')
    })

    it('renders lg size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Large')
    })

    it('renders icon size', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Icon')
    })
  })

  // Feature tests
  describe('features', () => {
    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('renders as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveTextContent('Link Button')
    })

    it('accepts custom className', () => {
      render(<Button className="test-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Custom')
    })

    it('renders with icon', () => {
      render(
        <Button>
          <svg data-testid="test-icon" />
          <span>With Icon</span>
        </Button>
      )
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('With Icon')
    })
  })

  // Common button attributes
  describe('button attributes', () => {
    it('forwards native button attributes', () => {
      render(
        <Button
          type="submit"
          aria-label="Submit form"
          data-testid="submit-btn"
        >
          Submit
        </Button>
      )
      const button = screen.getByTestId('submit-btn')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('aria-label', 'Submit form')
    })
  })
})