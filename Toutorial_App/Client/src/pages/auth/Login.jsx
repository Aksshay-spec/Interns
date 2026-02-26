import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "@/hooks/auth/useAuthMutations";
import { useAuth } from "@/contexts/AuthContext";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { redirectByRole} from "@/utils/roleRedirect";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useLogin();
  const { login } = useAuth();

  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        login(res?.data?.token, res?.data?.user);

        toast.success("Login successful!");

        
        // Redirect based on user role
        const userRole = res?.data?.user?.role;
        redirectByRole(userRole, navigate);
        
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Login failed");
      },
    });
  };

  return (
     <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
       <Card className="w-[380px]   bg-slate-900/90 backdrop-blur border border-slate-800 text-slate-100 shadow-2xl">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500
                  focus-visible:ring-2 focus-visible:ring-slate-500
                  ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500
                  focus-visible:ring-2 focus-visible:ring-slate-500
                  ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" 
            className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200
                         font-medium transition"
             disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}