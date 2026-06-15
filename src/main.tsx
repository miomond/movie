import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { WatchlistProvider } from './context/WatchlistContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider>
    <WatchlistProvider>
      <App />
    </WatchlistProvider>  
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
