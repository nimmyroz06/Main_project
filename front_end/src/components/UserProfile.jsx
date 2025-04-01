import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    UserName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
          setUpdatedUser({
            UserName: data.UserName,
            email: data.email,
            phone: data.phone,
            address: data.address,
          });
        } else {
          setError(data.message || "Failed to fetch user profile");
        }
      } catch (error) {
        setError("Error fetching user profile. Please try again.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile. Please try again.");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", color: "#2e7d32" }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;
  }

  return (
    <div>
      <UserNavbar/>
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Your Profile</h2>
        {user ? (
          <div>
            {isEditing ? (
              <>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>Name:</label>
                  <input
                    type="text"
                    name="UserName"
                    value={updatedUser.UserName}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={updatedUser.phone}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={updatedUser.address}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <button onClick={handleSave} style={styles.saveButton}>
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div style={styles.statsContainer}>
                <button onClick={handleEditClick} style={styles.editButton}>
                  Edit Profile
                </button>
                  <p><strong>Name:</strong> {user.UserName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Address:</strong> {user.address}</p>
                </div>
                <a href="/view" style={styles.statusButton}>Know Your Status</a>
              </>
            )}
          </div>
        ) : (
          <p style={{ color: "red" }}>User not found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

// CSS Styles
const styles = {
  page: {
    backgroundColor: "#dcedc8",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    width: "50%",
    maxWidth: "900px",
    backgroundColor: "#E8F5E9",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  statsContainer: {
    backgroundColor: "#81c784", // Single card for all details
    padding: "30px",
    borderRadius: "8px",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    width: "100%",
    maxWidth: "600px",
    textAlign: "left",
    margin: "0 auto 20px auto", // Centering the box
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    lineHeight: "1.8",
    position: "relative",
  },
  statCard: {
    backgroundColor: "#81c784",
    padding: "15px",
    borderRadius: "8px",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    width: "100%",
    maxWidth: "500px",
    textAlign: "left",
    marginBottom: "10px",
  },
  inputContainer: {
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  label: {
    fontWeight: "bold",
    color: "#388e3c",
    width: "100px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  editButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "1px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  saveButton: {
    backgroundColor: "#388e3c",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  statusButton: {
    display: "inline-block",
    backgroundColor: "#ff9800",
    color: "white",
    padding: "10px 15px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "15px",
  }
};

export default UserProfile;
