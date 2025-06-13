import { Route } from 'react-router-dom';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import CookiePolicy from '../pages/legal/CookiePolicy';
import TermsOfService from '../pages/legal/TermsOfService';
import GDPRCompliance from '../components/legal/GDPRCompliance';

export const legalRoutes = [
  <Route key="privacy" path="/privacy-policy" element={<PrivacyPolicy />} />,
  <Route key="cookies" path="/cookie-policy" element={<CookiePolicy />} />,
  <Route key="terms" path="/terms-of-service" element={<TermsOfService />} />,
  <Route key="gdpr" path="/gdpr" element={<GDPRCompliance />} />,
]; 