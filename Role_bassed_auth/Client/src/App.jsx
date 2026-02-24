import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";

import Unauthorized from "./components/common/Unauthorized";

import AddManager from "./pages/admin/AddManager";
import AddStudent from "./pages/admin/AddStudent";
import AdminProfile from "./pages/admin/Profile";
import AddTeam from "./pages/admin/AddTeam";



import StudentProfile from "./pages/student/Profile";
import Tasks from "./pages/student/Tasks";
import TaskDetails from "./pages/student/TaskDetails";



import ManagerProfile from "./pages/manager/Profile";
import AddStudentManager from "./pages/manager/AddStudent"
import Team from "./pages/manager/Team"
import AddMembers from "./pages/manager/AddMembers"
import Student from "./pages/manager/Student"
import Task from "./pages/manager/Task"
import CompletedTasks from "./pages/manager/CompletedTasks"


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
    <>
      <Toaster position="top-right" />
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
        <Route path="/admin/addteam" element={<AddTeam />} />
      </Route>
    </Route>

    <Route path="/manager" element={<ProtectedRoute allowedRoles={["manager"]} />}>
      <Route element={<ManagerLayout />}>
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />
        <Route path="/manager/addstudent" element={<AddStudentManager />} />
        <Route path="/manager/team" element={<Team />} />
        <Route path="/manager/:teamId/addmembers" element={<AddMembers />} />
        <Route path="/manager/student/:sId" element={<Student />} />
        <Route path="/manager/task" element={<Task />} />
        <Route path="/manager/completed-tasks" element={<CompletedTasks />} />
      </Route>
    </Route>

    <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]} />}>
      <Route element={<StudentLayout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/tasks" element={<Tasks />} />
        <Route path="/student/task/:taskId" element={<TaskDetails />} />
      </Route>
    </Route>
  </Route>

  
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
    </>
  );
}
