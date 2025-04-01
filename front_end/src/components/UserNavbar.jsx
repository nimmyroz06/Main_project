import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserNavbar = () => {
  const [UserName, setUserName] = useState(null);
  const [adminName, setAdminName] = useState(null); // Track admin login state

  useEffect(() => {
    // Check if the user is logged in
    const storedUser = localStorage.getItem("userName");
    const storedAdmin = localStorage.getItem("adminName");
    const token = localStorage.getItem("token");
    const adminLoggedIn = localStorage.getItem("isAdmin");

    if (storedUser && token) {
      setUserName(storedUser);
    } else if (adminLoggedIn && storedAdmin) {
      setAdminName(storedAdmin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    localStorage.removeItem("isAdmin"); // Remove admin login state

    setUserName(null);
    setAdminName(null);

    // Use replace to prevent going back
    window.location.replace("/"); 
};


  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          {/* Welcome Message */}
          <Link style={styles.brand} to="/">
            <h2>
              <b>Welcome {adminName ? adminName : UserName ? UserName : "Guest"}</b>
            </h2>
          </Link>

          {/* Toggle Button for Sliding Menu */}
          <button
            style={styles.toggleButton}
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          {/* Offcanvas Sliding Menu */}
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            style={styles.offcanvas}
          >
            <div style={styles.offcanvasHeader}>
              <h5 id="offcanvasNavbarLabel"><b>Select</b></h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div style={styles.offcanvasBody}>
              <ul style={styles.menu}>
                <li>
                  <Link style={styles.menuItem} to="/">Home</Link>
                </li>

                {/* Show only if the user is NOT logged in */}
                {!adminName && !UserName && (
                  <>
                    <li>
                      <Link style={styles.menuItem} to="/login">User Login</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/signup">Signup</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/adminlogin">Admin Login</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/hks_signup">Haritha Karma Sena Signup</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/hks_login">Haritha Karma Sena Login</Link>
                    </li>
                  </>
                )}

                {/* Show only if the user is logged in */}
                {UserName && (
                  <>
                    <li>
                      <Link style={styles.menuItem} to="/profile">Your Profile</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/calculator">Calculator</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/quiz">Quiz</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/upload">Upload</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/recycle">Recycling Centers</Link>
                    </li>
                    <li>
                      <Link style={styles.menuItem} to="/view">Know Your Status</Link>
                    </li>
                    <li>
                      <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

// Styles (Green-Themed)
const styles = {
  navbar: {
    backgroundColor: "#2e7d32",
    padding: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  brand: {
    color: "white",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "bold",
    marginLeft: "20px",
  },
  toggleButton: {
    backgroundColor: "#4CAF50",
    border: "none",
    fontSize: "24px",
    color: "white",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    marginRight: "20px",
  },
  offcanvas: {
    backgroundColor: "#E8F5E9",
    width: "250px",
    padding: "15px",
  },
  offcanvasHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
  },
  offcanvasBody: {
    paddingTop: "10px",
  },
  menu: {
    listStyleType: "none",
    padding: 0,
  },
  menuItem: {
    display: "block",
    padding: "10px",
    fontSize: "18px",
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "bold",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
  },
  logoutButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "10px",
    fontSize: "18px",
    width: "100%",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default UserNavbar;
