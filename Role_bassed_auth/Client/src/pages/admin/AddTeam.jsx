import { useForm } from "react-hook-form";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRegisterTeam } from "@/hooks/admin/useRegisterTeam";

import { useGetManagers } from "@/hooks/admin/useGetManagers";
import { useGetTeams } from "@/hooks/admin/useGetTeams";
import { useDeleteTeamAdmin } from "@/hooks/admin/useDeleteTeamAdmin";

export default function AddManager() {
  const { mutateAsync, isPending } = useRegisterTeam();

  const { data,isLoading } = useGetManagers();

  const { data: teams, isFetching } = useGetTeams();
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeamAdmin();
  const [selectedLeader, setSelectedLeader] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data) => {
    await mutateAsync(data);
    reset();
    setSelectedLeader("");
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      deleteTeam(teamId);
    }
  };

  return (
    <div className="sm:min-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Add Team</h1>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <Label className="text-slate-700">Name</Label>
              <Input
                placeholder="Team Name"
                className="mt-1 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                {...register("teamName", { required: "TeamName is required" })}
              />
              {errors.teamName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.teamName.message}
                </p>
              )}
            </div>
            <div>
            <Label className="text-slate-700 mb-1">Team Lead</Label>

            <Select
              value={selectedLeader}
              onValueChange={(value) => {
                setSelectedLeader(value);
                setValue("teamLeader", value, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Team Lead" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    data?.managers.map((manager) => (
                      <SelectItem key={manager._id} value={manager._id}>
                        {manager.name}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
              
            {errors.teamLeader && (
              <p className="mt-1 text-xs text-red-500">
                Team lead is required
              </p>
            )}
            </div>
            {/* Submit */}
            <div className="flex justify-center sm:justify-end pt-4 border-t border-slate-200">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isPending ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Teams
        </h2>

        {isFetching ? (
          <p className="text-slate-600">Fetching teams...</p>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="px-6 py-3 font-semibold text-slate-700">
                    #
                  </TableHead>
                  <TableHead className="px-6 py-3 font-semibold text-slate-700">
                    Team Name
                  </TableHead>
                  <TableHead className="px-6 py-3 font-semibold text-slate-700">
                    Team Lead
                  </TableHead>
                  <TableHead className="px-6 py-3 font-semibold text-slate-700">
                    Created By
                  </TableHead>
                  <TableHead className="px-6 py-3 font-semibold text-slate-700 text-center">
                    Action
                  </TableHead>
                  {/* <TableHead className="px-6 py-3 font-semibold text-slate-700">
                    Created
                  </TableHead> */}
                </TableRow>
              </TableHeader>

              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team._id}>
                    <TableCell className="px-6 py-3 text-sm text-slate-600">
                      {index + 1}
                    </TableCell>
                    <TableCell className=" capitalize px-6 py-3 text-sm font-medium text-slate-900">
                      {team.teamName}
                    </TableCell>
                    <TableCell className=" capitalize  px-6 py-3 text-sm font-medium text-slate-900">
                      {team.teamLeader.name}
                    </TableCell>
                    <TableCell className=" capitalize  px-6 py-3 text-sm font-medium text-slate-900">
                      {team.createdBy.name}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-center">
                      <Button
                        onClick={() => handleDeleteTeam(team._id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    {/* <TableCell className="px-6 py-3 text-sm font-medium text-slate-900">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {teams.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">
                No teams found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
