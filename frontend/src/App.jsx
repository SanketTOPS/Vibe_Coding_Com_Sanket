import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Dashboard Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            }
          />
          <Route
            path="/services"
            element={
              <AppLayout>
                <ServicesPage />
              </AppLayout>
            }
          />
          <Route
            path="/services/:id"
            element={
              <AppLayout>
                <ServiceDetailPage />
              </AppLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AppLayout>
                  <LoginPage />
                </AppLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <AppLayout>
                  <RegisterPage />
                </AppLayout>
              </PublicRoute>
            }
          />

          {/* Customer Dashboard */}
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute roles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Provider Dashboard */}
          <Route
            path="/provider/*"
            element={
              <ProtectedRoute roles={['provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Technician Dashboard */}
          <Route
            path="/technician/*"
            element={
              <ProtectedRoute roles={['technician']}>
                <TechnicianDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Error Pages */}
          <Route
            path="/unauthorized"
            element={
              <AppLayout>
                <UnauthorizedPage />
              </AppLayout>
            }
          />
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFoundPage />
              </AppLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
