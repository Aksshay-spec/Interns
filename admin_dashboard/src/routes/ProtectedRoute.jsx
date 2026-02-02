import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loader from "../components/common/Loader";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
