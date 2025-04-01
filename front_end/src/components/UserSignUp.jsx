import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    UserName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "UserName" && !/^[A-Za-z\s]*$/.test(value)) {
      newErrors.UserName = "Only alphabets and spaces are allowed";
    } else {
      newErrors.UserName = "";
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = "Invalid email format";
    } else {
      newErrors.email = "";
    }

    if (name === "phone" && !/^\d{10}$/.test(value)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    } else {
      newErrors.phone = "";
    }

    if (name === "address" && value.trim() === "") {
      newErrors.address = "Address cannot be empty";
    } else {
      newErrors.address = "";
    }

    if (name === "password" && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)) {
      newErrors.password = "Password must be at least 6 characters long with at least one letter and one number";
    } else {
      newErrors.password = "";
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        newErrors.confirmPassword = "";
      }
    }

    setErrors(newErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== "")) {
      setMessage("Please fix the errors before submitting.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed!");
      }
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage(error.message || "Error connecting to the server.");
    }
  };

  return (
    <div>
      <UserNavbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "109vh", backgroundColor: "#9DC08B" }}>

        <div style={{ width: "400px", padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", textAlign: "center" }}>

          <h2 style={{ color: "#2e7d32", marginBottom: "15px" }}>Sign Up</h2>

          {message && <p style={{ color: message.includes("successful") ? "green" : "red" }}>{message}</p>}

          <form onSubmit={handleSubmit}>
            {["UserName", "email", "phone", "address", "password", "confirmPassword"].map((key) => (
              <div key={key} style={{ marginBottom: "10px", textAlign: "left" }}>
                <label style={{ fontWeight: "bold", color: "#388e3c" }}>
                  {key === "UserName" ? "User Name" :
                   key === "email" ? "Email" :
                   key === "phone" ? "Phone Number" :
                   key === "address" ? "Address" :
                   key === "password" ? "Password" : "Confirm Password"}
                </label>

                <input
                  type={key === "password" || key === "confirmPassword" ? "password" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
                {errors[key] && <p style={{ color: "red", fontSize: "12px" }}>{errors[key]}</p>}
              </div>
            ))}
            
            <br/>
            <button type="submit" disabled={Object.values(errors).some((error) => error !== "")} style={{ padding: "10px", width: "100%", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Sign Up</button>
          </form>
          <p>Already have an account? <Link to="/login" style={{ color: "#2e7d32", fontWeight: "bold", textDecoration: "none" }}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;
