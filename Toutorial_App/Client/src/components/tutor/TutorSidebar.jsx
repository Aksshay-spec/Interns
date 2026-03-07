import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UserPlus, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const TutorSidebarContent = () => {
  const location = useLocation();

  const basePath = `/tutor`;

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

      
    </nav>
  );
};

const TutorSidebar = () => {
  return (
    <aside className="hidden lg:block w-64 bg-slate-900 text-white p-4">
      <TutorSidebarContent />
    </aside>
  );
};

export { TutorSidebarContent };
export default TutorSidebar;
