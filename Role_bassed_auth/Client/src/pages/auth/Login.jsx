import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useLogin } from "@/hooks/useLogin";
import { redirectByRole } from "@/utils/roleRedirect";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogin();
  const { login } = useAuth();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await mutateAsync(data);
      console.log("res", res.user);
      login(res.token, res.user);
      redirectByRole(res.user.role, navigate);
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Card className="w-[380px] bg-slate-900/90 backdrop-blur border border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to continue to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <Label className="text-slate-300">Email</Label>
              <Input
                {...register("email", { required: true })}
                placeholder="you@example.com"
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500
                           focus-visible:ring-2 focus-visible:ring-slate-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="text-slate-300">Password</Label>
              <Input
                type="password"
                {...register("password", { required: true })}
                placeholder="••••••••"
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500
                           focus-visible:ring-2 focus-visible:ring-slate-500"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200
                         font-medium transition"
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
