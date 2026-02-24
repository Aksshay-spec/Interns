import { useState } from "react";
import { useGetTeams } from "@/hooks/manager/useGetTeams";
import { useNavigate } from "react-router-dom";
import { useDeleteTeam } from "@/hooks/manager/useDeleteTeam";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

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
import toast from "react-hot-toast";

const Team = () => {
  const { data, isLoading } = useGetTeams();
  const navigate = useNavigate();

  const { mutate: deleteTeam, isPending: deleting } = useDeleteTeam();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const teams = data?.teams || [];

  const handleAddMembers = (teamId) => {
    navigate(`/manager/${teamId}/addmembers`);
  };

  const openDeleteDialog = (team) => {
    setSelectedTeam(team);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteTeam(selectedTeam._id, {
      onSuccess: () => {
        toast.success("Team deleted successfully!");
        setDeleteOpen(false);
      },
    });
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">Teams</h2>

      {isLoading ? (
        <p className="text-muted-foreground">Loading Teams...</p>
      ) : (
        <div className="rounded-lg border bg-background shadow-sm overflow-x-auto">
          <Table>
            {/* HEADER */}
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[70px]">#</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead className="w-[220px] text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {/* BODY */}
            <TableBody className="capitalize">
              {teams.length > 0 ? (
                teams.map((team, index) => (
                  <TableRow
                    key={team._id}
                    className="odd:bg-muted/20 hover:bg-muted/40"
                  >
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell className="font-medium">
                      {team.teamName}
                    </TableCell>

                    <TableCell className="min-w-43.60">
                      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button
                          size="sm"
                          className=" sm:w-auto bg-green-600 hover:bg-green-500 text-white"
                          onClick={() => handleAddMembers(team._id)}
                        >
                          Add Members
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full sm:w-auto"
                          onClick={() => openDeleteDialog(team)}
                        >
                          Delete Team
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
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

      {/* -------- DELETE CONFIRM POPUP -------- */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete team{" "}
              <span className="font-semibold">{selectedTeam?.teamName}</span>{" "}
              and make all its members available again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Team;
