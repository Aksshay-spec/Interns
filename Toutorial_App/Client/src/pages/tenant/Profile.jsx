import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/hooks/tenant/useUpdateProfile";
import { useGetProfile } from "@/hooks/auth/useGetProfile";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      instituteName: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useUpdateProfile();
  const { data } = useGetProfile();

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (data?.data) {
      const { user, roleData } = data?.data || {};

      reset({
        name: user?.name || "",
        email: user?.email || "",
        instituteName: roleData?.name || "",
        newPassword: "",
        confirmPassword: "",
      });

      setPreview(
        user?.profileImage
          ? `http://localhost:4000${user.profileImage}`
          : "/avatar-holder.avif"
      );
    }
  }, [data, reset]);

  const onSubmit = async (values) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("instituteName", values.instituteName);

    if (values.newPassword) {
      formData.append("newPassword", values.newPassword);
      formData.append("confirmPassword", values.confirmPassword);
    }

    if (values.photo?.[0]) {
      formData.append("profileImage", values.photo[0]);
    }

    const res = await mutateAsync(formData);

    if (res) toast.success("Profile updated successfully!");

    sessionStorage.setItem("user", JSON.stringify(res?.data?.user));
    setUser(res?.data?.user);

    navigate("/tenant/dashboard");
  };

  return (
    <div className="sm:min-w-xl">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={preview}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-slate-300 shadow"
          />

          <label className="mt-3 cursor-pointer text-sm text-indigo-600 hover:underline">
            Change photo
            <input
              type="file"
              className="hidden"
              {...register("photo", {
                onChange: (e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreview(URL.createObjectURL(file));
                },
              })}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <Label>Name</Label>
            <Input {...register("name")} />
          </div>

          <div>
            <Label>Email</Label>
            <Input {...register("email")} />
          </div>

          <div>
            <Label>Institute Name</Label>
            <Input {...register("instituteName")} />
          </div>

          <div>
            <Label>New Password</Label>
            <Input type="password" {...register("newPassword")} />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input type="password" {...register("confirmPassword")} />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Profile"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;