import { useGetUsersQuery } from '../api/apiSlice'

export default function UsersList() {
  // RTK Query useQueryHook: useGetUsersQuery
  const { data, isLoading, isError } = useGetUsersQuery()

  if (isLoading) {
    return <div data-testid="users-loading">Loading...</div>
  }

  if (isError) {
    return (
      <div data-testid="users-error">
        Failed to load users
      </div>
    )
  }

  return (
    <div data-testid="users-list">
      {data?.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.username}</p>
        </div>
      ))}
    </div>
  )
}