import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { getMe, login as apiLogin } from '../services/admin';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await getMe();
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('admin_token');
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const data = await apiLogin(email, pass);
    localStorage.setItem('admin_token', data.token);
    setToken(data.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-950 text-gray-100">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}
