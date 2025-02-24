import React from 'react'
import { render as rtlRender, screen, fireEvent, waitFor, within, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Define the options type
interface RenderOptions {
  route?: string;
}

function renderWithProviders(
  ui: React.ReactElement,
  options: RenderOptions = {}  // Make options optional with default empty object
) {
  const { route = '/' } = options  // Destructure with default value
  
  window.history.pushState({}, 'Test page', route)

  return rtlRender(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  )
}

// Explicitly export what we need
export {
  renderWithProviders as render,
  screen,
  fireEvent,
  waitFor,
  within,
  act
}