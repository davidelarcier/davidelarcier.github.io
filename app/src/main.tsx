import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Font self-hostati (parte dell'app-shell PWA, precachati → funzionano offline).
// Niente Google Fonts cross-origin: la opaque response romperebbe l'offline in
// silenzio. Fraunces è variabile (asse wght, pesi 400/600 usati dai testi).
import '@fontsource-variable/fraunces/wght.css'
import '@fontsource/archivo/400.css'
import '@fontsource/archivo/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './stile.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
