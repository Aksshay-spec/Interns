import { useState, useEffect } from "react";
import { socket } from "@/utils/socket";

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

import { Input } from "@/components/ui/input";

const AdminDashboard = () => {

  const [users, setUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {

    const handleOnlineUsers = (onlineUsers) => {
      setUsers(onlineUsers);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("getOnlineUsers");

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };

  }, []);

  const filteredUsers = users
    .filter((u) => u.role !== "superadmin")
    .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    const totalusers = users.length ;
    // console.log(users)

  return (
    <div className="w-full p-4 space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>

      {/* Online Users Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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
              {totalusers < 0 ? 0 : totalusers}
            </div>
          </CardContent>

        </Card>

      </div>

      {/* Table Section */}
      {showTable && (
        <Card>

          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <CardTitle className="text-base">
              Online Users
            </CardTitle>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

              {/* Search */}
              <Input
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-[250px]"
              />

              {/* Role Filter */}
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>

              </Select>

            </div>

          </CardHeader>

          <CardContent>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">

              <Table className="min-w-[500px]">

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

                      <TableCell className="font-medium flex items-center gap-2 capitalize">
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

            </div>

          </CardContent>

        </Card>
      )}

    </div>
  );
};

export default AdminDashboard;