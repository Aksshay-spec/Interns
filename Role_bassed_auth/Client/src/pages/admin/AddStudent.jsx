import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useRegisterStudent } from "@/hooks/admin/useRegisterStudent";


export default function AddStudent() {
  const { mutateAsync, isPending } = useRegisterStudent();
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

  return (
    <div className="sm:min-w-xl ">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Add Student
        </h1>
      </div>

      <Card className="bg-slate-900 border border-slate-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
     
            <div>
              <Label className="text-slate-300">Name</Label>
              <Input
                placeholder="Full name"
                className="mt-1 bg-slate-800 border-slate-700 text-white"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                placeholder="Email address"
                className="mt-1 bg-slate-800 border-slate-700 text-white"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-slate-300">Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                className="mt-1 bg-slate-800 border-slate-700 text-white"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isPending ? "Creating..." : "Create student"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
