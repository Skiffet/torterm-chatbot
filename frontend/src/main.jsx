import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import { CatalogProvider } from './context/CatalogContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { UIProvider } from './context/UIContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <CatalogProvider>
        <AuthProvider>
          <CartProvider>
            <UIProvider>
              <App />
            </UIProvider>
          </CartProvider>
        </AuthProvider>
      </CatalogProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
