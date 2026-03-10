import { useState } from "react";
import { useGetOnlineUsers } from "@/hooks/admin/useGetOnlineUsers";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { data } = useGetOnlineUsers();

  const [showTable, setShowTable] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("name-asc");
  const [searchTerm, setSearchTerm] = useState("");

  const users = data?.data?.data || [];
  const normalizedSearch = searchTerm.trim().toLowerCase();

  
  const filteredUsers = [...users]
    .filter((u) => u.role !== "superadmin")
    .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
    .filter((u) => {
      if (!normalizedSearch) return true;

      return (
        String(u.name || "").toLowerCase().includes(normalizedSearch) ||
        String(u.email || "").toLowerCase().includes(normalizedSearch) ||
        String(u.role || "").toLowerCase().includes(normalizedSearch)
      );
    })
    .sort((a, b) => {
      if (sortFilter === "name-desc") {
        return String(b.name || "").localeCompare(String(a.name || ""));
      }
      if (sortFilter === "role") {
        return String(a.role || "").localeCompare(String(b.role || ""));
      }
      return String(a.name || "").localeCompare(String(b.name || ""));
    });

  const clearFilters = () => {
    setRoleFilter("all");
    setSortFilter("name-asc");
    setSearchTerm("");
  };

  return (
    <div className="w-full p-4 space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>

      {/* Online Users Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <Card
          onClick={() => setShowTable(!showTable)}
          className="cursor-pointer hover:shadow-md transition"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Online Users
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {filteredUsers.length}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Table Section */}
      {showTable && (
        <Card>

          <CardHeader className="space-y-4">

            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Online Users
              </CardTitle>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Reset Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, role"
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
              />

              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortFilter}
                onValueChange={(value) => setSortFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="name-asc">Sort: Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Sort: Name Z-A</SelectItem>

                </SelectContent>
              </Select>
            </div>

          </CardHeader>

          <CardContent>

            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>

                    <TableCell className="font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {user.name}
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell className="capitalize">
                      {user.role}
                    </TableCell>

                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No users online
                    </TableCell>
                  </TableRow>
                )}

              </TableBody>

            </Table>

          </CardContent>

        </Card>
      )}

    </div>
  );
};

export default AdminDashboard;