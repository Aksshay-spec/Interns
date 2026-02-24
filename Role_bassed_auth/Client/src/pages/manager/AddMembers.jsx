import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGetAvailableStudents } from "@/hooks/manager/useGetAvailableStudents";
import { useGetTeams } from "@/hooks/manager/useGetTeams";
import { useAddTeamMembers } from "@/hooks/manager/useAddTeamMembers";
import { useRemoveTeamMembers } from "@/hooks/manager/useRemoveTeamMembers";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import toast from "react-hot-toast";

export default function AddMembers() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { teamName: "", students: [] } });

  const navigate = useNavigate();
  const { teamId } = useParams();

  const selectedStudents = watch("students") || [];
  const [open, setOpen] = useState(false);

  /* ---------- TEAM EDITING STATES ---------- */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [checkedMembers, setCheckedMembers] = useState({});

  const { data: studentsData } = useGetAvailableStudents();
  const students = studentsData?.students || [];

  const { data, isLoading: teamsLoading } = useGetTeams();
  const team = data?.teams?.find((t) => t._id === teamId);

  const { mutate: addMembers } = useAddTeamMembers();
  const { mutate: removeMembers } = useRemoveTeamMembers();

  /* ---------- ADD MEMBERS ---------- */
  const toggleStudent = (id, checked) => {
    if (checked) {
      setValue("students", [...selectedStudents, id], { shouldValidate: true });
    } else {
      setValue(
        "students",
        selectedStudents.filter((sId) => sId !== id),
        { shouldValidate: true },
      );
    }
  };

  const onSubmit = (formData) => {
    addMembers(
      { teamId, studentIds: formData.students },
      { onSuccess: () => {
        toast.success("Members added successfully!");
        navigate("/manager/team");
      }},
    );
  };

  /* ---------- OPEN MEMBER EDITOR ---------- */
  const openTeamEditor = (team) => {
    const initial = {};
    team.teamMembers.forEach((m) => (initial[m._id] = true));
    setCheckedMembers(initial);
    setEditingTeam(team);
  };

  /* ---------- CONFIRM BATCH REMOVAL ---------- */
  const confirmRemoval = () => {
    const removedIds = Object.keys(checkedMembers).filter(
      (id) => !checkedMembers[id],
    );

    if (removedIds.length === 0) {
      setConfirmOpen(false);
      return;
    }

    removeMembers(
      {
        teamId: editingTeam._id,
        studentIds: removedIds,
      },
      {
        onSuccess: () => setConfirmOpen(false),
      },
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-800">Add Members</h1>

      {/* ---------------- ADD MEMBER FORM ---------------- */}
      <Card className="bg-white border border-slate-200 shadow-sm w-full">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
            <div >
              <Label>Team Name</Label>
              <Input className="capitalize" disabled value={team?.teamName || ""} />
            </div>

            <div>
              <Label>Select Students</Label>
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
                    className="w-full justify-between"
                  >
                    {selectedStudents.length > 0
                      ? `${selectedStudents.length} selected`
                      : "Select students"}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
                  {students.map((student) => (
                    <DropdownMenuCheckboxItem
                    className="capitalize"
                      key={student._id}
                      checked={selectedStudents.includes(student._id)}
                      onCheckedChange={(checked) =>
                        toggleStudent(student._id, checked)
                      }
                    >
                      {student.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {students.length === 0 && (
                    <DropdownMenuItem disabled>
                      No available students
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {errors.students && (
                <p className="text-xs text-red-500">
                  {errors.students.message}
                </p>
              )}
            </div>

            <div className="flex justify-center sm:justify-end pt-4 border-t">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 text-white"
              >
                Add Members
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ---------------- TEAM TABLE ---------------- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Teams</h2>

        {teamsLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Members</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="capitalize">
                {data?.teams?.map((team, index) => (
                  <TableRow key={team._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{team.teamName}</TableCell>

                    <TableCell>
                      {team.teamMembers?.length > 0 ? (
                        <DropdownMenu
                          onOpenChange={(o) => o && openTeamEditor(team)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              Manage Members
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="w-64 p-2">
                            <div className="max-h-60 overflow-y-auto space-y-1">
                              {team.teamMembers.map((member) => (
                                <DropdownMenuCheckboxItem
                                  key={member._id}
                                  onSelect={(e) => e.preventDefault()}
                                  checked={checkedMembers[member._id] ?? true}
                                  onCheckedChange={(checked) =>
                                    setCheckedMembers((prev) => ({
                                      ...prev,
                                      [member._id]: checked,
                                    }))
                                  }
                                  className="flex items-center justify-between gap-2"
                                >
                                  <span className="truncate">
                                    {member.name}
                                  </span>

                                 
                                  <button
                                    type="button"
                                    className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                    onClick={(e) => {
                                      e.stopPropagation(); // ⭐ IMPORTANT (prevents checkbox toggle)
                                      navigate(
                                        `/manager/student/${member._id}`,
                                      );
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>
                                </DropdownMenuCheckboxItem>
                              ))}
                            </div>

                            <div className="border-t pt-2 mt-2">
                              <Button
                                size="sm"
                                className="w-full bg-red-600 text-white"
                                onClick={() => setConfirmOpen(true)}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No Members
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ---------------- CONFIRM POPUP ---------------- */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Team Members</AlertDialogTitle>
            <AlertDialogDescription>
              Unchecked students will be removed from this team.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmRemoval}
            >
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
