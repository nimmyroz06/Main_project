import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [totalRecyclingCenters, setTotalRecyclingCenters] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    // Fetch users list and total recycling centers
    axios.get("http://localhost:5000/admin/users").then((response) => setUsers(response.data));
    axios.get("http://localhost:5000/admin/recycling-centers").then((response) => setTotalRecyclingCenters(response.data.total));
  }, []);

  // Handle sorting users by name
  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    setUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar/>
    
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        {/* Total Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Total Recycling Centers</h3>
            <p>{totalRecyclingCenters}</p>
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        {/* Users List */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th onClick={handleSort} style={styles.sortableHeader}>
                User Name {sortOrder === "asc" ? "▲" : "▼"}
              </th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

// CSS Styles
const styles = {
  page: {
    backgroundColor: "#dcedc8", // Light Green Background
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    width: "80%",
    maxWidth: "900px",
    backgroundColor: "#E8F5E9",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    overflowY: "auto"
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  statCard: {
    backgroundColor: "#81c784",
    padding: "15px",
    borderRadius: "8px",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    width: "200px",
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },
  sortableHeader: {
    cursor: "pointer",
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "10px",
  },
};

export default AdminView;
