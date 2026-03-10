import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Your Student dashboard is ready
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
