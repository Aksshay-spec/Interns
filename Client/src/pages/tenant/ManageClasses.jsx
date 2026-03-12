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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import toast from "react-hot-toast";

const formatTime12h = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const parseTime12to24 = (time12) => {
  if (!time12) return "";
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "";
  let [, hours, minutes, period] = match;
  hours = parseInt(hours);
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

const formatDateWithDay = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ManageClasses() {
  const { mutateAsync: createClass, isPending: isCreating } = useCreateClass();
  const { mutateAsync: updateClass, isPending: isUpdating } = useUpdateClass();
  const { data: classesData, isLoading } = useGetClasses();
  const { mutate: deleteClass, isPending: isDeleting } = useDeleteClass();
  const { data: tutorsData } = useGetTutors();
  const { data: studentsData } = useGetStudents();

  const [editingClass, setEditingClass] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showDateDetailsModal, setShowDateDetailsModal] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState("");
  const [deleteClassId, setDeleteClassId] = useState(null);
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
    watch,
    formState: { errors },
  } = useForm();

  const scheduleDateValue = watch("scheduleDate");

  useEffect(() => {
    if (scheduleDateValue && !isEditMode) {
      setSelectedModalDate(scheduleDateValue);
      setShowDateDetailsModal(true);
    }
  }, [scheduleDateValue]);

  const tutors = tutorsData?.tutors || [];
  const students = studentsData?.students || [];
  const classes = classesData?.classes || [];

  const handleDelete = (id) => {
    setDeleteClassId(id);
  };

  const confirmDelete = () => {
    if (!deleteClassId) return;

    deleteClass(deleteClassId, {
      onSuccess: () => {
        toast.success("Class deleted successfully!");
        setDeleteClassId(null);
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

    const formattedTime =
      data.startTime && data.endTime
        ? `${formatTime12h(data.startTime)} - ${formatTime12h(data.endTime)}`
        : data.startTime
          ? formatTime12h(data.startTime)
          : "";

    const payload = {
      name: data.name,
      subject: data.subject,
      tutorId: selectedTutor,
      description: data.description,
      studentIds: selectedStudents,
      schedule: {
        days: data.scheduleDate || "",
        time: formattedTime,
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
    setValue("description", cls.description || "");
    setValue("scheduleDate", cls.schedule?.days || "");
    setValue("status", cls.status || "active");
    setSelectedTutor(cls.tutorId?._id || "");
    setSelectedStudents(cls.studentIds?.map((s) => s._id) || []);

    const timeStr = cls.schedule?.time || "";
    const timeParts = timeStr.split(" - ");
    setValue("startTime", parseTime12to24(timeParts[0]));
    setValue("endTime", parseTime12to24(timeParts[1]));
  };

  const handleCancelEdit = () => {
    setEditingClass(null);
    setSelectedTutor("");
    setSelectedStudents([]);
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



  const getClassesForDate = (dateStr) => {
    if (!dateStr) return [];
    
    // Extract day of week from date string (e.g., "2026-03-11" -> "Wednesday")
    const selectedDate = new Date(dateStr + "T00:00:00");
    const selectedDayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    
    // Match both old format (day names) and new format (date strings)
    return classes.filter((cls) => {
      const scheduledDays = cls.schedule?.days?.trim().toLowerCase() || "";
      const selectedDay = selectedDayOfWeek.toLowerCase();
      
      return (
        scheduledDays === selectedDay ||
        scheduledDays === dateStr ||
        cls.schedule?.days === dateStr
      );
    });
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

            {/* Schedule Date */}
            <div>
              <Label>Schedule Date</Label>
              <Input
                type="date"
                className="mt-1 cursor-pointer"
                {...register("scheduleDate", { required: "Schedule date is required" })}
              />
              {errors.scheduleDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.scheduleDate.message}
                </p>
              )}
            </div>

            {/* Schedule Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  className="mt-1"
                  {...register("startTime", { required: "Start time is required" })}
                />
                {errors.startTime && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  className="mt-1"
                  {...register("endTime", { required: "End time is required" })}
                />
                {errors.endTime && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
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
                            <div className="font-medium">
                              {formatDateWithDay(cls.schedule?.days)}
                            </div>
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

      {/* Date Details Modal */}
      <Dialog open={showDateDetailsModal} onOpenChange={setShowDateDetailsModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Classes on {selectedModalDate ? formatDateWithDay(selectedModalDate) : "Selected Date"}
            </DialogTitle>
            <DialogClose />
          </DialogHeader>

          {getClassesForDate(selectedModalDate).length > 0 ? (
            <div className="rounded-md border overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getClassesForDate(selectedModalDate).map((cls) => (
                    <TableRow key={cls._id}>
                      <TableCell className="font-medium capitalize">{cls.name}</TableCell>
                      <TableCell className="capitalize">{cls.subject}</TableCell>
                      <TableCell className="capitalize">{getTutorName(cls.tutorId)}</TableCell>
                      <TableCell>{cls.schedule?.time || "-"}</TableCell>
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
                          <span className="text-muted-foreground text-sm">No students</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            cls.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {cls.status === "completed" ? "Completed" : "Active"}
                        </span>
                      </TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No classes scheduled for this date
            </p>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deleteClassId)}
        onOpenChange={(open) => {
          if (!open) setDeleteClassId(null);
        }}
        title="Delete class?"
        description="This will permanently remove the class and cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}