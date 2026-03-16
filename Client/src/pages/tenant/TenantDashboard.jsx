import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGetClasses } from "@/hooks/tenant/useGetClasses";

import { Calendar } from "@/components/ui/calendar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatDateWithDay } from "@/utils/classUtils";

const TenantDashboard = () => {
  const { user } = useAuth();
  const { data: classesData } = useGetClasses();

  const classes = classesData?.classes || [];

  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-CA")
    : null;

  const classesForDate = classes.filter(
    (cls) => cls.schedule?.days === formattedDate,
  );

  // Normalize dates so comparisons only use day/month/year (ignore time)
  const normalizeDate = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const today = normalizeDate(new Date());
  const selectedDay = selectedDate ? normalizeDate(selectedDate) : null;

  const isSelectedDate = (date) => {
    if (!selectedDay) return false;
    return normalizeDate(date).getTime() === selectedDay.getTime();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold capitalize">Welcome, {user?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>

          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              onSelect={(date) => {
                if (!date) return;
                setSelectedDate(date);
                setOpenDialog(true);
              }}
              modifiers={{
                todayDefault: (date) =>
                  normalizeDate(date).getTime() === today.getTime(),
                selectedPast: (date) =>
                  isSelectedDate(date) && normalizeDate(date) < today,
                selectedFuture: (date) =>
                  isSelectedDate(date) && normalizeDate(date) > today,
              }}
              modifiersClassNames={{
                todayDefault:
                  "bg-green-600 text-white rounded-md hover:bg-green-700 hover:text-white",
                selectedPast:
                  "bg-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-300",
                selectedFuture:
                  "bg-yellow-300 text-yellow-950 rounded-md hover:bg-yellow-400",
              }}
            />
          </CardContent>
        </Card>

        {/* All Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
          </CardHeader>

          <CardContent>
            {classes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Schedule</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell className="capitalize">{cls.name}</TableCell>

                        <TableCell className="capitalize">
                          {cls.subject}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No classes found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for selected date */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Classes on {formatDateWithDay(formattedDate)}
            </DialogTitle>
          </DialogHeader>

          {classesForDate.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {classesForDate.map((cls) => (
                    <TableRow key={cls._id}>
                      <TableCell className="capitalize">{cls.name}</TableCell>

                      <TableCell className="capitalize">
                        {cls.subject}
                      </TableCell>

                      <TableCell>{cls.schedule?.time || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              No classes scheduled for this date
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantDashboard;
