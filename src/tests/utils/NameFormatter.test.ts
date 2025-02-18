import { describe, it, expect } from 'vitest'
import { formatName } from '../../utils/NameFormatter'

describe('formatName', () => {
  it('should capitalize first letter of each word', () => {
    expect(formatName('john doe')).toBe('John Doe')
  })

  it('should handle single word names', () => {
    expect(formatName('john')).toBe('John')
  })

  it('should handle all uppercase names', () => {
    expect(formatName('JOHN DOE')).toBe('John Doe')
  })

  it('should handle all lowercase names', () => {
    expect(formatName('john doe smith')).toBe('John Doe Smith')
  })

  it('should handle mixed case names', () => {
    expect(formatName('jOhN dOe')).toBe('John Doe')
  })

  it('should handle names with extra spaces', () => {
    expect(formatName('john  doe')).toBe('John Doe')
  })

  it('should handle empty string', () => {
    expect(formatName('')).toBe('')
  })
})