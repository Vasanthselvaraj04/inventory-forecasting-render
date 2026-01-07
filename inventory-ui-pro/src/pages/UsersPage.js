import React, { useEffect, useState } from "react";
import {
  getUserByUsername,
  getAllUsers,
} from "../services/userService";

function UsersPage({ loggedInUsername }) {

  // ✅ hooks MUST be at top level (no conditions)
  const [myAccount, setMyAccount] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ load once when component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ THIS IS WHERE YOUR LINE GOES
  const loadUsers = async () => {
    try {
      // 🔹 YOUR ACCOUNT (FULL DETAILS)
      const myData = await getUserByUsername(loggedInUsername);
      setMyAccount(myData);

      // 🔹 OTHER USERS (username + role)
      const users = await getAllUsers();
      const filtered = users.filter(
        (u) => u.username !== loggedInUsername
      );
      setOtherUsers(filtered);

    } catch (error) {
      console.error("Error loading users", error);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ loading state
  if (loading) {
    return <h2>Loading Users...</h2>;
  }

  // ❌ user not found
  if (!myAccount) {
    return <h2>User not found</h2>;
  }

  return (
    <div>

      <h1>Users Management</h1>

      {/* ===== YOUR ACCOUNT ===== */}
      <section>
        <h2>Your Account</h2>
        <table className="data-table">
          <tbody>
            <tr>
              <th>User ID</th>
              <td>{myAccount.userId}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{myAccount.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{myAccount.emailId}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{myAccount.role}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ===== OTHER USERS ===== */}
      <section style={{ marginTop: "30px" }}>
        <h2>Other Users</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {otherUsers.map((u, index) => (
              <tr key={index}>
                <td>{u.username}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}

export default UsersPage;
