import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

// Splash
import Splash from '@/pages/Splash';

// Public pages
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import MapView from '@/pages/MapView';
import ReportForm from '@/pages/ReportForm';
import ReportDetail from '@/pages/ReportDetail';
import Heatmap from '@/pages/Heatmap';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Admin pages
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import ReportList from '@/pages/admin/ReportList';
import Verification from '@/pages/admin/Verification';
import Analysis from '@/pages/admin/Analysis';
import Statistics from '@/pages/admin/Statistics';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/splash" element={<Splash />} />

      {/* Root redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes with navbar/footer layout */}
      <Route element={<Layout />}>
        <Route path="/beranda" element={<Landing />} />
        <Route path="/peta" element={<MapView />} />
        <Route path="/laporkan" element={<ReportForm />} />
        <Route path="/laporan/:id" element={<ReportDetail />} />
        <Route path="/heatmap" element={<Heatmap />} />
      </Route>

      {/* Admin routes (protected + role check) */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/laporan" element={<ReportList />} />
          <Route path="/admin/verifikasi" element={<Verification />} />
          <Route path="/admin/analisis" element={<Analysis />} />
          <Route path="/admin/statistik" element={<Statistics />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App