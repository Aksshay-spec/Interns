import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { useRegisterStudent } from "@/hooks/admin/useRegisterStudent";
import { useGetStudents } from "@/hooks/admin/useGetStudents";
import { useDeleteStudentAdmin } from "@/hooks/admin/useDeleteStudentAdmin";
import DataTable from './../../components/common/DataTable';

export default function AddStudent() {
  const { mutateAsync, isPending } = useRegisterStudent();
  const { data: students, isLoading } = useGetStudents();
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudentAdmin();
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

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(studentId);
    }
  };

  return (
    <div className="sm:min-w-xl ">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Add Student</h1>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="flex justify-center sm:justify-end pt-4 border-t border-slate-200">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isPending ? "Creating..." : "Create student"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable 
        isLoading = {isLoading}
        users = {students?.students || students}
        role = "Student"
        createdBy = {students?.admin}
        onDelete={handleDeleteStudent}
        isDeleting={isDeleting}
       />
    </div>
  );
}
