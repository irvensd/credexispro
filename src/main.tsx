import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { store } from './store'
import { ErrorBoundary } from './components/ErrorBoundary'
import './i18n/config'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
          <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
