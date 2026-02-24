import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UserPlus, ClipboardList, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ManagerSidebarContent = () => {
  const location = useLocation();

  const basePath = `/manager`;

  return (
    <nav className="space-y-2">
      <Link
        to={`${basePath}/dashboard`}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          "text-slate-300 hover:bg-slate-800 hover:text-white",
          location.pathname === `${basePath}/dashboard` &&
            "bg-slate-800 text-white"
        )}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>
      <Link
        to={`${basePath}/addstudent`}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          "text-slate-300 hover:bg-slate-800 hover:text-white",
          location.pathname === `${basePath}/addstudent` &&
            "bg-slate-800 text-white"
        )}
      >
        <UserPlus size={18} />
        Add Student
      </Link>
      <Link
        to={`${basePath}/team`}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          "text-slate-300 hover:bg-slate-800 hover:text-white",
          location.pathname === `${basePath}/team` &&
            "bg-slate-800 text-white"
        )}
      >
        <UserPlus size={18} />
        Team
      </Link>
      <Link
        to={`${basePath}/task`}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          "text-slate-300 hover:bg-slate-800 hover:text-white",
          location.pathname === `${basePath}/task` &&
            "bg-slate-800 text-white"
        )}
      >
        <ClipboardList size={18} />
        Task
      </Link>
      <Link
        to={`${basePath}/completed-tasks`}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          "text-slate-300 hover:bg-slate-800 hover:text-white",
          location.pathname === `${basePath}/completed-tasks` &&
            "bg-slate-800 text-white"
        )}
      >
        <CheckCircle size={18} />
        Completed Tasks
      </Link>
    </nav>
  );
};

const ManagerSidebar = () => {
  return (
    <aside className="hidden lg:block w-64 bg-slate-900 text-white p-4">
      <ManagerSidebarContent />
    </aside>
  );
};

export { ManagerSidebarContent };
export default ManagerSidebar;
