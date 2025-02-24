
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import Preload from '../../../components/Preload'
import '@testing-library/jest-dom/vitest'

describe('Preload Component', () => {
  it('renders the loader component', () => {
    render(<Preload />)
    const loader = screen.getByRole('img', { name: /loader/i })
    expect(loader).toBeInTheDocument()
  })

  it('has correct image attributes', () => {
    render(<Preload />)
    const loader = screen.getByRole('img', { name: /loader/i })
    expect(loader).toHaveAttribute('src')
    expect(loader).toHaveAttribute('alt', 'Loader')
    expect(loader).toHaveClass('w-20', 'h-20')
  })

  it('has correct container styling', () => {
    render(<Preload />)
    const container = screen.getByRole('img', { name: /loader/i }).parentElement
    expect(container).toHaveClass(
      'fixed',
      'top-0',
      'left-0',
      'z-50',
      'w-screen',
      'h-screen',
      'bg-[#222222]',
      'flex',
      'justify-center',
      'items-center'
    )
  })

  it('renders with full viewport dimensions', () => {
    render(<Preload />)
    const container = screen.getByRole('img', { name: /loader/i }).parentElement
    expect(container).toHaveClass('w-screen', 'h-screen')
  })

  it('maintains correct z-index for overlay', () => {
    render(<Preload />)
    const container = screen.getByRole('img', { name: /loader/i }).parentElement
    expect(container).toHaveClass('z-50')
  })

  it('centers the loader image', () => {
    render(<Preload />)
    const container = screen.getByRole('img', { name: /loader/i }).parentElement
    expect(container).toHaveClass('flex', 'justify-center', 'items-center')
  })
})