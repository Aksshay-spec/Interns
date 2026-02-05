import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";

import Unauthorized from "./components/common/Unauthorized";

import AddManager from "./pages/admin/AddManager";
import AddStudent from "./pages/admin/AddStudent";
import AdminProfile from "./pages/admin/Profile";

import ManagerProfile from "./pages/manager/Profile";
import StudentProfile from "./pages/student/Profile";


// layouts
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import StudentLayout from "./layouts/StudentLayout";

// dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import ManagerDashboard from "./pages/manager/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

// auth context
import { AuthProvider } from "./contexts/AuthContext";

// protected routes
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>

  <Route element={<AuthProvider />}>
   
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    
    <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/addmanager" element={<AddManager />} />
        <Route path="/admin/addstudent" element={<AddStudent />} />
      </Route>
    </Route>

    <Route path="/manager" element={<ProtectedRoute allowedRoles={["manager"]} />}>
      <Route element={<ManagerLayout />}>
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />
      </Route>
    </Route>

    <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]} />}>
      <Route element={<StudentLayout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>
    </Route>
  </Route>

  
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

  );
}
