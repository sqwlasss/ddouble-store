import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { initAnalytics } from '@/lib/analytics'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// GA4: inject the gtag script once at startup (only if consent is already
// granted), then re-init when the consent banner is accepted later.
initAnalytics()
window.addEventListener('consent-change', (e) => {
  if (e.detail === true) initAnalytics()
})

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
