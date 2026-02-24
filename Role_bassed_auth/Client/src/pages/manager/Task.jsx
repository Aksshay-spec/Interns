import { useForm } from "react-hook-form";
import { useState } from "react";
import React from "react";
import { capitalizeFirstLetter } from "@/lib/utils";

import { useGetTeams } from "@/hooks/manager/useGetTeams";
import { useAddTask } from "@/hooks/manager/useAddTask";
import { useGetTasks } from "@/hooks/manager/useGetTasks";
import { useReviewTask } from "@/hooks/manager/useReviewTask";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

/* ---------- Expandable Text ---------- */
function ExpandableText({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return <span className="text-slate-400 text-xs">—</span>;

  return (
    <div className="max-w-xs">
      <p className={`text-sm break-words ${open ? "" : "line-clamp-2"}`}>
        {text}
      </p>
      {text.length > 80 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-indigo-600 text-xs hover:underline"
        >
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export default function Task() {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: { teamId: "", students: [], title: "", task: "" },
  });

  const { mutate: addTask } = useAddTask();
  const { mutate: reviewTask } = useReviewTask();
  const { data } = useGetTeams();
  const { data: taskData, isLoading: taskLoading } = useGetTasks();

  const teams = data?.teams || [];
  const tasks = taskData?.tasks || [];
  console.log("task ", tasks);

  const selectedTeamId = watch("teamId");
  const selectedStudents = watch("students") || [];

  const [open, setOpen] = useState(false);
  const [retaskOpen, setRetaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [remark, setRemark] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

  // Filter states
  const [filterTeam, setFilterTeam] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const selectedTeam = teams.find((t) => t._id === selectedTeamId);
  const students = selectedTeam?.teamMembers || [];

  const normalizedFilterTeam = filterTeam.trim() ? filterTeam : "";
  const normalizedFilterStudent = filterStudent.trim() ? filterStudent : "";
  const normalizedFilterStatus = filterStatus.trim() ? filterStatus : "";

  // Filter tasks based on filter criteria
  const filteredTasks = tasks.filter((task) => {
    // Check if task should be included based on team filter
    if (normalizedFilterTeam && task.team?._id !== normalizedFilterTeam) {
      return false;
    }

    // Check if task should be included based on title filter
    if (filterTitle && !task.title.toLowerCase().includes(filterTitle.toLowerCase())) {
      return false;
    }

    // For student and status filters, we need to check if ANY assignedTo entry matches
    if (normalizedFilterStudent || normalizedFilterStatus) {
      const hasMatchingStudent = task.assignedTo?.some((studentTask) => {
        const studentMatch =
          !normalizedFilterStudent ||
          studentTask.student?._id === normalizedFilterStudent;
        const statusMatch =
          !normalizedFilterStatus || studentTask.status === normalizedFilterStatus;
        return studentMatch && statusMatch;
      });

      if (!hasMatchingStudent) {
        return false;
      }
    }

    return true;
  });

  // Get unique students from all tasks for filter dropdown
  const allStudents = tasks.reduce((acc, task) => {
    if (normalizedFilterTeam && task.team?._id !== normalizedFilterTeam) {
      return acc;
    }

    task.assignedTo?.forEach((studentTask) => {
      if (studentTask.student && !acc.find((s) => s._id === studentTask.student._id)) {
        acc.push(studentTask.student);
      }
    });
    return acc;
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setFilterTeam("");
    setFilterStudent("");
    setFilterTitle("");
    setFilterStatus("");
  };

  const hasActiveFilters =
    normalizedFilterTeam ||
    normalizedFilterStudent ||
    filterTitle ||
    normalizedFilterStatus;

  const handleFilterTeamChange = (value) => {
    setFilterTeam(value);
    setFilterStudent("");
  };

  const toggleStudent = (id, checked) => {
    if (checked) {
      setValue("students", [...selectedStudents, id]);
    } else {
      setValue(
        "students",
        selectedStudents.filter((sId) => sId !== id),
      );
    }
  };

  const onSubmit = (formData) => {
    addTask(formData, {
      onSuccess: () => reset({ teamId: "", students: [], title: "", task: "" }),
    });
  };

  return (
    <div>
      {/* FORM */}
      <div className="mb-6">
        <h1 className="text-lg sm:text-2xl font-semibold">Create Task</h1>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label className="mb-1">Select Team</Label>
              <Select
                value={selectedTeamId || ""}
                onValueChange={(value) => {
                  setValue("teamId", value);
                  setValue("students", []);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {capitalizeFirstLetter(team.teamName)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1">Select Students</Label>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedStudents.length > 0
                      ? `${selectedStudents.length} selected`
                      : "Select students"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto w-56">
                  {students.map((student) => (
                    <DropdownMenuCheckboxItem
                      key={student._id}
                      checked={selectedStudents.includes(student._id)}
                      onCheckedChange={(checked) =>
                        toggleStudent(student._id, checked)
                      }
                    >
                      {capitalizeFirstLetter(student.name)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Label className="mb-1">Task Title</Label>
              <input
                className="w-full border rounded-md px-3 py-2"
                {...register("title", { required: true })}
              />
            </div>

            <div>
              <Label className="mb-1">Task Description</Label>
              <Textarea rows={4} {...register("task", { required: true })} />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" className="w-full sm:w-auto">
                Create Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* TABLE */}
      <div className="w-[286px] md:w-full mt-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Assigned Tasks
        </h2>

        {/* FILTERS */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4" />
                Filter Tasks
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Team Filter */}
              <div>
                <Label className="text-xs mb-1.5 block">Team</Label>
                <Select value={filterTeam} onValueChange={handleFilterTeamChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">All Teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.teamName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Student Filter */}
              <div>
                <Label className="text-xs mb-1.5 block">Student</Label>
                <Select value={filterStudent} onValueChange={setFilterStudent}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">All Students</SelectItem>
                    {allStudents.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {capitalizeFirstLetter(student.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title Filter */}
              <div>
                <Label className="text-xs mb-1.5 block">Title</Label>
                <Input
                  placeholder="Search by title..."
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                  className="h-9"
                />
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-xs mb-1.5 block">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="incompleted">Incompleted</SelectItem>
                    <SelectItem value="retask">Retask</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {taskLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-background">
            <Table>
              {/* HEADER */}
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">Team</TableHead>
                  <TableHead className="w-[140px]">Student</TableHead>
                  <TableHead className="w-[160px]">Title</TableHead>
                  <TableHead className="w-[260px]">Description</TableHead>
                  <TableHead className="w-[260px]">Message</TableHead>
                  <TableHead className="w-[260px]">Remark</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[160px]">Action</TableHead>
                </TableRow>
              </TableHeader>

              {/* BODY */}
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      {hasActiveFilters ? "No tasks match the selected filters" : "No assigned tasks yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) =>
                    task.assignedTo?.map((studentTask) => {
                    if (!studentTask?.student) return null;

                    return (
                      <TableRow
                        key={`${task._id}-${studentTask.student._id}`}
                        className="odd:bg-muted/20 hover:bg-muted/40"
                      >
                        <TableCell>{capitalizeFirstLetter(task.team?.teamName)}</TableCell>

                        <TableCell>{capitalizeFirstLetter(studentTask.student.name)}</TableCell>

                        <TableCell className="truncate max-w-[160px]">
                          {capitalizeFirstLetter(task.title)}
                        </TableCell>

                         {/* <TableCell className="space-y-2 max-w-[420px]">
                          
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Task
                            </p>
                            <ExpandableText text={task.description} />
                          </div>

                          
                          {studentTask.message && (
                            <div className="rounded-md border bg-blue-50/40 dark:bg-blue-950/20 p-2">
                              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                                Student Message
                              </p>
                              <ExpandableText text={studentTask.message} />
                            </div>
                          )}

                          
                          {studentTask.remark && (
                            <div className="rounded-md border bg-amber-50/50 dark:bg-amber-950/20 p-2">
                              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                                Manager Remark
                              </p>
                              <ExpandableText text={studentTask.remark} />
                            </div>
                          )}
                        </TableCell> */}

                        <TableCell>
                          <ExpandableText text={capitalizeFirstLetter(task.description)} />
                        </TableCell>

                        <TableCell>
                          {studentTask.message ? (
                            <ExpandableText text={capitalizeFirstLetter(studentTask.message)} />
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <ExpandableText text={studentTask.remark ? capitalizeFirstLetter(studentTask.remark) : ""} />
                        </TableCell>

                        <TableCell className="capitalize">
                          {capitalizeFirstLetter(studentTask.status)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {(studentTask.status === "completed" ||
                            studentTask.status === "incompleted") && (
                            <div className="flex flex-col sm:flex-row gap-1 sm:items-center">
                              <Button
                                size="sm"
                                className="text-xs h-8 shrink-0 cursor-pointer"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTaskDetail({ task, studentTask });
                                  setDetailOpen(true);
                                }}
                              >
                                View Detail
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 text-white text-xs h-8 shrink-0"
                                onClick={() =>
                                  reviewTask({
                                    taskId: task._id,
                                    studentId: studentTask.student._id,
                                    status: "approved",
                                  })
                                }
                              >
                                Approve
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs h-8 shrink-0"
                                onClick={() => {
                                  setSelectedTask({
                                    taskId: task._id,
                                    studentId: studentTask.student._id,
                                  });
                                  setRetaskOpen(true);
                                }}
                              >
                                Re-Task
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }),
                )
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* TASK DETAIL MODAL */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>

          {selectedTaskDetail && (
            <div className="space-y-4 py-4">
              {/* Team */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Team</p>
                <p className="text-base font-medium">
                  {capitalizeFirstLetter(selectedTaskDetail.task.team?.teamName)}
                </p>
              </div>

              {/* Task Title */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Task Title</p>
                <p className="text-base font-medium">
                  {capitalizeFirstLetter(selectedTaskDetail.task.title)}
                </p>
              </div>

              {/* Student Name and Team Lead */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs  text-muted-foreground mb-1">Student Name</p>
                  <p className="text-base font-medium">
                    {capitalizeFirstLetter(selectedTaskDetail.studentTask.student.name)}
                  </p>
                </div>
                <div>
                  <p className="text-xs  text-muted-foreground mb-1">Team Lead</p>
                  <p className="text-base font-medium">
                    {selectedTaskDetail.task.team?.teamLeader?.name ? capitalizeFirstLetter(selectedTaskDetail.task.team.teamLeader.name) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Task Description */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">Task Description</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 ">
                  {capitalizeFirstLetter(selectedTaskDetail.task.description)}
                </p>
              </div>

              {/* Retask Count */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">Retask Count</p>
                <p className="text-base font-medium">
                  {selectedTaskDetail.studentTask.conversation?.filter(
                    (c) => c.sender === "manager"
                  ).length || 0}
                </p>
              </div>

              {/* Submitted */}
              {selectedTaskDetail.studentTask.submittedAt && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Submitted</p>
                  <p className="text-base font-medium">
                    {new Date(
                      selectedTaskDetail.studentTask.submittedAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {/* Approved */}
              {selectedTaskDetail.studentTask.approvedAt && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Approved</p>
                  <p className="text-base font-medium">
                    {new Date(
                      selectedTaskDetail.studentTask.approvedAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {/* Submission Attempts */}
              {selectedTaskDetail.studentTask.conversation && selectedTaskDetail.studentTask.conversation.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Submission Attempts</p>
                  <div className="space-y-2">
                    {selectedTaskDetail.studentTask.conversation.map((conv, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium">
                          Attempt {idx + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Message */}
              {selectedTaskDetail.studentTask.message && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Student Message</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {capitalizeFirstLetter(selectedTaskDetail.studentTask.message)}
                  </p>
                </div>
              )}

              {/* Manager Remark */}
              {selectedTaskDetail.studentTask.remark && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Manager Remark</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {capitalizeFirstLetter(selectedTaskDetail.studentTask.remark)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setDetailOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* RETASK DIALOG */}
      <Dialog open={retaskOpen} onOpenChange={setRetaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Re-Task Remark</DialogTitle>
          </DialogHeader>

          <Textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setRetaskOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                reviewTask({
                  taskId: selectedTask.taskId,
                  studentId: selectedTask.studentId,
                  status: "retask",
                  remark,
                });
                setRetaskOpen(false);
                setRemark("");
              }}
            >
              Send Re-Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
