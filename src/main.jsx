

import { reloadAfterConfig } from './utils/reloadAfterConfig.js';
reloadAfterConfig();

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoadingProvider } from './components/LoadingContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
     <LoadingProvider>
      <App />
    </LoadingProvider>
 )
