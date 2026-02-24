import { Outlet } from "react-router-dom";
import StudentHeader from "@/components/student/StudentHeader";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentFooter from "@/components/student/StudentFooter";
import { useAuth } from "@/contexts/AuthContext"; 

const StudentLayout = () => {
const { user } = useAuth(); 

  return (
    <div className="min-h-screen flex flex-col">
      <StudentHeader
        role="student"
        title="Student Dashboard"
        user={user}

       
      />

      <div className="flex flex-1">
        <StudentSidebar role="student" />

        <main className="flex-1 bg-slate-100 p-4">
          <Outlet />
        </main>
      </div>

      <StudentFooter />
    </div>
  );
};

export default StudentLayout;
