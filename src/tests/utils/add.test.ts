import {sum} from '../../utils/add'
import { describe, it, expect } from 'vitest'
describe('sum function', () => {
    it('adds two numbers correctly', () => {
      expect(sum(1, 2)).toBe(3)
    })
  
    it('handles negative numbers', () => {
      expect(sum(-1, 1)).toBe(0)
    })
  
    it('handles zero', () => {
      expect(sum(0, 5)).toBe(5)
    })
  })