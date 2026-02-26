import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserProfile, updateUserProfile } from "@/apis/authApi";
import { useAuth } from "@/hooks/useAuth";


export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm();
  const [preview, setPreview] = useState(null);
  const { logout } = useAuth();

  if (!localStorage.getItem("token")) {
    navigate("/login");
    return null;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await getUserProfile();
      return { user };
    },
  });

  useEffect(() => {
    if (data?.user) {
      setValue("username", data.user.username);
      setPreview(data.user.profileImage);
    }
  }, [data, setValue]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["userProfile"]);
      navigate("/dashboard");
    },
  });

  const onSubmit = (values) => {
    const form = new FormData();
    form.append("username", values.username);
    if (values.password) form.append("password", values.password);
    if (values.profileImage?.[0]) {
      form.append("profileImage", values.profileImage[0]);
    }
    mutation.mutate(form);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {preview && (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  {...register("profileImage")}
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  {...register("username", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  {...register("password")}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  {mutation.isPending ? "Saving..." : "Update Profile"}
                </Button>
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={logout}
                className="w-full mt-4"
              >
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
