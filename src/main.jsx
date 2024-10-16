import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useQueryClient } from '@tanstack/react-query'


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <div className="bg-gradient-radial from-[#A881FC] to-[#5F39AA] bg-center bg-cover min-h-screen inter-font">

    <App />
    </div>
  </StrictMode>,
)
