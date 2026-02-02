import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/mutations/useRegister";
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const { mutate, isPending, error } = useRegister();

  // Clean up preview URL (important)
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = ({ userName, email, password, photo }) => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);

    if (photo?.[0]) {
      formData.append("profile-image", photo[0]);
    }

    mutate(formData, {
  onSuccess: () => {
    toast.success("Account created successfully");
    navigate("/login");
  },
  onError: (err) => {
    toast.error(
      err.response?.data?.message || "Registration failed"
    );
  },
});

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-sm bg-slate-900 border border-slate-800 text-slate-100 shadow-xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-400">
            Register to get started
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={preview || "/avatar-holder.avif"}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border border-slate-700"
              />

              <Label className="cursor-pointer text-sm text-indigo-400">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("photo", {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    },
                  })}
                />
              </Label>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <Label className="text-slate-300">Username</Label>
              <Input
                className="bg-slate-800 border-slate-700 text-white"
                {...register("userName", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
              {errors.userName && (
                <p className="text-xs text-red-400">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                className="bg-slate-800 border-slate-700 text-white"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email is invalid",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="text-slate-300">Password</Label>
              <Input
                type="password"
                className="bg-slate-800 border-slate-700 text-white"
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label className="text-slate-300">Confirm Password</Label>
              <Input
                type="password"
                className="bg-slate-800 border-slate-700 text-white"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-5">
            <Button
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isPending ? "Registering..." : "Register"}
            </Button>

            {error && (
              <p className="text-red-400 text-sm text-center">
                {error.response?.data?.message || "Registration failed"}
              </p>
            )}

            <p className="text-sm text-slate-400 text-center">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-indigo-400 hover:text-indigo-300"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
