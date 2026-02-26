import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { registerUser, saveAuthData } from "@/apis/authApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (result) => {
      saveAuthData(result.token, result.user);
      setSuccess(true);
      
      // Show success state for 2 seconds before redirecting
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
  });

  const onSubmit = (data) => {
    // Prepare FormData to include image
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    
    // Add image if selected
    if (data.profileImage && data.profileImage[0]) {
      formData.append("profileImage", data.profileImage[0]);
    }

    mutation.mutate(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      {success ? (
        <Card className="w-full max-w-sm shadow-xl rounded-2xl">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
                <p className="text-gray-600">Redirecting to dashboard...</p>
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm shadow-xl rounded-2xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create account 🚀
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign up to get started
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5">
              {mutation.isError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {mutation.error?.message || "Registration failed"}
                </div>
              )}

              {/* Profile Image Upload */}
              <div className="space-y-1.5">
              <Label className="text-sm font-medium">Profile Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  className="h-11"
                  {...register("profileImage", {
                    onChange: handleImageChange
                  })}
                />
              </div>
            </div>
           
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Username</Label>
              <Input
                placeholder="Username"
                className="h-11"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                })}
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

          
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                placeholder="d@example.com"
                className="h-11"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

         
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Password</Label>
              <Input
                type="password"
                className="h-11"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

           
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Confirm Password</Label>
              <Input
                type="password"
                className="h-11"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>

         
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full h-11" disabled={mutation.isPending}>
              {mutation.isPending ? "Registering..." : "Register"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      )}
    </div>
  );
}
