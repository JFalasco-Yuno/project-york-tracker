import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// If env vars aren't configured yet, show a setup prompt instead of crashing
if (!clientId) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111827' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 420, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <p style={{ color: '#9ca3af', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Project York</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Setup Required</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
          Environment variables are not configured. Add the following to your Vercel project settings under <strong>Environment Variables</strong>:
        </p>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, textAlign: 'left', fontFamily: 'monospace', fontSize: 13, marginBottom: 16 }}>
          <div>VITE_GOOGLE_CLIENT_ID</div>
          <div>VITE_GOOGLE_SHEET_ID</div>
        </div>
        <p style={{ color: '#9ca3af', fontSize: 12 }}>After adding the variables, trigger a new Vercel deployment.</p>
      </div>
    </div>
  )
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>,
  )
}
