import { useForm } from "react-hook-form";
import {Link} from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
    const { mutate, isLoading, error, isSuccess } = useLogin();
    

  const onSubmit = async ({email,password}) => {
    mutate({ email, password }, {
      onSuccess: () => {
        navigate("/");
      },
    });
    // navigate("/")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-sm bg-slate-900 border border-slate-800 text-slate-100 shadow-xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Login to your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email format is invalid",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1 mb-3">
              <Label className="text-slate-300">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-5">
            <Button disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
               {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-gray-400 mt-2">
              Don't have account?{" "}
              <Link className="no-underline ml-1 text-indigo-400 hover:text-indigo-300" to={"/register"}>
                Register
              </Link>
            </p>
            {error && <p>{error.response?.data?.message}</p>}
            {isSuccess && <p>Login Successful 🎉</p>}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
