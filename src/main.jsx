import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { publicRoutes } from './routes/publicRoutes'
import { protectedcRoutes } from './routes/protectedRoutes'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/App.css'
import { GlobalContextProvider } from './store/GlobalStore'
import { AuthProvider } from './store/useAuth'


//public and private routes moved out to keep main file clean
const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedcRoutes
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <GlobalContextProvider>
          <RouterProvider router={router}/>
        </GlobalContextProvider>
      </AuthProvider>
  </StrictMode>
)
