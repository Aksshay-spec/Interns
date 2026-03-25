import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMyClasses } from "@/hooks/tutor/useGetMyClasses";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function MyClasses() {
  const { data: classesData, isLoading } = useGetMyClasses();
  const classes = classesData?.classes || [];
  // console.log(classes)

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">My Classes</h1>
      </div>

      <Card>
        <CardContent className="p-6">
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
                    <TableHead>Students</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {classes.length > 0 ? (
                    classes.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell className="font-medium">
                          {cls.topic || "Class Session"}
                        </TableCell>
                        <TableCell>{cls.subjectId?.name || "-"}</TableCell>
                        <TableCell>{cls.batchId?.name || "-"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                {cls.batchId?.studentIds?.length > 0
                                  ? `${cls.batchId.studentIds.length} Students`
                                  : "No students"}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                              {cls.batchId?.studentIds?.length > 0 ? (
                                cls.batchId.studentIds.map((s) => (
                                  <DropdownMenuItem
                                    key={s._id}
                                    disabled
                                    className="text-sm"
                                  >
                                    {s.userId?.name || "Unknown"}
                                  </DropdownMenuItem>
                                ))
                              ) : (
                                <DropdownMenuItem disabled className="text-sm">
                                  No students
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{cls.date || "-"}</div>
                            <div className="text-muted-foreground">
                              {cls.startTime ? `${cls.startTime} (${cls.duration || 0} min)` : "-"}
                            </div>
                          </div>
                        </TableCell>
                         <TableCell>
                          {cls.videoLink ? (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() =>
                                window.open(cls.videoLink, "_blank")
                              }
                            >
                              Join
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </TableCell>
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
                            {cls.status === "completed"
                              ? "Completed"
                              : cls.status === "cancelled"
                                ? "Cancelled"
                                : "Scheduled"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm">
                        No classes assigned
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
