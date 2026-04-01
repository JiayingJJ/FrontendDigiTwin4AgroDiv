import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./main.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Provider } from 'react-redux'
import store from './stores/stores.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
    <TooltipProvider>
    <App />
    </TooltipProvider>
    </Provider>
  </StrictMode>,
)
