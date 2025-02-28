import UserItem from "./UserItem";

const UsersList = ({ users }) => (
  <div className="overflow-x-auto">
    <table className="table w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserItem key={user._id} user={user} />
        ))}
      </tbody>
    </table>
  </div>
);

export default UsersList;
