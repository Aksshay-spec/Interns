import { useState } from "react";
import { usePendingTenants } from "@/hooks/admin/usePendingTenants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PendingRequests() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    tenants,
    totalPages,
    isLoading,
    isError,
    handleApprove,
    handleBlock,
    handleInactive,
    isActionLoading,
  } = usePendingTenants(currentPage);
  

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-500">Failed to load tenants</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Tenants
          </CardTitle>
        </CardHeader>

        <CardContent>
          {tenants.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No Tenants
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tuition Name</TableHead>
                      <TableHead>Owner Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant._id}>
                        <TableCell className="font-medium capitalize">
                          {tenant.name}
                        </TableCell>

                        <TableCell className="capitalize">
                          {tenant.ownerUserId?.name || "N/A"}
                        </TableCell>

                        <TableCell>
                          {tenant.ownerUserId?.email || "N/A"}
                        </TableCell>

                        <TableCell className="capitalize">
                          {tenant.plan}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              tenant.status === "inactive"
                                ? "bg-yellow-100 text-yellow-800"
                                : tenant.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tenant.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="capitalize w-20 border-2 "
                                variant="ghost"
                                size="sm"
                                disabled={isActionLoading}
                              >
                                {tenant.status}
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleApprove(tenant._id)}
                              >
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleInactive(tenant._id)}
                              >
                                Inactive
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleBlock(tenant._id)}
                                className="text-red-600"
                              >
                                Block
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>

                    {/* Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 &&
                          setCurrentPage((prev) => prev - 1)
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={currentPage === pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {/* Next */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage((prev) => prev + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}