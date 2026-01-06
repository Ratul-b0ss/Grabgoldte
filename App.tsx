
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0F0F12]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
      <p className="text-yellow-500/80 text-xs font-bold tracking-widest animate-pulse">LOADING ASSETS...</p>
    </div>
  </div>
);

// Lazy Load Pages for Code Splitting
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Store = lazy(() => import('./pages/Store'));
const Share = lazy(() => import('./pages/Share'));
const News = lazy(() => import('./pages/News'));
const Me = lazy(() => import('./pages/Me'));
const Recharge = lazy(() => import('./pages/Recharge'));
const Withdraw = lazy(() => import('./pages/Withdraw'));
const History = lazy(() => import('./pages/History'));
const BankDetails = lazy(() => import('./pages/BankDetails'));
const CustomerCare = lazy(() => import('./pages/CustomerCare'));
const About = lazy(() => import('./pages/About'));
const Settings = lazy(() => import('./pages/Settings'));
const PaymentGateway = lazy(() => import('./pages/PaymentGateway'));
const Admin = lazy(() => import('./pages/Admin'));

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected Main Layout Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route element={<Layout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/share" element={<Share />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/me" element={<Me />} />
                </Route>

                {/* Sub Pages (Full Screen) */}
                <Route path="/recharge" element={<Recharge />} />
                <Route path="/payment" element={<PaymentGateway />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/history" element={<History />} />
                <Route path="/bank-details" element={<BankDetails />} />
                <Route path="/customer-care" element={<CustomerCare />} />
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
