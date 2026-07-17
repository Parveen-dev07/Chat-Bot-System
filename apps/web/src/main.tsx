import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import { store } from './app/store.ts'
import SocketProvider from './socket/SocketProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <SocketProvider>

    <App />
      </SocketProvider>
    </Provider>
  
    
    </BrowserRouter>
  </StrictMode>,
)
