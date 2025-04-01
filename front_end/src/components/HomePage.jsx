import React from "react";
import { Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const HomePage = () => {
  return (
    <div>
      <UserNavbar/>
    
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      backgroundColor: "#dcedc8"
    }}>
      <h1 style={{
        color: "#2e7d32",
        fontSize: "50px", 
        fontWeight: "bold",
        marginBottom: "5px",
        textAlign: "center",
        maxWidth: "90%" 
      }}>
         Plastic Waste Calculator & Recycling Guide ♻️
      </h1>
      <h3 style={{
        fontSize: "30px",
        color: "#388e3c",
        marginBottom: "20px",
        fontStyle: "italic"
      }}>
        Sort Smart, Recycle Right!
      </h3>
      <div>
        <Link to="/login">
          <button style={{
            padding: "14px 28px",
            margin: "10px",
            backgroundColor: "#43a047",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "20px"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1b5e20"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#2e7d32"}>
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button style={{
            padding: "14px 28px",
            margin: "10px",
            backgroundColor: "#43a047",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "20px"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1b5e20"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#2e7d32"}>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default HomePage;
