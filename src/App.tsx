import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './store';
import { useState, Suspense, useEffect } from 'react';
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
import AdminPanel from './AdminPanel';
import { AuthProvider } from './contexts/AuthContext';
import { InviteProvider } from './contexts/InviteContext';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import TermsOfService from './pages/legal/TermsOfService';
import GDPRCompliance from './components/legal/GDPRCompliance';
import Footer from './components/layout/Footer';
import CookieConsentBanner from './components/legal/CookieConsentBanner';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { loginSuccess, logout as reduxLogout } from './store/slices/authSlice';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Dashboard Layout Component
const DashboardLayout = ({ children, userData }: { children: React.ReactNode, userData?: any }) => {
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar onHelpClick={() => setShowHelp(true)} onQuickStartClick={() => setShowQuickStart(true)} userData={userData} />
          <main className="flex-1 overflow-y-auto p-6 dashboard-main">
            {children}
          </main>
        </div>
      </div>
      <QuickStartGuide isOpen={showQuickStart} onClose={() => setShowQuickStart(false)} />
      <HelpDocumentation isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children, userData }: { children: React.ReactNode, userData?: any }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (userData && !userData.hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [userData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout userData={userData}>
      <WelcomeTutorial 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
        onComplete={async () => {
          setShowWelcome(false);
          if (userData) {
            try {
              await updateDoc(doc(db, 'users', userData.id), {
                hasSeenWelcome: true
              });
            } catch (error) {
              console.error('Error updating welcome status:', error);
            }
          }
        }} 
      />
      {children}
    </DashboardLayout>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Current user UID:', firebaseUser.uid);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        console.log('User doc exists:', userDoc.exists());
        if (userDoc.exists()) {
          dispatch(loginSuccess({
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              role: 'admin',
              emailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            token: 'firebase',
            refreshToken: '',
          }));
        } else {
          dispatch(reduxLogout());
        }
      } else {
        dispatch(reduxLogout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

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
              <Route path="/dashboard" element={<ProtectedRoute userData={userData}><DashboardContent /></ProtectedRoute>} />
              <Route path="/why-credexis" element={<ProtectedRoute userData={userData}><WhyCredexis /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute userData={userData}><Clients /></ProtectedRoute>} />
              <Route path="/disputes" element={<ProtectedRoute userData={userData}><Disputes /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute userData={userData}><Tasks /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute userData={userData}><Payments /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute userData={userData}><Documents /></ProtectedRoute>} />
              <Route path="/letter-templates" element={<ProtectedRoute userData={userData}><LetterTemplates /></ProtectedRoute>} />
              <Route path="/marketing" element={<ProtectedRoute userData={userData}><Marketing /></ProtectedRoute>} />
              <Route path="/credit-tools" element={<ProtectedRoute userData={userData}><CreditTools /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute userData={userData}><Settings userData={userData} /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute userData={userData}><Invoices /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute userData={userData}><Reports /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
            <CookieConsentBanner />
            <Footer />
          </Suspense>
        </OnboardingProvider>
      </AuthProvider>
    </InviteProvider>
  );
}
