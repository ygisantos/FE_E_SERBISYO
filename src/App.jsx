import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/Layout/Layout";
import { useLoading } from "./components/LoadingContext";
import LoadingSpinner from "./components/Loading";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from './contexts/ChatContext';
import ChatbotWidget from './pages/resident/ChatbotWidget';

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

import OfficialManagement from "./pages/admin/official-management/BarangayOfficials";
import ArchivedOfficials from "./pages/admin/official-management/ArchivedOfficials";

import WorkerManagement from "./pages/admin/worker-management/WorkerManagement";
import ArchivedWorkers from "./pages/admin/worker-management/ArchivedWorkers";
import CertificateManagement from "./pages/admin/certificate-management/CertificateManagement";
import CertificateLogs from "./pages/admin/certificate-management/CertificateLogs";
import Blotter from "./pages/admin/Blotter";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import ConfigurationManagement from "./pages/admin/ConfigurationManagement";
import Reports from "./pages/admin/Reports";
import PendingResidents from "./pages/admin/resident-management/PendingResidents";
import RejectedResidents from "./pages/admin/resident-management/RejectedResidents";

import AddResident from "./pages/admin/resident-management/AddResident";

// Worker Pages
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import RequestManagement from "./pages/worker/RequestManagement";
import WorkerCertificateLogs from "./pages/worker/WorkerCertificateLogs";

// Resident Pages
import ResidentFeedback from "./pages/resident/ResidentFeedback";
import ViewCertificateRequest from "./pages/resident/ViewCertificateRequest";
import CertificateRequestLogs from "./pages/resident/CertificateRequestLogs";
import AvailableCertificates from "./pages/resident/AvailableCertificates";
import MyRequests from "./pages/resident/MyRequests";
import MyCases from "./pages/resident/MyCases";
import ResidentDashboard from "./pages/resident/ResidentDashboard";

// All user type Pages
import MyProfile from "./pages/Profile/MyProfile";
import AllResidents from "./pages/admin/resident-management/AllResidents";

import TrackDocument from "./pages/TrackDocument";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));
  
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userData.type)) {
    // Redirect to appropriate dashboard based on user role
    switch (userData.type) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'staff':
        return <Navigate to="/worker/dashboard" replace />;
      case 'residence':
        return <Navigate to="/resident/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

function App() {
  const { loading } = useLoading();

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          {loading && <LoadingSpinner />}
          <ScrollToTop />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/track-document" element={<TrackDocument />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route element={<Layout />}>
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="official-management/*" element={<OfficialManagement />} />
                    <Route
                      path="official-management/archived"
                      element={<ArchivedOfficials />}
                    />

                    
                    {/* Worker Management */}
                    <Route path="workers" element={<WorkerManagement />} />
                    <Route path="workers/add" element={<WorkerManagement />} />
                    <Route path="workers/archived" element={<ArchivedWorkers />} />
                    {/* Residence Management */}
                    <Route
                      path="resident-management/new"
                      element={<AddResident />}
                    />
                    <Route
                      path="resident-management/all-resident"
                      element={<AllResidents />}
                    />

                    <Route
                      path="resident-management/pending"
                      element={<PendingResidents />}
                    />
                    <Route
                      path="resident-management/rejected"
                      element={<RejectedResidents />}
                    />
                    {/* Certificate Management */}
                    <Route
                      path="certificates"
                      element={<CertificateManagement />}
                    />
                    <Route
                      path="certificates/add"
                      element={<CertificateManagement />}
                    />
                    <Route
                      path="certificates/logs"
                      element={<CertificateLogs />}
                    />
                    <Route path="sumbong" element={<Blotter />} />
                    <Route
                      path="announcements"
                      element={<AnnouncementManagement />}
                    />
                    <Route path="feedback" element={<FeedbackManagement />} />
                    <Route path="configurations" element={<ConfigurationManagement />} />
                    <Route path="activity-logs" element={<ActivityLogs />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="requests" element={<RequestManagement />} />
                     <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Worker/Staff Routes */}
              <Route path="/worker/*" element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <Routes>
                    <Route path="dashboard" element={<WorkerDashboard />} />
                    {/* Request Management */}
                    <Route path="requests" element={<RequestManagement />} />
                    <Route
                      path="certificates/logs"
                      element={<WorkerCertificateLogs />}
                    />
                    {/* Residence Management */}
                    <Route path="resident-management/new" element={<AddResident />} />
                    <Route path="resident-management/pending" element={<PendingResidents />} />
                   <Route
                      path="resident-management/all-resident"
                      element={<AllResidents />}
                    />
                    {/* Blotter Management */}
                    <Route path="sumbong/new" element={<Blotter />} />
                    <Route path="sumbong" element={<Blotter />} />
                    <Route path="profile" element={<MyProfile />} />
                     <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Resident Routes */}
              <Route path="/resident/*" element={
                <ProtectedRoute allowedRoles={['residence']}>
                  <Routes>
                    <Route path="dashboard" element={<ResidentDashboard />} />
                    
                    {/* Certificates */}
                    <Route
                      path="certificates/available-certificates"
                      element={<AvailableCertificates />}
                    />
                    <Route
                      path="certificates/my-requests"
                      element={<MyRequests />}
                    />
                    <Route
                      path="certificates/view/:requestId"
                      element={<ViewCertificateRequest />}
                    />
                    {/* <Route
                      path="/resident/certificates"
                      element={<ResidentCertificates />}
                    /> */}
                    {/* <Route
                      path="/resident/certificates/request"
                      element={<ResidentCertificates />}
                    /> */}
                    
                    <Route path="feedback" element={<ResidentFeedback />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route
                      path="certificates/logs"
                      element={<CertificateRequestLogs />}
                    />
                    
                    <Route path="sumbong/my-cases" element={<MyCases />} />
                     <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
              } />
              {/* Catch-all route for any undefined paths */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>

          {/* ChatbotWidget - Only show for residents */}
          {window.location.pathname.includes('/resident') && (
            <ChatProvider>
              <ChatbotWidget />
            </ChatProvider>
          )}
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
