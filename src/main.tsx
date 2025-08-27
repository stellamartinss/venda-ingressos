import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import EventPage from './pages/client/EventPage.tsx';
import OrganizerLoginPage from './pages/organizer/OrganizerLoginPage.tsx';
import OrganizerSignupPage from './pages/organizer/OrganizerSignupPage.tsx';
import DashboardPage from './pages/organizer/DashboardPage.tsx';
import CheckoutPage from './pages/client/CheckoutPage.tsx';
import NewEventPage from './pages/organizer/NewEventPage.tsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.tsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.tsx';
import './index.css';
import ClientArea from './pages/client/ClientArea.tsx';
import { AuthProvider } from './pages/auth/AuthContext.tsx';
import ProtectedRoute from './pages/auth/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'evento/:id', element: <EventPage /> },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      { path: 'organizador/login', element: <OrganizerLoginPage /> },
      { path: 'organizador/cadastro', element: <OrganizerSignupPage /> },
      {
        path: 'organizador/painel',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'organizador/novo',
        element: (
          <ProtectedRoute>
            <NewEventPage />
          </ProtectedRoute>
        ),
      },
      { path: 'admin/login', element: <AdminLoginPage /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cliente/painel',
        element: (
          <ProtectedRoute>
            <ClientArea />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
