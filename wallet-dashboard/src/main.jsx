/**
 * Application Entry Point
 *
 * Initializes and renders the React application.
 * Uses React 18's createRoot API for concurrent rendering.
 *
 * @module main
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Initialize React application
 *
 * Creates a root container and renders the App component
 * wrapped in StrictMode for additional development checks.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
