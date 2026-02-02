import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import Footer from "@/components/admin/Footer";
import { useMe } from "../hooks/queries/useMe";
import Loader from "../components/common/Loader";

const AdminLayout = () => {
  const {isPending , isFetching , isLoading} = useMe();
  console.log(isPending , isFetching , isLoading);
  if ( isLoading ) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="relative flex-1 bg-background p-4 sm:p-6 overflow-y-auto">
         <Outlet /> 
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
