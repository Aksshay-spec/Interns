import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Check if edit mode from URL
  const isEditing = searchParams.get("edit") === "true";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        setValue("username", result.user.username);
        setValue("email", result.user.email);
        if (result.user.profileImage) {
          setImagePreview(`http://localhost:5000${result.user.profileImage}`);
        }
      } else {
        setError("Failed to fetch profile");
      }
    } catch (err) {
      setError("Network error");
      console.error("Fetch profile error:", err);
    }
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

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);

      // Add password fields only if user is changing password and both fields are filled
      if (showPasswordFields && data.currentPassword && data.newPassword) {
        formData.append("currentPassword", data.currentPassword);
        formData.append("newPassword", data.newPassword);
      }

      // Add image if changed
      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setSearchParams({}); // Remove edit param from URL
        setShowPasswordFields(false);
        
        // Reset password fields
        setValue("currentPassword", "");
        setValue("newPassword", "");
        setValue("confirmNewPassword", "");
        
        if (result.user.profileImage) {
          setImagePreview(`http://localhost:5000${result.user.profileImage}`);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Update failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSearchParams({}); // Remove edit param from URL
    setShowPasswordFields(false);
    setError("");
    setSuccess("");
    setValue("username", user.username);
    setValue("email", user.email);
    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("confirmNewPassword", "");
    if (user.profileImage) {
      setImagePreview(`http://localhost:5000${user.profileImage}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {isEditing ? "Edit Profile" : "My Profile"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {isEditing ? "Update your profile information" : "View and manage your account"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {isEditing && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  className="h-11"
                  {...register("profileImage", {
                    onChange: handleImageChange,
                  })}
                />
                <p className="text-xs text-gray-500">Max 5MB (JPEG, PNG, GIF)</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Username</Label>
              <Input
                className="h-11"
                disabled={!isEditing}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                })}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                className="h-11"
                disabled={!isEditing}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Change Password</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className="text-xs"
                  >
                    {showPasswordFields ? "Hide" : "Show"}
                  </Button>
                </div>

                {showPasswordFields && (
                  <div className="space-y-4 border-l-2 border-primary pl-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Current Password</Label>
                      <Input
                        type="password"
                        className="h-11"
                        placeholder="Enter current password"
                        {...register("currentPassword", {
                          validate: (value) => {
                            if (showPasswordFields && !value) {
                              return "Current password is required";
                            }
                            if (value && value.length < 6) {
                              return "Minimum 6 characters";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.currentPassword && (
                        <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">New Password</Label>
                      <Input
                        type="password"
                        className="h-11"
                        placeholder="Enter new password"
                        {...register("newPassword", {
                          validate: (value) => {
                            if (showPasswordFields && !value) {
                              return "New password is required";
                            }
                            if (value && value.length < 6) {
                              return "Minimum 6 characters";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.newPassword && (
                        <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Confirm New Password</Label>
                      <Input
                        type="password"
                        className="h-11"
                        placeholder="Confirm new password"
                        {...register("confirmNewPassword", {
                          validate: (value) => {
                            if (showPasswordFields && !value) {
                              return "Please confirm your new password";
                            }
                            if (showPasswordFields && value !== newPassword) {
                              return "Passwords do not match";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.confirmNewPassword && (
                        <p className="text-xs text-red-500">{errors.confirmNewPassword.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user.createdAt && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Member since:</span>
                <span className="text-sm text-gray-900 ml-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {isEditing ? (
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 rounded-full"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-full"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </form>

        {/* View mode buttons - Outside the form */}
        {!isEditing && (
          <CardContent className="space-y-4 border-t pt-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-full"
                onClick={() => navigate("/welcome")}
              >
                Back
              </Button>
              <Button
                type="button"
                className="flex-1 h-11 rounded-full"
                onClick={() => setSearchParams({ edit: "true" })}
              >
                Edit Profile
              </Button>
            </div>

            <Button
              type="button"
              variant="destructive"
              className="w-full h-11 rounded-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
