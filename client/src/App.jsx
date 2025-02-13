import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ElderlyCareLanding from './pages/ElderlyCare/ElderlyCareLanding';
import { Login } from './pages/Account/Login';
import { Register } from './pages/Account/Register';
import Scheduler from './components/Scheduler/Scheduler';
import HealthLogInterface from './components/healthLog/HealthLogInterface';
import HealthLogs from './components/healthLog/HealthLogs';
import NewHealthLogs from './components/healthLog/NewHealthLogs';
import AboutPage from './pages/about/AboutPage';
import AccountSettings from './pages/accountSettings/accountSettings';
import './index.css';
import CareAnalytics from './components/careAnalytics/CareAnalytics';
import ElderlyCareForm from './components/ElderCareManager/ElderCareManager';
import LoggedInLandingPage from './pages/LoggedInLanding/LoggedInLandingPage';
import ViewAllElderlyUsers from './components/AllElders/ViewAllElderlyUsers';
import { Layout, RequireAuth } from './Routes/layout/Layout2.0';
import IndividualHealthRecord from './components/healthLog/Individual/IndividualHealthRecord';
import ElderlyRegistration from './components/ElderCareManager/ElderlyRegistration';
import AddHealthLog from './components/healthLog/Individual/AddHealthLog';
import HealthDashboard from './components/healthLog/Individual/HealthDashboard';
import HealthcareDashboard from './components/ElderCareManager/infoo';
import ElderProfile from './components/AllElders/ElderProfile';
import ElderScheduler from './components/AllElders/ElderScheduler';
import OrganizedElders from './components/AllElders/OrganizedElders';
import CaregiverManagementDashboard from './components/CareGivers/CaregiverManagementDashboard';
import NotFound from './components/NotFound/NotFound';
import ElderlyCareManagementSystem from './components/CareGivers/ElderlyCareManagementSystem';
import ClaudeCaregiverManagement from './components/CareGivers/CareGiverMngt/ClaudeCaregiverManagement';
import Research from './components/CareGivers/CareGiveSecond/research';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Wrap everything in Layout */}
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<ElderlyCareLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/aboutPage" element={<AboutPage />} />

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route path="/land" element={<LoggedInLandingPage />} />
              <Route path="/accountSettings" element={<AccountSettings />} />
              <Route path="/allHealthLogs" element={<NewHealthLogs />} />
              <Route path="/elderReg" element={<ElderlyRegistration />} />
              <Route path="/addHealthLog" element={<AddHealthLog />} />
              <Route path="/elderProfile/:elderId" element={<ElderProfile />} />
              <Route path="/scheduler" element={<ElderScheduler />} />
              <Route path="/organizedElders" element={<OrganizedElders />} />
              <Route path="/indiv/:elderId" element={<HealthcareDashboard />} />
              <Route
                path="/caregiver" //using this for now
                element={<ClaudeCaregiverManagement />}
              />
              {/* START OF TESTING COMPONENTS */}
              <Route
                path="/care" //potential
                element={<CaregiverManagementDashboard />}
              />
              <Route path="/ccc" element={<Research />} />
              <Route path="/cares" element={<ElderlyCareManagementSystem />} />
              {/* END OF TESTING COMPONENTS*/}
              {/*  Currently not being used*/}
              <Route path="/allElders" element={<ViewAllElderlyUsers />} />
              <Route path="/CareAnalytics" element={<CareAnalytics />} />{' '}
              <Route path="/indiv" element={<HealthDashboard />} />
              <Route path="/Individual" element={<IndividualHealthRecord />} />
              {/*  Currently not being used*/}
              <Route path="/Scheduler" element={<Scheduler />} />
              <Route path="/HealthLog" element={<HealthLogInterface />} />
              <Route path="/HealthLogs" element={<HealthLogs />} />
              <Route path="/elder" element={<ElderlyCareForm />} />
            </Route>
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
