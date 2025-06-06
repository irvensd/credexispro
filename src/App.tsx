import { Routes, Route, useLocation } from 'react-router-dom';
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
import AccountSettings from './AccountSettings';
import HelpSupport from './HelpSupport';

function App() {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPath={location.pathname} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 dashboard-main">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/why-credexis" element={<WhyCredexis />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/letter-templates" element={<LetterTemplates />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/credit-tools" element={<CreditTools />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/help-support" element={<HelpSupport />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
