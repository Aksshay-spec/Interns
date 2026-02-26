import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

const fetchUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  return res.json()
}

const addUser = async (newUser) => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/users",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    }
  )
  return res.json()
}

export default function Users() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"])
    },
  })

  if (isLoading) return <p>Loading users...</p>
  if (isError) return <p>Error loading users</p>

  return (
    <div>
      <h2>Users List</h2>

      <button
        onClick={() =>
          mutation.mutate({ name: "New User" })
        }
      >
        Add User
      </button>

      {data.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}
