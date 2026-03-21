import { useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useCreateClass } from "@/hooks/tenant/useCreateClass";
import { useGetClasses } from "@/hooks/tenant/useGetClasses";
import { useDeleteClass } from "@/hooks/tenant/useDeleteClass";
import { useUpdateClass } from "@/hooks/tenant/useUpdateClass";
import { useGetTutors } from "@/hooks/tenant/useGetTutors";
import { useGetSubjects } from "@/hooks/tenant/useGetSubjects";
import { useGetBatches } from "@/hooks/tenant/useGetBatches";

import { useCreateMeet } from "@/hooks/tenant/useCreateMeet";

import { formatDateWithDay } from "@/utils/classUtils";
import { toast } from "sonner";

export default function ManageClasses() {
  const { mutateAsync: createClass, isPending: isCreating } = useCreateClass();
  const { mutateAsync: updateClass, isPending: isUpdating } = useUpdateClass();
  const { data: classesData, isLoading } = useGetClasses();
  const { mutate: deleteClass, isPending: isDeleting } = useDeleteClass();

  const { data: tutorsData } = useGetTutors();
  const { data: subjectsData } = useGetSubjects();
  const { data: batchesData } = useGetBatches();

  const { mutateAsync: createMeet, isPending: isGeneratingMeet } = useCreateMeet();

  const [editingClass, setEditingClass] = useState(null);
  const [deleteClassId, setDeleteClassId] = useState(null);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedVideoProvider, setSelectedVideoProvider] = useState("manual");
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [selectedReminderTime, setSelectedReminderTime] = useState("0");
  const [videoLink, setVideoLink] = useState("");

  const isEditMode = Boolean(editingClass);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const classes = classesData?.classes || [];
  const tutors = tutorsData?.tutors || [];
  const subjects = subjectsData?.subjects || [];
  const batches = batchesData?.batches || [];

  const activeSubjects = subjects.filter((subject) => subject.status === "active");

  const filteredBatches = batches.filter((batch) => {
    if (batch.status !== "active") return false;
    if (!selectedSubjectId) return true;
    return batch.subjectId?._id === selectedSubjectId;
  });

  const syncTeacherFromBatch = (batchId) => {
    const selectedBatch = batches.find((batch) => batch._id === batchId);
    if (!selectedBatch?.teacherId?._id) return;
    const teacherId = selectedBatch.teacherId._id;
    setSelectedTeacherId(teacherId);
    setValue("teacherId", teacherId, { shouldValidate: true });
  };

  const handleGenerateMeet = async () => {
    const date = getValues("date");
    const startTime = getValues("startTime");
    const duration = Number(getValues("duration") || 0);

    if (!date || !startTime || duration <= 0) {
      toast.error("Select date, start time and duration first");
      return;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const endDateTime = new Date(`${date}T${startTime}:00`);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);

    const endHour = String(endDateTime.getHours()).padStart(2, "0");
    const endMinute = String(endDateTime.getMinutes()).padStart(2, "0");
    const endTime = `${endHour}:${endMinute}`;

    try {
      const res = await createMeet({
        date,
        startTime: `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
        endTime,
      });

      if (res?.success) {
        setVideoLink(res.meetLink || "");
        setSelectedVideoProvider("gmeet");
        toast.success("Meet link generated!");
      } else {
        toast.error("Failed to generate meet");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const resetFormState = () => {
    setEditingClass(null);
    setSelectedSubjectId("");
    setSelectedBatchId("");
    setSelectedTeacherId("");
    setSelectedVideoProvider("manual");
    setSelectedPrivacy("");
    setSelectedReminderTime("0");
    setVideoLink("");
    reset();
  };

  const onSubmit = async (data) => {
    if (!selectedSubjectId || !selectedBatchId || !selectedTeacherId) {
      toast.error("Please select subject and batch");
      return;
    }

    const payload = {
      topic: data.topic,
      subjectId: selectedSubjectId,
      batchId: selectedBatchId,
      teacherId: selectedTeacherId,
      date: data.date,
      startTime: data.startTime,
      duration: Number(data.duration),
      videoProvider: selectedVideoProvider,
      videoLink,
      privacy: selectedPrivacy || undefined,
      reminderTime: Number(selectedReminderTime),
    };

    if (isEditMode) {
      payload.status = editingClass.status;
      const res = await updateClass({
        classId: editingClass._id,
        data: payload,
      });
      if (res) {
        toast.success("Class updated successfully!");
        resetFormState();
      }
      return;
    }

    const res = await createClass(payload);
    if (res) {
      toast.success("Class created successfully!");
      resetFormState();
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setValue("topic", cls.topic || "");
    setValue("date", cls.date || "");
    setValue("startTime", cls.startTime || "");
    setValue("duration", cls.duration || 60);

    setSelectedSubjectId(cls.subjectId?._id || "");
    setSelectedBatchId(cls.batchId?._id || "");
    setSelectedTeacherId(cls.teacherId?._id || "");
    setSelectedVideoProvider(cls.videoProvider || "manual");
    setSelectedPrivacy(cls.privacy || "");
    setSelectedReminderTime(String(cls.reminderTime ?? 0));
    setVideoLink(cls.videoLink || "");
  };

  const handleStatusChange = async (cls, newStatus) => {
    const res = await updateClass({
      classId: cls._id,
      data: { status: newStatus },
    });

    if (res) {
      toast.success(`Class marked as ${newStatus}!`);
    }
  };

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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Manage Classes</h1>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Topic</Label>
              <Input
                placeholder="e.g. Algebra fundamentals"
                className="mt-1"
                {...register("topic")}
              />
            </div>

            <div>
              <Label>Subject</Label>
              <Select
                value={selectedSubjectId}
                onValueChange={(value) => {
                  setSelectedSubjectId(value);
                  setSelectedBatchId("");
                  setSelectedTeacherId("");
                }}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {activeSubjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Batch</Label>
              <Select
                value={selectedBatchId}
                onValueChange={(value) => {
                  setSelectedBatchId(value);
                  syncTeacherFromBatch(value);
                }}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBatches.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Teacher</Label>
              <Input
                className="mt-1"
                readOnly
                value={
                  tutors.find((tutor) => tutor.tutorId === selectedTeacherId)?.name ||
                  "Auto-selected from batch"
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  className="mt-1"
                  {...register("startTime", { required: "Start time is required" })}
                />
                {errors.startTime && (
                  <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  min="1"
                  className="mt-1"
                  {...register("duration", {
                    required: "Duration is required",
                    min: { value: 1, message: "Duration must be at least 1 minute" },
                  })}
                />
                {errors.duration && (
                  <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Video Provider</Label>
              <Select value={selectedVideoProvider} onValueChange={setSelectedVideoProvider}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="gmeet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedVideoProvider === "gmeet" && (
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleGenerateMeet}
                  disabled={isGeneratingMeet}
                  className="w-full md:w-40"
                >
                  {isGeneratingMeet ? "Generating..." : "Generate Meet Link"}
                </Button>
                {videoLink && <Input value={videoLink} readOnly />}
              </div>
            )}

            {selectedVideoProvider !== "gmeet" && (
              <div>
                <Label>Video Link</Label>
                <Input
                  className="mt-1"
                  placeholder="Paste class link"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
              </div>
            )}

            {selectedVideoProvider === "youtube" && (
              <div>
                <Label>Privacy</Label>
                <Select value={selectedPrivacy || "public"} onValueChange={setSelectedPrivacy}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select privacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Reminder</Label>
              <Select value={selectedReminderTime} onValueChange={setSelectedReminderTime}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No reminder</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">60 minutes before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row justify-center md:justify-end gap-2 pt-4 border-t">
              {isEditMode && (
                <Button type="button" variant="outline" onClick={resetFormState} className="w-full md:w-35">
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
                    <TableHead>Topic</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Toggle Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {classes.length > 0 ? (
                    classes.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell>{cls.topic || "Class Session"}</TableCell>
                        <TableCell>{cls.subjectId?.name || "-"}</TableCell>
                        <TableCell>{cls.batchId?.name || "-"}</TableCell>
                        <TableCell>{cls.teacherId?.userId?.name || "-"}</TableCell>
                        <TableCell>{formatDateWithDay(cls.date)}</TableCell>
                        <TableCell>{cls.startTime || "-"}</TableCell>
                        <TableCell>{cls.duration ? `${cls.duration} min` : "-"}</TableCell>
                        <TableCell>{cls.videoProvider || "manual"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              cls.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : cls.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {cls.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant={
                                  cls.status === "completed"
                                    ? "secondary"
                                    : cls.status === "cancelled"
                                      ? "destructive"
                                      : "default"
                                }
                                disabled={isUpdating}
                                className="text-xs"
                              >
                                {cls.status}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(cls, "scheduled")}>
                                Scheduled
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(cls, "completed")}>
                                Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(cls, "cancelled")}>
                                Cancelled
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(cls)}>
                                Edit
                              </DropdownMenuItem>
                              {cls.videoLink && (
                                <DropdownMenuItem onClick={() => window.open(cls.videoLink, "_blank")}>
                                  Open Link
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(cls._id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-sm">
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

      <ConfirmActionDialog
        open={Boolean(deleteClassId)}
        onOpenChange={(open) => {
          if (!open) setDeleteClassId(null);
        }}
        title="Delete class?"
        description="This will permanently remove the class."
        confirmText="Delete"
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}
