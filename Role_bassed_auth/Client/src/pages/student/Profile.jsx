import { useForm } from "react-hook-form";
import { useUpdateStudentProfile } from "@/hooks/student/useUpdateStudentProfile";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { mutateAsync, isPending } = useUpdateStudentProfile();
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
      });
      setPreview(
        user?.profileImage
          ? `http://localhost:4000${user.profileImage}`
          : "/avatar-holder.avif"
      );
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);

    if (values.photo?.[0]) {
      formData.append("profileImage", values.photo[0]);
    }

    if (values.newPassword) {
      formData.append("currentPassword", values.currentPassword);
      formData.append("newPassword", values.newPassword);
    }

    const res = await mutateAsync(formData);

    localStorage.setItem("user", JSON.stringify(res?.data?.user));
    setUser(res?.data?.user);
    navigate("/student/dashboard");
  };

  return (
    <div className="sm:min-w-xl px-4">
      <div className="sm:min-w-xl bg-white rounded-xl shadow-md border border-slate-200 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        
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
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                },
              })}
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              {...register("name")}
              className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              {...register("email")}
              className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              {...register("currentPassword")}
              className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              {...register("newPassword", {
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              {...register("confirmPassword", {
                validate: (value, formValues) =>
                  value === formValues.newPassword ||
                  "Passwords do not match",
              })}
              className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto rounded-lg bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Profile"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
