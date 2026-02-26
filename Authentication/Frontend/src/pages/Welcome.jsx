import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  
  const response = await fetch("http://localhost:5000/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  
  const data = await response.json();
  return data.user;
};

export default function Welcome() {
  const navigate = useNavigate();
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: 1,
  });


  if (!localStorage.getItem("token")) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">Error: {error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p>No user data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Welcome, {user.username}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-indigo-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p className="text-lg">
                <span className="font-semibold">Email:</span> {user.email}
              </p>  
              
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate("/profile")}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Profile
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
