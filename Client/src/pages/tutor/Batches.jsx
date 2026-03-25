import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Batches() {
  const { data: batchesData, isLoading } = useGetMyBatches();
  const batches = batchesData?.batches || [];

  if (isLoading) return <Loader />;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">My Batches</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          {batches.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No batches assigned
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Students Count</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch._id}>
                      <TableCell className="font-medium capitalize">
                        {batch.name}
                      </TableCell>

                      <TableCell>{batch.subjectId?.name || "-"}</TableCell>

                      <TableCell className="text-left">
                        {batch.studentIds?.length || 0}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            batch.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {batch.status === "completed"
                            ? "Completed"
                            : "Active"}
                        </span>
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
}
