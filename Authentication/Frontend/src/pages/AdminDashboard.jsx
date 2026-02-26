import { useUser } from "@/hooks/useUser";

export default function AdminDashboard() {
  const { user } = useUser();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h2>
      <p className="text-gray-600">
        Hello {user?.username}! This is your admin dashboard.
      </p>
    </div>
  );
}