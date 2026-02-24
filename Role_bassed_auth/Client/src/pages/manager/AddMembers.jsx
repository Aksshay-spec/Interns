import { useForm } from "react-hook-form";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom";

import { useGetAvailableStudents } from "@/hooks/manager/useGetAvailableStudents";
import { useGetTeams } from "@/hooks/manager/useGetTeams";
import { useAddTeamMembers } from "@/hooks/manager/useAddTeamMembers";
import { useRemoveTeamMember } from "@/hooks/manager/useRemoveTeamMember";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AddMembers() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamName: "",
      students: [],
    },
  });

  const navigate = useNavigate();
  const { teamId } = useParams();

  const selectedStudents = watch("students") || [];
  const [open, setOpen] = useState(false);
  const [membersToRemove, setMembersToRemove] = useState(new Set());
  const [viewMembersDialogOpen, setViewMembersDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);

  const { data: studentsData } = useGetAvailableStudents();
  const students = studentsData?.students || [];

  const { data, isLoading: teamsLoading } = useGetTeams();
  const team = data?.teams?.find((t) => t._id === teamId);

  const { mutate: addMembers } = useAddTeamMembers();
  const { mutate: removeTeamMember, isPending: isRemoving } = useRemoveTeamMember();

  const toggleStudent = (id, checked) => {
    if (checked) {
      setValue("students", [...selectedStudents, id], {
        shouldValidate: true,
      });
    } else {
      setValue(
        "students",
        selectedStudents.filter((sId) => sId !== id),
        { shouldValidate: true }
      );
    }
  };

  const handleMemberCheckboxChange = (memberId, checked) => {
    const newSet = new Set(membersToRemove);
    if (checked) {
      newSet.add(memberId);
    } else {
      newSet.delete(memberId);
    }
    setMembersToRemove(newSet);
  };

  const handleConfirmRemoveMembers = () => {
    if (membersToRemove.size === 0) {
      alert("Please select at least one member to remove");
      return;
    }

    if (!window.confirm("Are you sure you want to remove the selected members from this team?")) {
      return;
    }

    membersToRemove.forEach((studentId) => {
      removeTeamMember(
        { teamId: editingTeamId, studentId },
        {
          onSuccess: () => {
            setMembersToRemove((prev) => {
              const newSet = new Set(prev);
              newSet.delete(studentId);
              return newSet;
            });
          },
          onError: (error) => {
            console.error("Error removing member:", error);
            alert("Failed to remove member. Please try again.");
          },
        }
      );
    });

    // Close dialog after removing all members
    setTimeout(() => {
      setViewMembersDialogOpen(false);
      setMembersToRemove(new Set());
    }, 500);
  };

  const onSubmit = (formData) => {
    addMembers(
      {
        teamId,
        studentIds: formData.students,
      },
      {
        onSuccess: () => {
          navigate("/manager/team");
        },
        onError: (error) => {
          console.error(
            error?.response?.data?.message || "Failed to add members"
          );
        },
      }
    );
  };

  const handleViewMembers = (team) => {
    setEditingTeamId(team._id);
    setMembersToRemove(new Set());
    setViewMembersDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Add Members</h1>
      </div>
      <Card className="bg-white border border-slate-200 shadow-sm w-full">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Team Name */}
            <div>
              <Label className="text-slate-700">Team Name</Label>
              <Input
                disabled
                value={team?.teamName || ""}
                className="mt-1 bg-white border-slate-300"
              />
            </div>

            {/* Students Dropdown */}
            <div>
              <Label className="text-slate-700">Select Students</Label>

              {/* Hidden input to register field */}
              <input
                type="hidden"
                {...register("students", {
                  validate: (v) =>
                    v.length > 0 || "Select at least one student",
                })}
              />

              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-1 w-full justify-between"
                  >
                    {selectedStudents.length > 0
                      ? `${selectedStudents.length} student(s) selected`
                      : "Select students"}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className=" w-[var(--radix-dropdown-menu-trigger-width)]  overflow-y-auto p-1"
                >
                  {students.map((student) => (
                    <DropdownMenuCheckboxItem
                      className="w-full"
                      key={student._id}
                      checked={selectedStudents.includes(student._id)}
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(checked) =>
                        toggleStudent(student._id, checked)
                      }
                    >
                      {capitalizeFirstLetter(student.name)}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {students.length === 0 && (
                    <DropdownMenuItem disabled className="text-slate-400">
                      No available students
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {errors.students && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.students.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center sm:justify-end pt-4 border-t border-slate-200">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Create Team
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Teams</h2>

        {teamsLoading ? (
          <p className="text-slate-600">Loading Teams...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">
                    #
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">
                    Teams Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700">
                    Members
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {data?.teams?.map((team, index) => (
                  <tr key={team._id} className="hover:bg-slate-50 transition">
                    <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-900">
                      {capitalizeFirstLetter(team.teamName)}
                    </td>

                    <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm">
                      {team.teamMembers?.length > 0 ? (
                        <Dialog open={viewMembersDialogOpen && editingTeamId === team._id} onOpenChange={(newOpen) => {
                          if (!newOpen) {
                            setViewMembersDialogOpen(false);
                            setEditingTeamId(null);
                            setMembersToRemove(new Set());
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => handleViewMembers(team)}
                            >
                              View Members
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Team Members - {capitalizeFirstLetter(team.teamName)}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {team.teamMembers.map((member) => (
                                <div
                                  key={member._id}
                                  className="flex items-center space-x-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50"
                                >
                                  <input
                                    type="checkbox"
                                    id={`member-${member._id}`}
                                    checked={membersToRemove.has(member._id)}
                                    onChange={(e) =>
                                      handleMemberCheckboxChange(
                                        member._id,
                                        e.target.checked
                                      )
                                    }
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`member-${member._id}`}
                                    className="flex-1 text-sm font-medium text-slate-700 cursor-pointer"
                                  >
                                    {capitalizeFirstLetter(member.name)}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate(`/manager/student/${member._id}`)
                                    }
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                                  >
                                    View Profile
                                  </button>
                                </div>
                              ))}
                            </div>

                            <DialogFooter className="flex gap-2 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setViewMembersDialogOpen(false);
                                  setEditingTeamId(null);
                                  setMembersToRemove(new Set());
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleConfirmRemoveMembers}
                                disabled={membersToRemove.size === 0 || isRemoving}
                                className="bg-rose-600 hover:bg-rose-700 text-white disabled:bg-rose-400"
                              >
                                {isRemoving ? "Removing..." : "Remove Selected"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          No Members
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data?.teams?.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">
                No Teams found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
