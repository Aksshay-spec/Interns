import { Routes, Route , Navigate } from "react-router-dom";


import { AuthProvider } from "@/contexts/AuthContext";

import ProtectedRoute from "@/routes/ProtectedRoutes";

import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PendingRequests from "@/pages/admin/PendingRequests";

import TenantLayout from "@/layouts/TenantLayout";
import TenantDashboard from "@/pages/tenant/TenantDashboard";

import AddTutor from "@/pages/tenant/AddTutor";

import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Unauthorized from "@/components/common/Unauthorized";

function App() {
  return (
    <Routes>
      <Route element={<AuthProvider />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["superadmin"]} />}
        >
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pending-requests" element={<PendingRequests />} />
          </Route>
        </Route>

        {/* Tenant Routes */}
        <Route
          path="/tenant"
          element={<ProtectedRoute allowedRoles={["tenant"]} />}
        >
          <Route element={<TenantLayout />}>
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/add-tutor" element={<AddTutor />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
