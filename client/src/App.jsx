import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ElderlyCareLanding from './pages/ElderlyCare/ElderlyCareLanding';
import { Login } from './pages/Account/Login';
import { Register } from './pages/Account/Register';
import Scheduler from './components/Scheduler/Scheduler';
import HealthLogInterface from './components/healthLog/HealthLogInterface';
import HealthLogs from './components/healthLog/HealthLogs';
import { Layout, RequireAuth } from './Routes/layout/layout';
import AboutPage from './pages/about/AboutPage';
import AccountSettings from './pages/accountSettings/accountSettings';
import './index.css';
import CareAnalytics from './components/careAnalytics/CareAnalytics';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route index element={<ElderlyCareLanding />} />
            <Route path="/Scheduler" element={<Scheduler />} />
            <Route path="/HealthLog" element={<HealthLogInterface />} />
            <Route path="/HealthLogs" element={<HealthLogs />} />
            <Route path="/AboutPage" element={<AboutPage />} />
            <Route path="/accountSettings" element={<AccountSettings />} />
            <Route path="/CareAnalytics" element={<CareAnalytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
