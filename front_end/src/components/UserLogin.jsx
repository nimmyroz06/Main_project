import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const [message, setMessage] = useState(""); // Success/Error message

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Email Validation
    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors({ ...errors, email: "Invalid email format" });
      } else {
        setErrors({ ...errors, email: "" });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.email) {
      alert("Please fix the errors before logging in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (response.ok) {
        // ✅ Store token & user details in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.UserName);
        localStorage.setItem("email", data.email);
        localStorage.setItem("phone", data.phone);
        localStorage.setItem("address", data.address);

        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/calculator"; // Redirect user to calculator
        }, 1500);
      } else {
        alert(data.message || "Login failed! Check your credentials.");
        setMessage(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error connecting to the server."); 
      setMessage("Error connecting to the server.");
    }
  };


  return (
    <div>
      <UserNavbar/>
    
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#9DC08B",
      backgroundPosition: "center"
    }}>
      <div style={{
        width: "380px",
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#2e7d32", marginBottom: "15px" }}> Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ fontWeight: "bold", color: "#388e3c" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "96%", padding: "8px", marginTop: "5px",
                border: "1px solid #81c784", borderRadius: "5px"
              }}
            />
            {errors.email && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {errors.email}
              </p>
            )}
          </div>
          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ fontWeight: "bold", color: "#388e3c" }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "96%", padding: "8px", marginTop: "5px",
                border: "1px solid #81c784", borderRadius: "5px"
              }}
            />
          </div>
          <button type="submit"
            style={{
              width: "50%", padding: "10px",
              backgroundColor: "#2e7d32", color: "white",
              border: "none", borderRadius: "5px", cursor: "pointer",
              fontSize: "16px", marginTop: "10px", transition: "background 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#1b5e20"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#2e7d32"}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: "10px" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#2e7d32", fontWeight: "bold", textDecoration: "none" }}
            onMouseOver={(e) => e.target.style.textDecoration = "underline"}
            onMouseOut={(e) => e.target.style.textDecoration = "none"}
          >Sign up here</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default UserLogin;
