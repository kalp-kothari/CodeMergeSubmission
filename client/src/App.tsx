import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { SubmissionFlow } from './pages/SubmissionFlow';
import { SuccessPage } from './pages/SuccessPage';
import { ClosedPage } from './pages/ClosedPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { SubmissionDetailPage } from './pages/admin/SubmissionDetailPage';
import { AuthProvider, ProtectedRoute } from './hooks/useAuth';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/submit" element={<SubmissionFlow />} />
          <Route path="/success/:submissionId" element={<SuccessPage />} />
          <Route path="/closed" element={<ClosedPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetailPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center"><h1 className="text-3xl font-bold">Page Not Found</h1></div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
