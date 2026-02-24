import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useGetStudentTasks } from "@/hooks/student/useGetStudentTasks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Tasks() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentTasks();

  const tasks = data?.tasks || [];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">My Tasks</h1>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block border rounded-lg bg-white">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="px-4 py-3">Team</TableHead>
              <TableHead className="px-4 py-3">Title</TableHead>
              <TableHead className="px-4 py-3">Description</TableHead>
              <TableHead className="px-4 py-3">Remark</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((task) => {
              // find current student's entry inside task
              const myEntry = task.assignedTo?.find(
                (s) => s.student === undefined || s.student === null
                  ? false
                  : (s.student._id || s.student).toString() !== "" // fallback safety
              );

              // better safe search
              const entry =
                task.assignedTo?.find((s) => s?.student?._id) ||
                task.assignedTo?.[0];

              const status = entry?.status || "pending";

              return (
                <TableRow key={task._id}>
                  <TableCell className="px-4 py-3">{capitalizeFirstLetter(task.team?.teamName)}</TableCell>
                  <TableCell className="px-4 py-3">{capitalizeFirstLetter(task.title)}</TableCell>
                  <TableCell className="px-4 py-3">{capitalizeFirstLetter(task.description)}</TableCell>
                  <TableCell className="px-4 py-3">{entry?.remark ? capitalizeFirstLetter(entry.remark) : "No remark yet"}</TableCell>

                  <TableCell className="px-4 py-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        status === "approved"
                          ? "bg-green-100 text-green-700"
                          : status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : status === "incompleted"
                          ? "bg-orange-100 text-orange-700"
                          : status === "retask"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {capitalizeFirstLetter(status)}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/student/task/${task._id}`)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      View Task
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {tasks.length === 0 && (
          <div className="p-6 text-center text-slate-500 text-sm">
            No tasks assigned yet
          </div>
        )}
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-4">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm bg-white border rounded-lg">
            No tasks assigned yet
          </div>
        ) : (
          tasks.map((task) => {
            const entry =
              task.assignedTo?.find((s) => s?.student?._id) ||
              task.assignedTo?.[0];
            const status = entry?.status || "pending";

            return (
              <div
                key={task._id}
                className="bg-white border rounded-lg p-4 space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-slate-800">
                      {capitalizeFirstLetter(task.title)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Team: {capitalizeFirstLetter(task.team?.teamName)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium capitalize whitespace-nowrap
                    ${
                      status === "approved"
                        ? "bg-green-100 text-green-700"
                        : status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : status === "incompleted"
                        ? "bg-orange-100 text-orange-700"
                        : status === "retask"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {capitalizeFirstLetter(status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Description:</span>
                    <p className="text-slate-600 mt-1">{task.description}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-slate-700">Remark:</span>
                    <p className="text-slate-600 mt-1">
                      {entry?.remark || "No remark yet"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/student/task/${task._id}`)}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                >
                  View Task
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
