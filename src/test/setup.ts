import '@testing-library/jest-dom'
import { afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect method with RTL matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})