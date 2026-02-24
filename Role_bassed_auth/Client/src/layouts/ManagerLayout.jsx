import { Outlet } from "react-router-dom";
import ManagerHeader from "@/components/manager/ManagerHeader";
import ManagerSidebar from "@/components/manager/ManagerSidebar";
import ManagerFooter from "@/components/manager/ManagerFooter";
import { useAuth } from "@/contexts/AuthContext";

const ManagerLayout = () => {
  const { user } = useAuth(); 

  return (
    <div className="min-h-screen flex flex-col">
      <ManagerHeader
        role="manager"
        title="Manager Dashboard"
        user={user}
      />

      <div className="flex flex-1">
        <ManagerSidebar role="manager" />

        <main className="flex-1 bg-slate-100 p-4">
          <Outlet />
        </main>
      </div>

      <ManagerFooter />
    </div>
  );
};

export default ManagerLayout;
