import { usePendingTenants } from "@/hooks/admin/usePendingTenants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { CheckCircle, XCircle, Ban, Clock } from "lucide-react";

export default function PendingRequests() {
  const {
    tenants,
    isLoading,
    isError,
    handleApprove,
    handleReject,
    handleBlock,
    isActionLoading,
  } = usePendingTenants();

  console.log(tenants);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-500">Failed to load pending requests</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Pending Requests
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Review and manage tenant registration requests
        </p>
      </div>

      {tenants.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Clock className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending requests
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              All tenant registration requests have been processed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tenants.map((tenant) => (
            <Card key={tenant._id}>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-lg">{tenant.name}</span>
                  <span
                    className={`text-xs sm:text-sm font-normal px-3 py-1 rounded-full w-fit ${
                      tenant.status === "inactive"
                        ? "bg-yellow-100 text-yellow-800"
                        : tenant.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  
                  {/* Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Owner Name</p>
                      <p className="font-medium break-words">
                        {tenant.ownerUserId?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium break-words">
                        {tenant.ownerUserId?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Plan</p>
                      <p className="font-medium capitalize">
                        {tenant.plan}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Requested On</p>
                      <p className="font-medium">
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Responsive Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(tenant._id)}
                      disabled={isActionLoading}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </Button>

                    <Button
                      onClick={() => handleReject(tenant._id)}
                      disabled={isActionLoading}
                      variant="outline"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <XCircle size={16} />
                      Reject
                    </Button>

                    <Button
                      onClick={() => handleBlock(tenant._id)}
                      disabled={isActionLoading}
                      variant="destructive"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Ban size={16} />
                      Block
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}