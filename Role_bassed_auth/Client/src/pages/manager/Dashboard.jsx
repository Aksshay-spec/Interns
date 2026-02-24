import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManagerDashboard } from "@/hooks/manager/useManagerDashboard";
import Loader from "@/components/common/Loader";

export default function ManagerDashboard() {
  const { data, isLoading } = useManagerDashboard();
  console.log("data",data)

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {data.totalStudents}
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
}
