import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const AdminLogin = () => {
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Validate input fields
    if (!adminName.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    // Hardcoded admin credentials
    const validAdmin = "nimmy";
    const validPassword = "admin";

    if (adminName === validAdmin && password === validPassword) {
      localStorage.setItem("adminToken", "dummyToken");
      localStorage.setItem("adminName", adminName); // Store admin name
      localStorage.setItem("isAdmin", "true"); // Store admin token

      window.location.reload();
      navigate("/adminview"); // Redirect to the admin view page
      window.location.reload(); // **Force re-render**
    } else {
      setError("Invalid admin name or password");
    }
  };

  return (
    <div>
      <Navbar/>
    
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Admin Name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

// CSS Styles
const styles = {
  page: {
    backgroundColor: "#9DC08B",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    textAlign: "center",
    padding: "40px",
    width: "400px",
    backgroundColor: "#E8F5E9",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "94%",
  },
  loginButton: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "50%",
    marginTop: "10px",
    marginLeft: "80px",
    cursor: "pointer",
  },
};

export default AdminLogin;
