import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import { useState, Suspense } from 'react';
import { OnboardingProvider, WelcomeTutorial, QuickStartGuide, HelpDocumentation } from './components/onboarding';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardContent from './DashboardContent';
import WhyCredexis from './WhyCredexis';
import Clients from './Clients';
import Disputes from './Disputes';
import Tasks from './Tasks';
import Payments from './Payments';
import Documents from './Documents';
import LetterTemplates from './LetterTemplates';
import Marketing from './Marketing';
import CreditTools from './CreditTools';
import Settings from './Settings';
import Invoices from './Invoices';
import Reports from './Reports';
import { useLocation } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import { AuthProvider } from './contexts/AuthContext';
import { InviteProvider } from './contexts/InviteContext';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Dashboard Layout Component
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onHelpClick={() => setShowHelp(true)} onQuickStartClick={() => setShowQuickStart(true)} />
        <main className="flex-1 overflow-y-auto p-6 dashboard-main">
          {children}
        </main>
      </div>
      
      <QuickStartGuide isOpen={showQuickStart} onClose={() => setShowQuickStart(false)} />
      <HelpDocumentation isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [showWelcome, setShowWelcome] = useState(true);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <WelcomeTutorial 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
        onComplete={() => setShowWelcome(false)} 
      />
      {children}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <InviteProvider>
      <AuthProvider>
        <OnboardingProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardContent /></ProtectedRoute>} />
              <Route path="/why-credexis" element={<ProtectedRoute><WhyCredexis /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/disputes" element={<ProtectedRoute><Disputes /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
              <Route path="/letter-templates" element={<ProtectedRoute><LetterTemplates /></ProtectedRoute>} />
              <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
              <Route path="/credit-tools" element={<ProtectedRoute><CreditTools /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </Suspense>
        </OnboardingProvider>
      </AuthProvider>
    </InviteProvider>
  );
}
