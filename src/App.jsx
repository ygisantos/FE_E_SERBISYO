import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout/Layout";
import { useLoading } from "./components/LoadingContext";
import LoadingSpinner from "./components/Loading";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

import OfficialManagement from "./pages/admin/official-management/BarangayOfficials";

import WorkerManagement from "./pages/admin/WorkerManagement";
import CertificateManagement from "./pages/admin/certificate-management/CertificateManagement";
import CertificateLogs from "./pages/admin/certificate-management/CertificateLogs";
import Blotter from "./pages/admin/Blotter";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import PendingResidents from "./pages/admin/resident-management/PendingResidents";
import RejectedResidents from "./pages/admin/resident-management/RejectedResidents";

import AddResident from "./pages/admin/resident-management/AddResident";

// Worker Pages
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import RequestManagement from "./pages/worker/RequestManagement";
import WorkerCertificateLogs from "./pages/worker/WorkerCertificateLogs";

// Resident Pages
import ChatbotAssistant from "./pages/resident/ChatbotAssistant";
import ResidentCertificates from "./pages/resident/ResidentCertificates";
import ResidentFeedback from "./pages/resident/ResidentFeedback";
import ViewCertificateRequest from "./pages/resident/ViewCertificateRequest";
import CertificateRequestLogs from "./pages/resident/CertificateRequestLogs";

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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const { loading } = useLoading();

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          {loading && <LoadingSpinner />}
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/track-document" element={<TrackDocument />} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Official Management */}
              <Route
                path="/admin/official-management/officials"
                element={<OfficialManagement />}
              />

              
              {/* Worker Management */}
              <Route path="/admin/workers" element={<WorkerManagement />} />
              <Route path="/admin/workers/add" element={<WorkerManagement />} />
              {/* Residence Management */}
              <Route
                path="/admin/resident-management/new"
                element={<AddResident />}
              />
              <Route
                path="/admin/resident-management/all-resident"
                element={<AllResidents />}
              />

              <Route
                path="/admin/resident-management/pending"
                element={<PendingResidents />}
              />
              <Route
                path="/admin/resident-management/rejected"
                element={<RejectedResidents />}
              />
              {/* Certificate Management */}
              <Route
                path="/admin/certificates"
                element={<CertificateManagement />}
              />
              <Route
                path="/admin/certificates/add"
                element={<CertificateManagement />}
              />
              <Route
                path="/admin/certificates/logs"
                element={<CertificateLogs />}
              />
              <Route path="/admin/blotter" element={<Blotter />} />
              <Route
                path="/admin/announcements"
                element={<AnnouncementManagement />}
              />
              <Route path="/admin/feedback" element={<FeedbackManagement />} />
              <Route path="/admin/activity-logs" element={<ActivityLogs />} />
              <Route path="/admin/profile" element={<MyProfile />} />

              {/* Worker Routes */}
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              {/* Request Management */}
              <Route
                path="/worker/requests/pending"
                element={<RequestManagement />}
              />
              <Route
                path="/worker/requests/processed"
                element={<RequestManagement />}
              />
              <Route
                path="/worker/certificates/logs"
                element={<WorkerCertificateLogs />}
              />
              {/* Residence Management */}
              <Route path="/worker/resident-management/new" element={<AddResident />} />
              <Route path="/worker/resident-management/pending" element={<PendingResidents />} />
             <Route
                path="/worker/resident-management/all-resident"
                element={<AllResidents />}
              />
              {/* Blotter Management */}
              <Route path="/worker/blotter/new" element={<Blotter />} />
              <Route path="/worker/blotter" element={<Blotter />} />
              <Route path="/worker/profile" element={<MyProfile />} />

              {/* Resident Routes */}
              <Route path="/resident/chatbot" element={<ChatbotAssistant />} />
              {/* Certificates */}
              <Route
                path="/resident/certificates/view/:requestId"
                element={<ViewCertificateRequest />}
              />
              <Route
                path="/resident/certificates"
                element={<ResidentCertificates />}
              />
              <Route
                path="/resident/certificates/request"
                element={<ResidentCertificates />}
              />
              
              <Route path="/resident/feedback" element={<ResidentFeedback />} />
              <Route path="/resident/profile" element={<MyProfile />} />
              <Route
                path="/resident/certificates/logs"
                element={<CertificateRequestLogs />}
              />

              <Route
                path="/track-certificate"
                element={ <TrackDocument /> }
              />
              
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
