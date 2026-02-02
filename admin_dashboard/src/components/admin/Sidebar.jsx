import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";


const SidebarContent = () => {
  const location = useLocation();
//   console.log("location:", location);

  return (
    <nav className="space-y-2">
      <Link
        to="/admin"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors",
          location.pathname === "/admin" && "bg-slate-800"
        )}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>
    </nav>
  );
};

const Sidebar = () => {
  return (
    <aside className="hidden lg:block w-64 bg-slate-900 text-white p-4">
      <SidebarContent />
    </aside>
  );
};

export { SidebarContent };
export default Sidebar;
