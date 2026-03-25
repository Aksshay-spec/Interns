import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyClasses } from "@/hooks/tutor/useGetMyClasses";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TutorDashboard = () => {
  const { user } = useAuth();
  const { data: classesData, isLoading } = useGetMyClasses();
  const classes = classesData?.classes || [];

  // Filter and sort classes by upcoming dates
  const upcomingClasses = classes
    .filter((cls) => {
      if (!cls.date) return false;
      const classDate = new Date(cls.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return classDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Your tutor dashboard is ready
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Upcoming Classes
          </CardTitle>
        </CardHeader>

        <CardContent>
          {upcomingClasses.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No upcoming classes
            </div>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {upcomingClasses.map((cls) => (
                    <TableRow key={cls._id}>
                      <TableCell className="font-medium">
                        {cls.topic || "Class Session"}
                      </TableCell>
                      <TableCell>{cls.subjectId?.name || "-"}</TableCell>
                      <TableCell>{cls.batchId?.name || "-"}</TableCell>
                      <TableCell className="text-sm">
                        {cls.batchId?.studentIds?.length || 0} students
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{cls.date || "-"}</div>
                          <div className="text-muted-foreground">
                            {cls.startTime
                              ? `${cls.startTime} (${cls.duration || 0} min)`
                              : "-"}
                          </div>
                        </div>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorDashboard;
