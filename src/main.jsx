import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { publicRoutes } from './routes/publicRoutes'
import { protectedcRoutes } from './routes/protectedRoutes'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import { GlobalProvider } from './store/GlobalStore'
import { AuthProvider } from './store/useAuth'

const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedcRoutes
]);

createRoot(document.getElementById('root')).render(
    <GlobalProvider>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </GlobalProvider>,
)
