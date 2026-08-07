import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import { AuthProvider } from './store/AuthContext'
import { ToastProvider } from './store/ToastContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
