import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import LibraryPage from './pages/LibraryPage';
import EventsPage from './pages/EventsPage';
import DepartmentsIndex from './pages/DepartmentsIndex';
import DepartmentDetail from './pages/DepartmentDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Authenticated Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/departments" element={<DepartmentsIndex />} />
          <Route path="/departments/:deptId" element={<DepartmentDetail />} />
          <Route path="/events" element={<EventsPage />} />
          {/* Future routes will go here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
