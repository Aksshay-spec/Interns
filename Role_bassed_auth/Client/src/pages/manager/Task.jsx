import { useForm } from "react-hook-form";
import { useState } from "react";
import React from "react";

import { useGetTeams } from "@/hooks/manager/useGetTeams";
import { useAddTask } from "@/hooks/manager/useAddTask";
import { useGetTasks } from "@/hooks/manager/useGetTasks";
import { useReviewTask } from "@/hooks/manager/useReviewTask ";

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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import toast from "react-hot-toast";

/* ---------- ExpandableText ---------- */
function ExpandableText({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return <span className="text-muted-foreground text-xs">—</span>;

  return (
    <div
      style={{ wordBreak: "break-word", whiteSpace: "normal", width: "100%" }}
    >
      <p
        style={
          open
            ? { fontSize: "0.875rem", lineHeight: "1.5" }
            : {
                fontSize: "0.875rem",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {text}
      </p>
      {text.length > 90 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-indigo-600 text-xs hover:underline mt-1"
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

  const selectedTeamId = watch("teamId");
  const selectedStudents = watch("students") || [];

  const [open, setOpen] = useState(false);
  const [retaskOpen, setRetaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [remark, setRemark] = useState("");

  // FILTER STATES (IMPORTANT: no empty string for Select)
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const clearFilters = () => {
    setFilterTeam("all");
    setFilterStudent("");
    setFilterTitle("");
    setFilterStatus("all");
  };

  const selectedTeam = teams.find((t) => t._id === selectedTeamId);
  const students = selectedTeam?.teamMembers || [];

  const toggleStudent = (id, checked) => {
    if (checked) setValue("students", [...selectedStudents, id]);
    else
      setValue(
        "students",
        selectedStudents.filter((sId) => sId !== id),
      );
  };

  const onSubmit = (formData) => {
    addTask(formData, {
      onSuccess: () => {
        reset({ teamId: "", students: [], title: "", task: "" });
        toast.success("Task created successfully!");
      },
    });
  };

  return (
    <div>
      {/* CREATE TASK */}
      <div className="mb-6">
        <h1 className="text-lg sm:text-2xl font-semibold">Create Task</h1>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label className="mb-2">Select Team</Label>
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
                      {team.teamName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Select Students</Label>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedStudents.length > 0
                      ? `${selectedStudents.length} selected`
                      : "Select students"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto w-[var(--radix-dropdown-menu-trigger-width)]">
                  {students.map((student) => (
                    <DropdownMenuCheckboxItem
                      key={student._id}
                      checked={selectedStudents.includes(student._id)}
                      onCheckedChange={(checked) =>
                        toggleStudent(student._id, checked)
                      }
                    >
                      {student.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Label className="mb-2">Task Title</Label>
              <input
                className="w-full border rounded-md px-3 py-2"
                {...register("title", { required: true })}
              />
            </div>

            <div>
              <Label className="mb-2">Task Description</Label>
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

      {/* FILTER SECTION */}
      <Card className="mt-10 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Team Filter */}
            <div>
              <Label className="mb-2">Filter by Team</Label>
              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team._id} value={team.teamName}>
                      {team.teamName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student Filter */}
            <div> 
              <Label className="mb-2">Filter by Student</Label>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="Student name"
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
              />
            </div>

            {/* Title Filter */}
            <div>
              <Label className="mb-2">Filter by Title</Label>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="Task title"
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div >
              <Label className="mb-2">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incompleted">Incompleted</SelectItem>
                  <SelectItem value="retask">Retask</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Button (Now acts as 5th column) */}
            <div className="flex">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-71 5 md:w-full">
        {/* TABLE (FILTERED) */}
        <div className="overflow-x-auto rounded-lg border bg-background">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left text-sm">Team</th>
                <th className="px-3 py-2 text-left text-sm">Student</th>
                <th className="px-3 py-2 text-left text-sm">Title</th>
                <th className="px-3 py-2 text-left text-sm">Description</th>
                <th className="px-3 py-2 text-left text-sm">Message</th>
                <th className="px-3 py-2 text-left text-sm">Remark</th>
                <th className="px-3 py-2 text-left text-sm">Status</th>
                <th className="px-3 py-2 text-left text-sm">Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks
                .filter(
                  (task) =>
                    (filterTeam === "all" ||
                      task.team?.teamName === filterTeam) &&
                    (filterTitle === "" ||
                      task.title
                        .toLowerCase()
                        .includes(filterTitle.toLowerCase())),
                )
                .map((task) =>
                  task.assignedTo
                    ?.filter(
                      (studentTask) =>
                        (filterStudent === "" ||
                          studentTask.student.name
                            .toLowerCase()
                            .includes(filterStudent.toLowerCase())) &&
                        (filterStatus === "all" ||
                          studentTask.status === filterStatus),
                    )
                    .map((studentTask) => (
                      <tr key={`${task._id}-${studentTask.student._id}`}>
                        <td className="px-3 py-2">{task.team?.teamName}</td>
                        <td className="px-3 py-2">
                          {studentTask.student.name}
                        </td>
                        <td className="px-3 py-2">{task.title}</td>
                        <td className="px-3 py-2">
                          <ExpandableText text={task.description} />
                        </td>
                        <td className="px-3 py-2">
                          <ExpandableText text={studentTask.message} />
                        </td>
                        <td className="px-3 py-2">
                          <ExpandableText text={studentTask.remark} />
                        </td>
                        <td className="px-3 py-2 capitalize">
                          {studentTask.status}
                        </td>
                        <td className="px-3 py-2">
                          {(studentTask.status === "completed" ||
                            studentTask.status === "incompleted") && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="bg-green-600 text-white text-xs h-8"
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
                                className="text-xs h-8"
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
                        </td>
                      </tr>
                    )),
                )}
            </tbody>
          </table>
        </div>
      </div>
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
