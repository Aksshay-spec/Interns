import { useNavigate } from "react-router-dom";
import { useGetStudentTasks } from "@/hooks/student/useGetStudentTasks";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Tasks() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentTasks();

  const tasks = data?.tasks || [];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-71.5 md:w-full space-y-6">
      <h1 className="text-2xl font-semibold">My Tasks</h1>

      <div className="rounded-lg border bg-background overflow-x-auto">
        <Table className="min-w-[800px]">

          {/* HEADER */}
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[140px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="capitalize">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                // get this student's entry safely
                const entry =
                  task.assignedTo?.find((s) => s?.student?._id) ||
                  task.assignedTo?.[0];

                const status = entry?.status || "pending";

                return (
                  <TableRow
                    key={task._id}
                    className="odd:bg-muted/20 hover:bg-muted/40"
                  >
                    <TableCell>{task.team?.teamName}</TableCell>

                    <TableCell className="font-medium">
                      {task.title}
                    </TableCell>

                    <TableCell className="max-w-[260px] whitespace-normal break-words">
                      {task.description}
                    </TableCell>

                    <TableCell className="max-w-[220px] whitespace-normal break-words">
                      {entry?.remark ? (
                        entry.remark
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          No remark yet
                        </span>
                      )}
                    </TableCell>

                    {/* SIMPLE STATUS BADGE */}
                    <TableCell className="capitalize">
                      <Badge variant="outline" className="font-normal">
                        {status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/student/task/${task._id}`)}
                      >
                        View Task
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-6"
                >
                  No tasks assigned yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}
