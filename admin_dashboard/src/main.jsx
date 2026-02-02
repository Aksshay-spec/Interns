import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      
      <App />
      <Toaster
        position="top-right"
       
        toastOptions={{
          duration: 2000,
          style: {
            background: "#0f172a",
            color: "#fff",
          },
        }
       
    }
      />
      
    </QueryClientProvider>
  </BrowserRouter>,
);
