import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useRegisterManager } from "@/hooks/admin/useRegisterManager";
import { useGetManagers } from "@/hooks/admin/useGetManagers";
import { useDeleteManager } from "@/hooks/admin/useDeleteManager";

import DataTable from "../../components/common/DataTable";
import toast from "react-hot-toast";

export default function AddManager() {
  const { mutateAsync, isPending } = useRegisterManager();
  const { data, isLoading } = useGetManagers();
  const { mutate: deleteManager } = useDeleteManager();

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
    const res = await mutateAsync(data);
    if (res) {
      toast.success("Manager created successfully!");
    }
    reset();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;

    deleteManager(id, {
      onSuccess: () => {
        toast.success("Manager deleted successfully!");
      },
    });
  };

  return (
    <div className="sm:min-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Add Manager
        </h1>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email address"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
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

            <div className="flex justify-center sm:justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto bg-indigo-600 text-white"
              >
                {isPending ? "Creating..." : "Create manager"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable
        isLoading={isLoading}
        users={data?.managers}
        role="Manager"
        createdBy={data?.admin}
        onDelete={handleDelete}
      />
    </div>
  );
}