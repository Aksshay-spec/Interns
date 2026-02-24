import React from 'react'
import { capitalizeFirstLetter } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DataTable = ({isLoading , users , role , createdBy, onDelete, isDeleting}) => {
    const hasCreatedBy =
      !!createdBy ||
      users?.some((user) => user?.createdByName || user?.createdBy?.name);
  return (
     <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {role}s
        </h2>

        {isLoading ? (
          <p className="text-slate-600">Loading {role}s...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    {role} Name
                  </th>
                  {hasCreatedBy && (
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Created By
                    </th>
                  )}
                  {onDelete && (
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  )}
                  {/* <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Created
                  </th> */}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {users?.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">
                      {capitalizeFirstLetter(user.name)}
                    </td>
                    {hasCreatedBy && (
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">
                        {capitalizeFirstLetter(
                          user.createdByName || user.createdBy?.name || createdBy?.name || "—",
                        )}
                      </td>
                    )}
                    {onDelete && (
                      <td className="px-6 py-3 text-center">
                        <Button
                          onClick={() => onDelete(user._id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    )}
                    {/* <td className="px-6 py-3 text-sm font-medium text-slate-900">
                      {new Date(manager.createdAt).toLocaleDateString()}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            {users?.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">
                No {role} found
              </div>
            )}
          </div>
        )}
      </div>
  )
}

export default DataTable