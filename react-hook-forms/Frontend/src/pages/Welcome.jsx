import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Welcome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-4">
          {user.profileImage && (
            <div className="flex justify-center">
              <img
                src={`http://localhost:5000${user.profileImage}`}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            </div>
          )}
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome, {user.username}! 🎉
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            You have successfully logged in
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <span className="text-sm text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Username:</span>
              <span className="text-sm text-gray-900">{user.username}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/profile" className="flex-1">
              <Button className="w-full h-11 rounded-full" variant="outline">
                View Profile
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              className="flex-1 h-11 rounded-full"
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
