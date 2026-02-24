import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard , UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebarContent = () => {
  const location = useLocation();

  const basePath = `/admin`;

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
          to="/admin/addmanager"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            "text-slate-300 hover:bg-slate-800 hover:text-white",
            location.pathname === "/admin/addmanager" &&
              "bg-slate-800 text-white"
          )}
        >
          <UserPlus size={18} />
          Add Manager
        </Link>
        <Link
          to="/admin/addstudent"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            "text-slate-300 hover:bg-slate-800 hover:text-white",
            location.pathname === "/admin/addstudent" &&
              "bg-slate-800 text-white"
          )}
        >
          <UserPlus size={18} />
          Add Student
        </Link>
        <Link
          to="/admin/addteam"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            "text-slate-300 hover:bg-slate-800 hover:text-white",
            location.pathname === "/admin/addteam" &&
              "bg-slate-800 text-white"
          )}
        >
          <UserPlus size={18} />
          Add Team
        </Link>
    </nav>
  );
};

const AdminSidebar = () => {
  return (
    <aside className="hidden lg:block w-64 bg-slate-900 text-white p-4">
      <AdminSidebarContent />
    </aside>
  );
};

export { AdminSidebarContent };
export default AdminSidebar;
