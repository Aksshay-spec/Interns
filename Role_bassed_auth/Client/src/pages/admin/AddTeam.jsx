import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { useRegisterTeam } from "@/hooks/admin/useRegisterTeam";
import { useDeleteTeam } from "@/hooks/admin/useDeleteTeam";
import { useGetManagers } from "@/hooks/admin/useGetManagers";
import { useGetTeams } from "@/hooks/admin/useGetTeams";

import toast from "react-hot-toast";

export default function AddTeam() {
  const { mutateAsync, isPending } = useRegisterTeam();
  const { mutate: deleteTeam } = useDeleteTeam();

  const { data, isLoading } = useGetManagers();
  const { data: teams, isFetching } = useGetTeams();

  const [selectedLeader, setSelectedLeader] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (formData) => {
    const res = await mutateAsync(formData);
    if (res) {
      toast.success("Team created successfully!");
    }
    reset();
    setSelectedLeader("");
  };

  return (
    <div className="sm:min-w-xl">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Add Team
        </h1>
      </div>

      {/* CREATE TEAM FORM */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Team Name */}
            <div>
              <Label className="text-slate-700">
                Team Name
              </Label>
              <Input
                placeholder="Team Name"
                className="mt-1 bg-white border-slate-300 text-slate-900"
                {...register("teamName", {
                  required: "Team name is required",
                })}
              />
              {errors.teamName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.teamName.message}
                </p>
              )}
            </div>

            {/* Team Lead */}
            <div>
              <Label className="text-slate-700">
                Team Lead
              </Label>

              <Select
                value={selectedLeader}
                onValueChange={(value) => {
                  setSelectedLeader(value);
                  setValue("teamLeader", value, {
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select Team Lead" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      data?.managers?.map((manager) => (
                        <SelectItem
                          key={manager._id}
                          value={manager._id}
                        >
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

            {/* SUBMIT */}
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

      {/* TEAMS TABLE */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Teams
        </h2>

        {isFetching ? (
          <p className="text-slate-600">
            Fetching teams...
          </p>
        ) : (
          <div className="rounded-lg border bg-background shadow-sm overflow-x-auto">
            <Table>
              {/* HEADER */}
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[70px]">
                    #
                  </TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Team Lead</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-left">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* BODY */}
              <TableBody>
                {teams?.length > 0 ? (
                  teams.map((team, index) => (
                    <TableRow
                      key={team._id}
                      className="odd:bg-muted/20 hover:bg-muted/40"
                    >
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>

                      <TableCell className="font-medium capitalize">
                        {team.teamName}
                      </TableCell>

                      <TableCell className="capitalize">
                        {team.teamLeader?.name}
                      </TableCell>

                      <TableCell>
                        {team.createdBy?.name}
                      </TableCell>

                      <TableCell className="text-left">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this team?"
                              )
                            ) {
                              deleteTeam(team._id, {
                                onSuccess: () => {
                                  toast.success(
                                    "Team deleted successfully!"
                                  );
                                },
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-6"
                    >
                      No teams found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}