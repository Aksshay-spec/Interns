import { useState } from "react";
import { useGetCompletedTasks } from "@/hooks/manager/useGetCompletedTasks";
import { useDeleteCompletedTask } from "@/hooks/manager/useDeleteCompletedTask";
import { useBulkDeleteCompletedTasks } from "@/hooks/manager/useBulkDeleteCompletedTasks";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function History() {
  const { data, isLoading } = useGetCompletedTasks();
  const { mutate: deleteTask } = useDeleteCompletedTask();
  const { mutate: bulkDelete } = useBulkDeleteCompletedTasks();

  const tasks = data?.completedTasks || [];

  const [range, setRange] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const serchedTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase();
    if (!term) return tasks;
    return (
      task.title?.toLowerCase().includes(term) ||
      task.student?.name?.toLowerCase().includes(term) ||
      task.team?.teamName?.toLowerCase().includes(term)
    );
  });

  /* ---------------- FILTER ---------------- */
  const filterTasks = (tasks, filter) => {
    if (filter === "all") return tasks;
    const now = new Date();

    return tasks.filter((task) => {
      if (!task.approvedAt) return false;
      const approvedDate = new Date(task.approvedAt);

      if (filter === "today")
        return approvedDate.toDateString() === now.toDateString();

      if (filter === "7d") {
        const last7 = new Date();
        last7.setDate(now.getDate() - 7);
        return approvedDate >= last7;
      }

      if (filter === "30d") {
        const last30 = new Date();
        last30.setDate(now.getDate() - 30);
        return approvedDate >= last30;
      }

      return true;
    });
  };

  const filteredTasks = filterTasks(serchedTasks, range);

  /* ---------------- BULK ---------------- */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm("Delete selected tasks?")) return;

    // console.log("Deleting tasks with IDs:", selectedIds);

    bulkDelete(selectedIds, {
      onSuccess: () => {
        toast.success("Selected tasks deleted successfully!");
      },
    });

    setSelectedIds([]);
    setBulkMode(false);
  };

  /* ---------------- OPEN POPUP ---------------- */
  const openTask = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  /* -------- GROUP HISTORY INTO ATTEMPTS -------- */
  const getConversationPairs = (history = []) => {
    const pairs = [];
    let current = {};

    history.forEach((item) => {
      if (item.sender === "student") {
        if (current.student || current.manager) {
          pairs.push(current);
          current = {};
        }
        current.student = item;
      } else if (item.sender === "manager") {
        current.manager = item;
        pairs.push(current);
        current = {};
      }
    });

    if (current.student || current.manager) pairs.push(current);

    return pairs;
  };

  const conversationPairs = getConversationPairs(selectedTask?.history);
  const retaskCount =
    selectedTask?.history?.filter((h) => h.sender === "manager").length || 0;

  return (
    <div className="w-71.5 md:w-full space-y-6 ">
      <h1 className="text-2xl font-semibold">Completed Tasks</h1>

      {/* FILTER */}
      <div className="flex  sm:flex-row flex-col gap-2">
        <div className="w-full">
          <Input
            placeholder="Search by team, student or title"
            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 sm:w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-full bg-white md:w-52">
            <SelectValue placeholder="Filter history" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* BULK BUTTONS */}

        {/* BULK BUTTONS */}
        <div className="flex items-center gap-2 flex-nowrap">
          {!bulkMode ? (
            <button
              onClick={() => setBulkMode(true)}
              className="px-4 w-full py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition whitespace-nowrap"
            >
              Bulk Delete
            </button>
          ) : (
            <>
              <button
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
              >
                Delete ({selectedIds.length})
              </button>

              <button
                onClick={() => {
                  setBulkMode(false);
                  setSelectedIds([]);
                }}
                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition whitespace-nowrap"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-lg border bg-background overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              {bulkMode && <TableHead></TableHead>}
              <TableHead>Team</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No completed tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow
                  key={task._id}
                  className="cursor-pointer hover:bg-muted/40 capitalize"
                  onClick={() => openTask(task)}
                >
                  {bulkMode && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(task._id)}
                        onChange={() => toggleSelect(task._id)}
                      />
                    </TableCell>
                  )}

                  <TableCell>{task.team?.teamName}</TableCell>
                  <TableCell>{task.student?.name}</TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    {new Date(task.approvedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this task?")) {
                          deleteTask(task._id, {
                            onSuccess: () => {
                              toast.success("Task deleted successfully!");
                            },
                          });
                        }
                      }}
                      className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG (UNCHANGED) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:min-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl break-words">
              Task Details
            </DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-5">
              <Card className="border bg-muted/20">
                <CardContent className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm capitalize">
                  <div className="sm:col-span-2 text-xl">
                    <p className="text-muted-foreground">Team</p>
                    <p className="font-medium capitalize">
                      {selectedTask.team?.teamName}
                    </p>
                  </div>
                  <div className="sm:col-span-2 text-lg">
                    <p className="text-muted-foreground">Task Title</p>
                    <p className="font-medium">{selectedTask.title}</p>
                  </div>
                  <div className="text-base">
                    <p className="text-muted-foreground">Student Name</p>
                    <p className="font-medium">{selectedTask.student?.name}</p>
                  </div>
                  <div className="text-base">
                    <p className="text-muted-foreground">Team Lead</p>
                    <p className="font-medium">
                      {selectedTask.createdBy?.name}
                    </p>
                  </div>
                  <div className="sm:col-span-2 text-base">
                    <p className="text-muted-foreground">Task Description</p>
                    <p className="font-medium whitespace-pre-wrap mt-1">
                      {selectedTask.description}
                    </p>
                  </div>
                  <div className="text-base">
                    <p className="text-muted-foreground">Retask Count</p>
                    <p className="font-medium">{retaskCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">
                      {selectedTask.submittedAt
                        ? new Date(selectedTask.submittedAt).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <div className="text-base">
                    <p className="text-muted-foreground">Approved</p>
                    <p className="font-medium">
                      {selectedTask.approvedAt
                        ? new Date(selectedTask.approvedAt).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-semibold text-base">Submission Attempts</h3>

                {conversationPairs.map((pair, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Attempt {i + 1}
                    </p>

                    {pair.student && (
                      <div className="flex justify-start">
                        <div className="w-full sm:max-w-[75%] rounded-xl border p-3 text-sm shadow-sm bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                          <p className="font-medium mb-1">Student Message</p>
                          <p className="whitespace-pre-wrap">
                            {pair.student.text}
                          </p>
                        </div>
                      </div>
                    )}

                    {pair.manager && (
                      <div className="flex justify-end">
                        <div className="w-full sm:max-w-[75%] rounded-xl border p-3 text-sm shadow-sm bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                          <p className="font-medium mb-1">Manager Remark</p>
                          <p className="whitespace-pre-wrap">
                            {pair.manager.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
