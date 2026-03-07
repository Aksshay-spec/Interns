import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/hooks/student/useUpdateProfile";
import { useGetProfile } from "@/hooks/auth/useGetProfile";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const { mutateAsync, isPending } = useUpdateProfile();
  const { data } = useGetProfile();

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (data?.data) {
      console.log("data",data)
      const { user, roleData } = data?.data || {};
      console.log("user ,", user)

      reset({
        name: user?.name || "",
        email: user?.email || "",
        rollNumber: roleData?.rollNumber || "",
        classLevel: roleData?.classLevel || "",
        board: roleData?.board || "",
        parentName: roleData?.parentName || "",
        phone: roleData?.phone || "",
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
    formData.append("rollNumber", values.rollNumber);
    formData.append("classLevel", values.classLevel);
    formData.append("board", values.board);
    formData.append("parentName", values.parentName);
    formData.append("phone", values.phone);

    if (values.newPassword) {
      formData.append("newPassword", values.newPassword);
      formData.append("confirmPassword", values.confirmPassword);
    }

    if (values.photo?.[0]) {
      formData.append("profileImage", values.photo[0]);
    }

    const res = await mutateAsync(formData);

    if (res) {
      toast.success("Profile updated successfully!");
    }

    sessionStorage.setItem("user", JSON.stringify(res?.data?.user));
    setUser(res?.data?.user);

    navigate("/student/dashboard");
  };

  return (
    <div className="sm:min-w-xl">
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

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Roll Number
            </label>
            <input
              {...register("rollNumber")}
              className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Class
            </label>
            <input
              {...register("classLevel")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {/* Board */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Board
            </label>
            <input
              {...register("board")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {/* Parent Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Parent Name
            </label>
            <input
              {...register("parentName")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              {...register("phone")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          {/* Button */}
          <div className="flex justify-center md:justify-end pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 text-white py-2 px-3 font-semibold hover:bg-indigo-700 disabled:opacity-50"
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