
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {QueryClient , QueryClientProvider} from "@tanstack/react-query"
import {Toaster} from "react-hot-toast"
import './index.css'
import App from './App.jsx'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
       <Toaster
        position="top-right"
       
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#0f172a",
          },
        }
       
    }
      />
    </QueryClientProvider>
  </BrowserRouter>
)
