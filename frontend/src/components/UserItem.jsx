import { useAdmin } from "../context/AdminContext";

const UserItem = ({ user }) => {
  const { deleteUser } = useAdmin();

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <span className="badge badge-info">{user.role}</span>
      </td>
      <td>{user.isVerified ? "Verified" : "Pending"}</td>
      <td>
        <button
          onClick={() => deleteUser(user._id)}
          className="btn btn-error btn-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserItem;
