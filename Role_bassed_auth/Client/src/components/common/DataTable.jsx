import React from "react";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const DataTable = ({
  isLoading,
  users,
  role,
  createdBy,
  onDelete, // optional
}) => {
  const showDelete = typeof onDelete === "function";

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {role}s
      </h2>

      {isLoading ? (
        <p className="text-muted-foreground">Loading {role}s...</p>
      ) : (
        <div className="rounded-lg border bg-background shadow-sm overflow-x-auto">
          <Table>
            {/* HEADER */}
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[70px]">#</TableHead>
                <TableHead>{role} Name</TableHead>
                {createdBy && <TableHead>Created By</TableHead>}
                {showDelete && (
                  <TableHead className="text-left">
                    Action
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            {/* BODY */}
            <TableBody className="capitalize">
              {users?.length > 0 ? (
                users.map((user, index) => (
                  <TableRow key={user._id} className="hover:bg-muted/40">
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell className="font-medium">
                      {user.name}
                    </TableCell>

                    {user.createdBy && (
                      <TableCell className="font-medium">
                        {user.createdBy.name}
                      </TableCell>
                    )}

                    {showDelete && (
                      <TableCell className="text-left">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(user._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      showDelete
                        ? createdBy
                          ? 4
                          : 3
                        : createdBy
                        ? 3
                        : 2
                    }
                    className="text-center text-muted-foreground py-6"
                  >
                    No {role} found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DataTable;