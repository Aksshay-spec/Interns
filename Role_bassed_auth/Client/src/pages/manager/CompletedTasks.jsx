import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useGetCompletedTasks } from "@/hooks/manager/useGetCompletedTasks";
import { useDeleteCompletedTask } from "@/hooks/manager/useDeleteCompletedTask";
import { useBulkDeleteCompletedTasks } from "@/hooks/manager/useBulkDeleteCompletedTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Search, Trash2, ListChecks, X } from "lucide-react";

/* ---------- Expandable Text ---------- */
function ExpandableText({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return <span className="text-slate-400 text-xs">—</span>;

  return (
    <div className="max-w-xs">
      <p className={`text-sm wrap-break-word ${open ? "" : "line-clamp-2"}`}>
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

/* ---------- Format Date ---------- */
function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CompletedTasks() {
  const { data, isLoading } = useGetCompletedTasks();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteCompletedTask();
  const { mutate: bulkDeleteTasks, isPending: isBulkDeleting } = useBulkDeleteCompletedTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // console.log(data)

  if (isLoading) return <Loader />;

  const completedTasks = data?.completedTasks || [];

  // Filter tasks based on search term
  const filteredTasks = completedTasks.filter((task) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.student?.name.toLowerCase().includes(searchLower) ||
      task.team?.teamName.toLowerCase().includes(searchLower)
    );
  });

  // Handle single task delete
  const handleDeleteTask = (e, taskId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedTaskIds.length === 0) {
      alert("Please select at least one task to delete");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedTaskIds.length} task(s)?`)) {
      bulkDeleteTasks(selectedTaskIds, {
        onSuccess: () => {
          setSelectedTaskIds([]);
          setBulkDeleteMode(false);
        },
      });
    }
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((task) => task._id));
    }
  };

  // Toggle bulk delete mode
  const toggleBulkDeleteMode = () => {
    setBulkDeleteMode(!bulkDeleteMode);
    setSelectedTaskIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-slate-900">Completed Tasks</h1>
          {/* <p className="text-slate-600 mt-1">
            Tasks approved and marked as completed
          </p> */}
        </div>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-bold text-indigo-600">
            {completedTasks.length}
          </div>
          {/*   <p className="text-slate-600 text-sm">Total Completed</p> */}
        </div>
      </div>

      {/* Search Bar and Actions */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Search by task name, student, or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {!bulkDeleteMode ? (
                <Button
                  onClick={toggleBulkDeleteMode}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={completedTasks.length === 0}
                >
                  <ListChecks className="w-4 h-4" />
                  Bulk Delete
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleBulkDelete}
                    variant="destructive"
                    className="flex items-center gap-2"
                    disabled={selectedTaskIds.length === 0 || isBulkDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedTaskIds.length})
                  </Button>
                  <Button
                    onClick={toggleBulkDeleteMode}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card className="w-71.5 md:w-full">
        <CardHeader>
          <CardTitle>Task History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                {completedTasks.length === 0
                  ? "No completed tasks yet"
                  : "No tasks match your search"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    {bulkDeleteMode && (
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </TableHead>
                    )}
                    <TableHead className="font-semibold text-slate-700">
                      Task Title
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Student
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Team
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Description
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Approved Date
                    </TableHead>
                    {!bulkDeleteMode && (
                      <TableHead className="font-semibold text-slate-700 text-center">
                        Action
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task, index) => (
                    <TableRow
                      key={task._id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} ${!bulkDeleteMode ? "cursor-pointer" : ""} hover:bg-slate-100`}
                      onClick={() => {
                        if (!bulkDeleteMode) {
                          setSelectedTask(task);
                          setDialogOpen(true);
                        }
                      }}
                    >
                      {bulkDeleteMode && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedTaskIds.includes(task._id)}
                            onChange={() => handleCheckboxToggle(task._id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          {capitalizeFirstLetter(task.title)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">
                            {task.student?.name ? capitalizeFirstLetter(task.student.name) : "—"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {task.student?.email || "—"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {task.team?.teamName ? capitalizeFirstLetter(task.team.teamName) : "—"}
                      </TableCell>
                      <TableCell>
                        <ExpandableText text={capitalizeFirstLetter(task.description)} />
                      </TableCell>
                      <TableCell className="text-slate-700">
                        <div className="text-sm">
                          {formatDate(task.approvedAt)}
                        </div>
                      </TableCell>
                      {!bulkDeleteMode && (
                        <TableCell className="text-center">
                          <Button
                            onClick={(e) => handleDeleteTask(e, task._id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:min-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task details</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <Card className="bg-slate-50 border border-slate-200">

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">


                    <div className="col-span-2 text-xl">
                      <p className=" text-slate-500 font-medium uppercase">
                        Team 
                      </p>
                      <p className=" text-slate-900 mt-1">
                        {selectedTask.team?.teamName ? capitalizeFirstLetter(selectedTask.team.teamName) : "—"}
                      </p>
                    </div>

                    <div className="col-span-2 text-lg">
                      <p className=" text-slate-500 font-medium uppercase">
                        Task Title 
                      </p>
                      <p className="font-medium text-slate-900 mt-1 capitalize">
                        {selectedTask.title}
                      </p>
                    </div>


                    <div>
                      <p className=" text-slate-500 font-medium uppercase text-base">
                        Student Name 
                      </p>
                      <p className=" text-slate-900 mt-1">
                        {selectedTask.student?.name ? capitalizeFirstLetter(selectedTask.student.name) : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-base text-slate-500 font-medium uppercase">
                        Team Lead 
                      </p>
                      <p className=" text-slate-900 mt-1">
                        {selectedTask.createdBy?.name ? capitalizeFirstLetter(selectedTask.createdBy.name) : "—"}
                      </p>
                    </div>

                    <div className="text-base col-span-2">
                    <p className=" text-slate-500 font-medium uppercase ">
                      Task Description 
                    </p>
                    <p className=" text-slate-900 mt-1 capitalize">
                      {selectedTask.description || "—"}
                    </p>
                  </div>

                    <div>
                      <p className="text-base text-slate-500 font-medium uppercase">
                        Retask Count 
                      </p>
                      <p className=" text-slate-900 mt-1">
                        {selectedTask.conversation.filter((item) => item.sender == 'manager').length || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-base text-slate-500 font-medium uppercase">
                        Approved Time
                      </p>
                      <p className=" text-slate-900 mt-1">
                        {formatDateTime(selectedTask.approvedAt)}
                      </p>
                    </div>
                  </div>

                  
                </CardContent>
              </Card>


              <div>
                <p className="text-sm font-medium text-slate-700">
                  Conversation
                </p>
                {selectedTask.conversation.length === 0 ? (
                  <p className="text-sm text-slate-500">No messages yet.</p>
                ) : (
                  <div className="w-full space-y-3 mt-2">
                    {(() => {
                      let studentCount = 0;
                      let managerCount = 0;
                      const ordinalNumbers = [
                        "first", "second", "third", "fourth", "fifth",
                        "sixth", "seventh", "eighth", "ninth", "tenth"
                      ];

                      return selectedTask.conversation.map((entry, idx) => {
                        const isStudent = entry.sender === "student";
                        let label;

                        if (isStudent) {
                          label = ordinalNumbers[studentCount]
                            ? `${ordinalNumbers[studentCount]} complete`
                            : `${studentCount + 1}th complete`;
                          studentCount++;
                        } else {
                          label = ordinalNumbers[managerCount]
                            ? `${ordinalNumbers[managerCount]} remark`
                            : `${managerCount + 1}th remark`;
                          managerCount++;
                        }

                        return (
                          <div
                            key={`${entry.sender}-${idx}`}
                            className={
                              isStudent
                                ? "flex justify-start"
                                : "flex justify-end"
                            }
                          >
                            <div
                              className={
                                isStudent
                                  ? "max-w-xs rounded-lg bg-blue-50/60 border border-blue-200 p-3"
                                  : "max-w-xs rounded-lg bg-amber-50/60 border border-amber-200 p-3"
                              }
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p
                                  className={
                                    isStudent
                                      ? "text-xs font-medium text-blue-700 capitalize"
                                      : "text-xs font-medium text-amber-700 capitalize"
                                  }
                                >
                                  {label}
                                </p>
                                <p className="text-xs text-slate-500 ml-2">
                                  {formatDateTime(entry.createdAt)}
                                </p>
                              </div>
                              <div className="text-sm text-slate-700">
                                <ExpandableText text={capitalizeFirstLetter(entry.text)} />
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
