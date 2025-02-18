import { describe, it, expect } from 'vitest'
import { getInitials } from '../../utils/NameInitials'

describe('getInitials', () => {
  it('should return empty string for empty input', () => {
    expect(getInitials('')).toBe('')
  })

  it('should return initials for a single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should return initials for first and last name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should return first two initials for multiple names', () => {
    expect(getInitials('John James Doe')).toBe('JJ')
  })

  it('should handle lowercase names', () => {
    expect(getInitials('john doe')).toBe('JD')
  })

  it('should handle names with extra spaces', () => {
    expect(getInitials('John  Doe')).toBe('JD')
  })
})