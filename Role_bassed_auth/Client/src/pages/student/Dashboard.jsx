import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useStudentDashboard } from "@/hooks/student/useStudentDashboard";
import Loader from "@/components/common/Loader";

export default function StudentDashboard() {
  const { data, isLoading } = useStudentDashboard();

  if (isLoading) return <Loader />;

  const { profile } = data;

  return (
    <div className="min-w-full mt-">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{capitalizeFirstLetter(profile.name)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">{capitalizeFirstLetter(profile.role)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
