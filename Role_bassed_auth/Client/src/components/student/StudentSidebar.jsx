import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard , ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const StudentSidebarContent = () => {
  const location = useLocation();

  const basePath = `/student`;

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
        to={`${basePath}/tasks`}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          "text-slate-300 hover:bg-slate-800 hover:text-white",
          location.pathname === `${basePath}/tasks` &&
            "bg-slate-800 text-white"
        )}
      >
        <ClipboardList size={18} />
        Tasks
      </Link>
        
      
      
    </nav>
  );
};

const StudentSidebar = () => {
  return (
    <aside className="hidden lg:block w-64 bg-slate-900 text-white p-4">
      <StudentSidebarContent />
    </aside>
  );
};

export { StudentSidebarContent };
export default StudentSidebar;