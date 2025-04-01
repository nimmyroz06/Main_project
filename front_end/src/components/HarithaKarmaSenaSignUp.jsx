import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const HarithaKarmaSenaSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedErrors = { ...errors };

    // Name Validation (Only letters and spaces allowed)
    if (name === "name") {
      updatedErrors.name = /^[A-Za-z\s]+$/.test(value) ? "" : "Only alphabets and spaces are allowed";
    }

    // Phone Number Validation (Only 10-digit numbers)
    if (name === "phoneNumber") {
      updatedErrors.phoneNumber = /^[0-9]{10}$/.test(value) ? "" : "Phone number must be exactly 10 digits";
    }

    // Password Validation (At least 6 characters, one letter, one number)
    if (name === "password") {
      updatedErrors.password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
        ? ""
        : "Password must be at least 6 characters, include one letter and one number";
    }

    // Confirm Password Validation
    if (name === "confirmPassword") {
      updatedErrors.confirmPassword = value === formData.password ? "" : "Passwords do not match";
    }

    setErrors(updatedErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any validation errors exist before submitting
    if (Object.values(errors).some((error) => error !== "")) {
      setMessage("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/hks_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed!");
      }

      setMessage("Signup successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/hks_login";
      }, 2000);
    } catch (error) {
      setMessage(error.message || "Error connecting to the server.");
    }
  };

  return (
    <div>
      <Navbar/>
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", backgroundColor: "#9DC08B", backgroundPosition: "center"
    }}>
      <div style={{
        width: "380px", padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", textAlign: "center"
      }}>
        <h2 style={{ color: "#2e7d32", marginBottom: "15px" }}>Haritha Karma Sena Sign Up</h2>

        {message && <p style={{ color: message.includes("successful") ? "green" : "red" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ fontWeight: "bold", color: "#388e3c" }}>Name</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} required
              style={{
                width: "96%", padding: "8px", marginTop: "5px",
                border: "1px solid #81c784", borderRadius: "5px"
              }}
            />
            {errors.name && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ fontWeight: "bold", color: "#388e3c" }}>Phone Number</label>
            <input
              type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required
              style={{
                width: "96%", padding: "8px", marginTop: "5px",
                border: "1px solid #81c784", borderRadius: "5px"
              }}
            />
            {errors.phoneNumber && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.phoneNumber}</p>}
          </div>

          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ fontWeight: "bold", color: "#388e3c" }}>Password</label>
            <input
              type="password" name="password" value={formData.password} onChange={handleChange} required
              style={{
                width: "96%", padding: "8px", marginTop: "5px",
                border: "1px solid #81c784", borderRadius: "5px"
              }}
            />
            {errors.password && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.password}</p>}
          </div>

          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <label style={{ fontWeight: "bold", color: "#388e3c" }}>Confirm Password</label>
            <input
              type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
              style={{
                width: "96%", padding: "8px", marginTop: "5px",
                border: "1px solid #81c784", borderRadius: "5px"
              }}
            />
            {errors.confirmPassword && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.confirmPassword}</p>}
          </div>

          <button type="submit"
            style={{
              width: "50%", padding: "10px", backgroundColor: "#2e7d32",
              color: "white", border: "none", borderRadius: "5px", cursor: "pointer",
              fontSize: "16px", marginTop: "10px", transition: "background 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#1b5e20"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#2e7d32"}
          >
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/hks_login"
            style={{ color: "#2e7d32", fontWeight: "bold", textDecoration: "none" }}
            onMouseOver={(e) => e.target.style.textDecoration = "underline"}
            onMouseOut={(e) => e.target.style.textDecoration = "none"}
          >Login here</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default HarithaKarmaSenaSignUp;
