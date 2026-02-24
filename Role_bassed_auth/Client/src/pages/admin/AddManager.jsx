import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useRegisterManager } from "@/hooks/admin/useRegisterManager";

import { useGetManagers } from "@/hooks/admin/useGetManagers";
import { useDeleteManagerAdmin } from "@/hooks/admin/useDeleteManagerAdmin";
import DataTable from "../../components/common/DataTable";

export default function AddManager() {
  const { mutateAsync, isPending } = useRegisterManager();

  const { data, isLoading } = useGetManagers();
  const { mutate: deleteManager, isPending: isDeleting } = useDeleteManagerAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "manager",
    },
  });

  const onSubmit = async (data) => {
    await mutateAsync(data);
    reset();
  };

  const handleDeleteManager = (managerId) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      deleteManager(managerId);
    }
  };

  return (
    <div className="sm:min-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Add Manager</h1>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <Label className="text-slate-700">Name</Label>
              <Input
                placeholder="Full name"
                className="mt-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="text-slate-700">Email</Label>
              <Input
                type="email"
                placeholder="Email address"
                className="mt-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="text-slate-700">Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                className="mt-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center sm:justify-end pt-4 border-t border-slate-200">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isPending ? "Creating..." : "Create manager"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable 
        isLoading = {isLoading}
        users = {data?.managers}
        role = "Manager"
        createdBy={data?.admin}
        onDelete={handleDeleteManager}
        isDeleting={isDeleting}
        
      /> 
    </div>
  );
}
