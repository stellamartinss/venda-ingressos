import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import EventPage from './pages/EventPage.tsx'
import OrganizerLoginPage from './pages/OrganizerLoginPage.tsx'
import OrganizerSignupPage from './pages/OrganizerSignupPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import CheckoutPage from './pages/CheckoutPage.tsx'
import NewEventPage from './pages/NewEventPage.tsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.tsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.tsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'evento/:id', element: <EventPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'organizador/login', element: <OrganizerLoginPage /> },
      { path: 'organizador/cadastro', element: <OrganizerSignupPage /> },
      { path: 'organizador/painel', element: <DashboardPage /> },
      { path: 'organizador/novo', element: <NewEventPage /> },
      { path: 'admin/login', element: <AdminLoginPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
