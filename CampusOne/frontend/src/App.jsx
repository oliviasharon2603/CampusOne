import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import LibraryPage from './pages/LibraryPage';
import EventsPage from './pages/EventsPage';
import DepartmentsIndex from './pages/DepartmentsIndex';
import DepartmentDetail from './pages/DepartmentDetail';
import ClubsPage from './pages/ClubsPage';
import TransportPage from './pages/TransportPage';
import LostFoundPage from './pages/LostFoundPage';
import DocumentsPage from './pages/DocumentsPage';
import RoadmapPage from './pages/RoadmapPage';
import ComplaintsPage from './pages/ComplaintsPage';
import CanteenPage from './pages/CanteenPage';
import { UserActivityProvider } from './context/UserActivityContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Authenticated Routes */}
          <Route element={
            <UserActivityProvider>
              <DashboardLayout />
            </UserActivityProvider>
          }>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/departments" element={<DepartmentsIndex />} />
            <Route path="/departments/:deptId" element={<DepartmentDetail />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/canteen" element={<CanteenPage />} />
            <Route path="/lost-found" element={<LostFoundPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            {/* Future routes will go here */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
