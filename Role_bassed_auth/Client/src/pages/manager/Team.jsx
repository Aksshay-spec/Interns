import {useGetTeams} from "@/hooks/manager/useGetTeams"
import { capitalizeFirstLetter } from "@/lib/utils";
import { useDeleteTeam } from "@/hooks/manager/useDeleteTeam";
import { useNavigate } from "react-router-dom";

const Team = () => {

    const {data, isLoading} = useGetTeams();
    const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam();
    const teams = data?.teams ?? [];

    // console.log("teams",data?.teams)
    const navigate = useNavigate();
    const handleButton = (teamId)=>{
        navigate(`/manager/${teamId}/addmembers`)
    }

    const handleDelete = (teamId) => {
      const confirmed = window.confirm("Are you sure you want to delete this team?");
      if (!confirmed) return;
      deleteTeam(teamId);
    };

  return (
     <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Teams
        </h2>

        {isLoading ? (
          <p className="text-slate-600">Loading Teams...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Team Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Action
                  </th>
                  {/* <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Created
                  </th> */}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {teams.map((team, index) => (
                  <tr
                    key={team._id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">
                      {capitalizeFirstLetter(team.teamName)}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleButton(team._id)}
                          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                        >
                          Add Members
                        </button>
                        <button
                          onClick={() => handleDelete(team._id)}
                          className="inline-flex items-center justify-center rounded-md bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                    {/* <td className="px-6 py-3 text-sm font-medium text-slate-900">
                      {new Date(manager.createdAt).toLocaleDateString()}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            {teams.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">
                No teams found
              </div>
            )}
          </div>
        )}
      </div>
  )
}

export default Team