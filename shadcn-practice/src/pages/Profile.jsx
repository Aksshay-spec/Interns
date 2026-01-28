import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUser";


const Profile = () => {
  const { data, isLoading, isError } = useUsers();
  const user = data?.data?.user || data?.data;
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      userName: "",
      email: "",
    },
  });

  const { mutate, isPending } = useUpdateProfile();
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (user) {
      reset({
        userName: user.userName || "",
        email: user.email || "",
      });
      setPreview(user.imageUrl || "");
    }
  }, [user, reset]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">
        Loading profile...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-slate-950">
        Unauthorized access
      </div>
    );
  }

  const onSubmit = (form) => {
    const formData = new FormData();
    formData.append("userName", form.userName);
    formData.append("email", form.email);

    if (form.photo?.[0]) {
      formData.append("profile-image", form.photo[0]);
    }

    mutate(formData,{
      onSuccess: () => {
        navigate("/")
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-sm text-slate-400">
            Update your personal information
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={preview || "/avatar-holder.avif"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-slate-700 shadow"
          />

          <label className="mt-3 cursor-pointer text-sm text-indigo-400 hover:underline">
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
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Username
            </label>
            <input
              {...register("userName")}
              className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              {...register("email")}
             
              className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
