import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import Loader from "@/components/common/Loader";

export default function Dashboard() {
  const { data, isLoading } = useAdminDashboard();
  // console.log("Dashboard data:", data);

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card >
        <CardHeader>
          <CardTitle>Managers</CardTitle>
        </CardHeader>
        <CardContent>{data.stats.managers}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>{data.stats.students}</CardContent>
      </Card>
    </div>
  );
}
