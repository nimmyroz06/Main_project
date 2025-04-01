import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const HarithaKarmaSenaLogin = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name Validation (Only letters and spaces)
    if (name === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        setErrors({ ...errors, name: "Only alphabets and spaces are allowed" });
      } else {
        setErrors({ ...errors, name: "" });
      }
    }

    // Password Validation (At least 6 characters, one letter, one number)
    if (name === "password") {
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)) {
        setErrors({
          ...errors,
          password: "Must be at least 6 characters with one letter & one number",
        });
      } else {
        setErrors({ ...errors, password: "" });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (errors.name || errors.password) {
      setMessage("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/hks_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed!");
      }

      const data = await response.json();
      console.log("Response from backend:", data);
      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/hks_view";
      }, 2000);
    } catch (error) {
      console.error("Error submitting login:", error);
      setMessage(error.message || "Error connecting to the server.");
    }
  };

  return (
    <div>
      <Navbar/>
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
        <h2 style={{ color: "#2e7d32", marginBottom: "15px" }}>Haritha Karma Sena Login</h2>

        {message && <p style={{ color: message.includes("successful") ? "green" : "red" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ fontWeight: "bold", color: "#388e3c" }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "96%", padding: "8px", marginTop: "5px",
                border: "1px solid #81c784", borderRadius: "5px"
              }}
            />
            {errors.name && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {errors.name}
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
            {errors.password && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {errors.password}
              </p>
            )}
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
          Don't have an account? <Link to="/hks_signup" style={{ color: "#2e7d32", fontWeight: "bold", textDecoration: "none" }}
            onMouseOver={(e) => e.target.style.textDecoration = "underline"}
            onMouseOut={(e) => e.target.style.textDecoration = "none"}
          >Sign up here</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default HarithaKarmaSenaLogin;
