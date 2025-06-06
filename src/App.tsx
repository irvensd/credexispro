import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardContent from './DashboardContent';
import WhyCredexis from './WhyCredexis';
import Clients from './Clients';
import Disputes from './Disputes';

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
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
