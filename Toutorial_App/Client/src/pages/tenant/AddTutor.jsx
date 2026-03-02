import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRegisterTutor } from "@/hooks/tenant/useRegisterTutor";
import { useGetTutors } from "@/hooks/tenant/useGetTutors";
import { useDeleteTutor } from "@/hooks/tenant/useDeleteTutor";

import toast from "react-hot-toast";

export default function AddTutor() {
  const { mutateAsync, isPending } = useRegisterTutor();
  const { data: tutors, isLoading } = useGetTutors();
  const { mutate: deleteTutor } = useDeleteTutor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this tutor?")) return;

    deleteTutor(id, {
      onSuccess: () => {
        toast.success("Tutor deleted successfully!");
      },
    });
  };

  const onSubmit = async (data) => {
    const res = await mutateAsync(data);
    if (res) {
      toast.success("Tutor created successfully!");
      reset();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Add Tutor
        </h1>
      </div>

      {/* Add Tutor Form */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Full name"
                className="mt-1"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email address"
                className="mt-1"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                className="mt-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex min-w-full md:justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isPending ? "Creating..." : "Create Tutor"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Tutors</h2>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading tutors...</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tutors?.tutors?.length > 0 ? (
                    tutors.tutors.map((tutor) => (
                      <TableRow key={tutor._id}>
                        <TableCell>{tutor.name}</TableCell>
                        <TableCell>{tutor.email}</TableCell>
                        <TableCell>
                          {new Date(tutor.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(tutor._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm">
                        No tutors found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}