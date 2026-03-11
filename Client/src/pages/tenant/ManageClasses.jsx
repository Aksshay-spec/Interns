import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateClass } from "@/hooks/tenant/useCreateClass";
import { useGetClasses } from "@/hooks/tenant/useGetClasses";
import { useDeleteClass } from "@/hooks/tenant/useDeleteClass";
import { useUpdateClass } from "@/hooks/tenant/useUpdateClass";
import { useGetTutors } from "@/hooks/tenant/useGetTutors";
import { useGetStudents } from "@/hooks/tenant/useGetStudents";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import toast from "react-hot-toast";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ManageClasses() {
  const { mutateAsync: createClass, isPending: isCreating } = useCreateClass();
  const { mutateAsync: updateClass, isPending: isUpdating } = useUpdateClass();
  const { data: classesData, isLoading } = useGetClasses();
  const { mutate: deleteClass } = useDeleteClass();
  const { data: tutorsData } = useGetTutors();
  const { data: studentsData } = useGetStudents();

  const [editingClass, setEditingClass] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const studentDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        studentDropdownRef.current &&
        !studentDropdownRef.current.contains(e.target)
      ) {
        setShowStudentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isEditMode = Boolean(editingClass);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const tutors = tutorsData?.tutors || [];
  const students = studentsData?.students || [];
  const classes = classesData?.classes || [];

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    deleteClass(id, {
      onSuccess: () => {
        toast.success("Class deleted successfully!");
      },
    });
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const onSubmit = async (data) => {
    if (!selectedTutor) {
      toast.error("Please select a tutor");
      return;
    }

    const payload = {
      name: data.name,
      subject: data.subject,
      tutorId: selectedTutor,
      studentIds: selectedStudents,
      schedule: {
        days: selectedDay,
        time: data.time || "",
      },
    };

    if (isEditMode) {
      if (data.status) {
        payload.status = data.status;
      }
      const res = await updateClass({
        classId: editingClass._id,
        data: payload,
      });
      if (res) {
        toast.success("Class updated successfully!");
        handleCancelEdit();
      }
      return;
    }

    const res = await createClass(payload);
    if (res) {
      toast.success("Class created successfully!");
      handleCancelEdit();
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setValue("name", cls.name || "");
    setValue("subject", cls.subject || "");
    setValue("time", cls.schedule?.time || "");
    setValue("status", cls.status || "active");
    setSelectedTutor(cls.tutorId?._id || "");
    setSelectedStudents(cls.studentIds?.map((s) => s._id) || []);
    setSelectedDay(cls.schedule?.days || "");
  };

  const handleCancelEdit = () => {
    setEditingClass(null);
    setSelectedTutor("");
    setSelectedStudents([]);
    setSelectedDay("");
    setShowStudentDropdown(false);
    reset();
  };

  const handleToggleStatus = async (cls) => {
    const nextStatus = cls.status === "completed" ? "active" : "completed";

    const res = await updateClass({
      classId: cls._id,
      data: { status: nextStatus },
    });

    if (res) {
      toast.success(`Class marked as ${nextStatus}!`);
    }
  };

  const getTutorName = (tutorField) => {
    return tutorField?.userId?.name || "Unknown";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Manage Classes
        </h1>
      </div>

      {/* Create / Edit Class Form */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Class Name */}
            <div>
              <Label>Class Name</Label>
              <Input
                placeholder="e.g. Math 101"
                className="mt-1"
                {...register("name", { required: "Class name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="e.g. Mathematics"
                className="mt-1"
                {...register("subject", { required: "Subject is required" })}
              />
              {errors.subject && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea
                placeholder="e.g. This class covers fundamental algebra concepts..."
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none min-h-[80px]"
                {...register("description")}
              />
            </div>

            {/* Tutor Selection */}
            <div>
              <Label>Assign Tutor</Label>
              <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select a tutor" />
                </SelectTrigger>
                <SelectContent>
                  {tutors
                    .filter((t) => t.status === "active")
                    .map((tutor) => (
                      <SelectItem key={tutor.tutorId} value={tutor.tutorId}>
                        {tutor.name} — {tutor.subjects?.join(", ")}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student Selection */}
            <div className="relative" ref={studentDropdownRef}>
              <Label>Enroll Students</Label>
              <button
                type="button"
                onClick={() => setShowStudentDropdown((prev) => !prev)}
                className="mt-1 w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent focus:outline-none"
              >
                <span className="text-muted-foreground">
                  {selectedStudents.length > 0
                    ? `${selectedStudents.length} student(s) selected`
                    : "Select students"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${showStudentDropdown ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showStudentDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                  {(() => {
                    const activeStudents = students.filter(
                      (s) => s.status === "active",
                    );
                    const allSelected =
                      activeStudents.length > 0 &&
                      activeStudents.every((s) =>
                        selectedStudents.includes(s.studentId),
                      );
                    return (
                      <>
                        {activeStudents.length > 0 && (
                          <div className="border-b px-2 py-1.5">
                            <label className="flex items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-accent text-sm font-medium">
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={() => {
                                  if (allSelected) {
                                    setSelectedStudents([]);
                                  } else {
                                    setSelectedStudents(
                                      activeStudents.map((s) => s.studentId),
                                    );
                                  }
                                }}
                                className="rounded"
                              />
                              <span>Select All</span>
                            </label>
                          </div>
                        )}
                        <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                          {activeStudents.length > 0 ? (
                            activeStudents.map((student) => (
                              <label
                                key={student.studentId}
                                className="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-accent text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(
                                    student.studentId,
                                  )}
                                  onChange={() =>
                                    toggleStudent(student.studentId)
                                  }
                                  className="rounded"
                                />
                                <span>
                                  {student.name} — {student.rollNumber}
                                </span>
                              </label>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground px-2 py-1.5">
                              No students available
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Schedule Day */}
            <div>
              <Label>Schedule Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Time */}
            <div>
              <Label>Time</Label>
              <Input
                placeholder="e.g. 10:00 AM - 11:00 AM"
                className="mt-1"
                {...register("time")}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-center md:justify-end gap-2 pt-4 border-t">
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="w-full md:w-35"
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
                    ? "Update Class"
                    : "Create Class"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Classes</h2>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading classes...</p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Toggle</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {classes.length > 0 ? (
                    classes.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell className="font-medium capitalize">
                          {cls.name}
                        </TableCell>
                        <TableCell className="capitalize">{cls.subject}</TableCell>
                        <TableCell className="capitalize">{getTutorName(cls.tutorId)}</TableCell>
                        <TableCell>
                          {cls.studentIds && cls.studentIds.length > 0 ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  {cls.studentIds.length} Students
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="w-48">
                                {cls.studentIds.map((student) => (
                                  <DropdownMenuItem key={student._id}>
                                    {student.userId?.name || "Unknown"}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No students
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{cls.schedule?.days || "-"}</div>
                            <div className="text-muted-foreground">
                              {cls.schedule?.time || "-"}
                            </div>
                          </div>
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              cls.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {cls.status === "completed"
                              ? "Completed"
                              : "Active"}
                          </span>
                        </TableCell>

                        {/* Toggle Status */}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(cls)}
                            disabled={isUpdating}
                          >
                            {cls.status === "completed"
                              ? "Reactivate"
                              : "Complete"}
                          </Button>
                        </TableCell>

                        <TableCell>
                          {new Date(cls.createdAt).toLocaleDateString()}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(cls)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(cls._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-sm">
                        No classes found
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
