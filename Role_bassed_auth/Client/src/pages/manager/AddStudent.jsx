import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { useRegisterStudent } from "@/hooks/manager/useRegisterStudent";
import { useGetStudents } from "@/hooks/manager/useGetStudents";
import { useDeleteStudent } from "@/hooks/manager/useDeleteStudent";
import toast from "react-hot-toast";

export default function AddStudent() {
  const { mutateAsync, isPending } = useRegisterStudent();
  const { data, isLoading } = useGetStudents();
  const { mutate: deleteStudent } = useDeleteStudent();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data) => {
   const res =  await mutateAsync(data);
    if(res){
      toast.success("Student created successfully!");
    }
    reset();
  };

  const students = data?.students;
  const manager = data?.manager;

  return (
    <div className="sm:min-w-xl">
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
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
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
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
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
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
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

      {/* TABLE */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Students</h2>

        {isLoading ? (
          <p className="text-muted-foreground">Loading Students...</p>
        ) : (
          <div className="rounded-lg border bg-background shadow-sm overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[70px]">#</TableHead>
                  <TableHead>Student Name</TableHead>
                  {manager && <TableHead>Created By</TableHead>}
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="capitalize">
                {students?.length > 0 ? (
                  students.map((user, index) => (
                    <TableRow key={user._id} className="hover:bg-muted/40">
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>

                      <TableCell className="font-medium">{user.name}</TableCell>

                      {manager && (
                        <TableCell className="font-medium">{manager?.name}</TableCell>
                      )}

                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs h-8"
                          onClick={() => deleteStudent(user._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={manager ? 4 : 3}
                      className="text-center text-muted-foreground py-6"
                    >
                      No Student found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}