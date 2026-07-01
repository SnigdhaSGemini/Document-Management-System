import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import PageNotFound from './components/PageNotFound'
import Register from './pages/Login/Register';
import ResetPassword from './pages/Login/ResetPassword';
import Login from './pages/Login/Login';
import PublicRoutes from './layout/PublicRoutes';
import ProtectedRoutes from './layout/ProtectedRoutes';
import UserManagement from './pages/UserManagement';
import CreateDocument from './pages/CreateDocument';
import Dashboard from './pages/Dashboard';
import MyDrafts from './pages/MyDrafts';
import PendingReviews from './pages/PendingReviews';
import ReviewOutcomes from './pages/ReviewOutcomes';
import AssignedDrafts from './pages/AssignedDrafts';
import ReviewedDocuments from './pages/ReviewedDocuments';
import AllDocuments from './pages/AllDocuments';
import VersionHistory from './pages/History/VersionHistory';
import AuditLogs from './pages/AuditLogs';
import DetailsPage from './pages/DetailsPage';
import Unauthorized from './components/Unauthorized';
import VerifyOtp from './pages/Login/VerifyOtp';


function App() {

  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoutes />}>
          <Route index element={<Navigate to="sign-in" replace />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
      </Route>
      
      {/* Private Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-document" element={<CreateDocument />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/my-drafts" element={<MyDrafts />} />
        <Route path="/pending-reviews" element={<PendingReviews />} />
        <Route path="/review-outcomes" element={<ReviewOutcomes />} />
        <Route path="/assigned-drafts" element={<AssignedDrafts />} />
        <Route path="/reviewed-documents" element={<ReviewedDocuments />} />
        <Route path="/all-documents" element={<AllDocuments />} />
        <Route path="/draft-details" element={<DetailsPage />} />
        <Route path="/history" element={<VersionHistory />} />
        <Route path="/audit-logs" element={<AuditLogs/>} />
      </Route>

      <Route path={"/unauthorized"} element={<Unauthorized/>}/>
      <Route path={"*"} element={<PageNotFound/>}/>

    </Routes>
    </>
  )
}

export default App;
