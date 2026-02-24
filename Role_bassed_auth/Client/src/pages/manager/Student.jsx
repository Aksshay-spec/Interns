import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useGetStudent } from "@/hooks/manager/useGetStudent";
import Loader from "@/components/common/Loader";
import { useParams } from "react-router-dom";

export default function Student() {

    const { sId } = useParams();
  const { data, isLoading } = useGetStudent(sId);
  // console.log("data fro ms",data)

  const profile = data?.student

  if (isLoading) return <Loader />;

  

  return (
    <div className="min-w-full  mt-8">
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
