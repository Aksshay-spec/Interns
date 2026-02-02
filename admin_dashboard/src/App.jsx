import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <AuthProvider>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </AuthProvider>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>

// {/* <Route path="/admin" element={<PrivateRoute role="admin" />}>
//           <Route path="admindashboard" element={<AdminDashboard />} />
//           <Route path="createfaculties" element={<CreateFaculties />} />
//           <Route path="students" element={<AllStudents />} />
//           <Route path="profile" element={<AdminProfile />} />
//         </Route> */}

  );
}

export default App;
