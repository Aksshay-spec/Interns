import { useForm } from "react-hook-form";
import { useState } from "react";

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

import { useRegisterStudent } from "@/hooks/tenant/useRegisterStudent";
import { useGetStudents } from "@/hooks/tenant/useGetStudents";
import { useDeleteStudent } from "@/hooks/tenant/useDeleteStudent";
import { useUpdateStudent } from "@/hooks/tenant/useUpdateStudent";

import toast from "react-hot-toast";

export default function AddStudent() {
  const { mutateAsync: createStudent, isPending: isCreating } = useRegisterStudent();
  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { data: students, isLoading } = useGetStudents();
  const { mutate: deleteStudent } = useDeleteStudent();
  const [editingStudent, setEditingStudent] = useState(null);
  const isEditMode = Boolean(editingStudent);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    deleteStudent(id, {
      onSuccess: () => {
        toast.success("Student deleted successfully!");
      },
    });
  };

  const onSubmit = async (data) => {
    if (isEditMode) {
      const payload = {
        name: data.name,
        email: data.email,
        rollNumber: data.rollNumber,
        classLevel: data.classLevel,
        board: data.board,
        phone: data.phone,
        parentName: data.parentName,
      };
      const res = await updateStudent({
        studentId: editingStudent._id,
        data: payload,
      });
      if (res) {
        toast.success("Student updated successfully!");
        setEditingStudent(null);
        reset();
      }
      return;
    }

    const res = await createStudent(data);
    if (res) {
      toast.success("Student created successfully!");
      reset();
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setValue("name", student.name || "");
    setValue("email", student.email || "");
    setValue("password", "");
    setValue("rollNumber", student.rollNumber || "");
    setValue("classLevel", student.classLevel || "");
    setValue("board", student.board || "");
    setValue("phone", student.phone || "");
    setValue("parentName", student.parentName || "");
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    reset();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Add Student</h1>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Full name"
                className="mt-1"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email address"
                className="mt-1"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                className="mt-1"
                {...register("password", {
                  required: isEditMode ? false : "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label>Roll Number</Label>
              <Input
                placeholder="e.g. STU-101"
                className="mt-1"
                {...register("rollNumber", { required: "Roll number is required" })}
              />
              {errors.rollNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.rollNumber.message}</p>
              )}
            </div>

            <div>
              <Label>Class Level</Label>
              <Input
                placeholder="e.g. 10"
                className="mt-1"
                {...register("classLevel", { required: "Class level is required" })}
              />
              {errors.classLevel && (
                <p className="text-xs text-red-500 mt-1">{errors.classLevel.message}</p>
              )}
            </div>

            <div>
              <Label>Board</Label>
              <Input
                placeholder="e.g. CBSE"
                className="mt-1"
                {...register("board", { required: "Board is required" })}
              />
              {errors.board && (
                <p className="text-xs text-red-500 mt-1">{errors.board.message}</p>
              )}
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                placeholder="Phone number"
                className="mt-1"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label>Parent Name</Label>
              <Input
                placeholder="Parent full name"
                className="mt-1"
                {...register("parentName", { required: "Parent name is required" })}
              />
              {errors.parentName && (
                <p className="text-xs text-red-500 mt-1">{errors.parentName.message}</p>
              )}
            </div>

            <div className="flex justify-center md:justify-end pt-4 border-t">
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="w-full md:w-35 mr-0 md:mr-2"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-indigo-600 w-full md:w-35 hover:bg-indigo-700 text-white"
              >
                {isCreating || isUpdating
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Student"
                  : "Create Student"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Students</h2>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading students...</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Board</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {students?.students?.length > 0 ? (
                    students.students.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.rollNumber || "-"}</TableCell>
                        <TableCell>{student.classLevel || "-"}</TableCell>
                        <TableCell>{student.board || "-"}</TableCell>
                        <TableCell>{student.phone || "-"}</TableCell>
                        <TableCell>{student.parentName || "-"}</TableCell>
                        <TableCell>
                          {new Date(student.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-left">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(student._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-sm">
                        No students found
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
