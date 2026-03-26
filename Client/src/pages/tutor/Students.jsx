import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMyBatches } from "@/hooks/tutor/useGetMyBatches";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Students() {
  const { data: batchesData, isLoading } = useGetMyBatches();
  const batches = batchesData?.batches || [];

  const ALL_VALUE = "__all";

  const [filters, setFilters] = useState({
    studentName: "",
    batch: ALL_VALUE,
  });

  // Extract all students from batches
  const allStudents = [];
  batches.forEach(batch => {
    if (batch.studentIds && batch.studentIds.length > 0) {
      batch.studentIds.forEach(student => {
        allStudents.push({
          ...student,
          batchName: batch.name,
          batchId: batch._id,
          subjectName: batch.subjectId?.name || "-",
        });
      });
    }
  });

  // Get unique batch names
  const uniqueBatches = [...new Set(batches.map(batch => batch.name).filter(Boolean))];

  // Filter students based on current filters
  const filteredStudents = allStudents.filter(student => {
    const matchesName = !filters.studentName || 
      (student.userId?.name || "").toLowerCase().includes(filters.studentName.toLowerCase());
    const matchesBatch = filters.batch === ALL_VALUE || student.batchName === filters.batch;

    return matchesName && matchesBatch;
  });

  // Reset filters
  const resetFilters = () => {
    setFilters({
      studentName: "",
      batch: ALL_VALUE,
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Students</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          {allStudents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No students in your batches
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="text-sm"
                  >
                    Reset Filters
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Name Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="student-name-filter" className="text-sm font-medium">
                      Student Name
                    </Label>
                    <Input
                      id="student-name-filter"
                      placeholder="Search by student name..."
                      value={filters.studentName}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, studentName: e.target.value }))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Batch Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="batch-filter" className="text-sm font-medium">
                      Batch
                    </Label>
                    <Select
                      value={filters.batch}
                      onValueChange={(value) =>
                        setFilters(prev => ({ ...prev, batch: value }))
                      }
                    >
                      <SelectTrigger id="batch-filter" className="w-full">
                        <SelectValue placeholder="All batches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_VALUE}>All batches</SelectItem>
                        {uniqueBatches.map(batch => (
                          <SelectItem key={batch} value={batch}>
                            {batch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Subject</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium capitalize">
                            {student.userId?.name || "-"}
                          </TableCell>
                          <TableCell>{student.userId?.email || "-"}</TableCell>
                          <TableCell>{student.batchName}</TableCell>
                          <TableCell>{student.subjectName}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-sm">
                          {allStudents.length === 0 ? "No students in your batches" : "No students match the current filters"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
