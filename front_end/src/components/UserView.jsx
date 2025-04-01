import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";
import jsPDF from "jspdf";
import "jspdf-autotable";

const UserView = () => {
  const [wasteStatus, setWasteStatus] = useState([]);
  const [totalWaste, setTotalWaste] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("email");
    if (!storedUsername) {
      console.error("No username found in localStorage");
      return;
    }

    const fetchWasteStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/user/waste-status?email=${storedUsername}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          return;
        }

        const data = await response.json();
        setWasteStatus(data);

        // Calculate total waste collected
        const total = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        setTotalWaste(total);
      } catch (error) {
        console.error("Error fetching waste status:", error);
      }
    };

    fetchWasteStatus();
  }, []);

  const generatePDF = (filterType) => {
    const doc = new jsPDF();
    
    doc.text("Waste Collection Report", 20, 10);

    // Filter data based on the selected time range
    let filteredData = [...wasteStatus];

    const today = new Date();
    if (filterType === "daily") {
      filteredData = wasteStatus.filter(item => new Date(item.collectedDate).toDateString() === today.toDateString());
    } else if (filterType === "weekly") {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      filteredData = wasteStatus.filter(item => new Date(item.collectedDate) >= lastWeek);
    } else if (filterType === "monthly") {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      filteredData = wasteStatus.filter(item => new Date(item.collectedDate) >= lastMonth);
    } else if (filterType === "yearly") {
      const lastYear = new Date();
      lastYear.setFullYear(today.getFullYear() - 1);
      filteredData = wasteStatus.filter(item => new Date(item.collectedDate) >= lastYear);
    }

    // Create table data
    const tableData = filteredData.map((item, index) => [
      index + 1,
      item.amount + " kg",
      item.status,
      item.collectedDate ? item.collectedDate.replace("T", " ") : "Not Collected",
    ]);

    autoTable(doc, {
      head: [["#", "Waste Amount", "Status", "Collected Date"]],
      body: tableData,
    });

    doc.save(`waste_report_${filterType}.pdf`);
  };

  return (
    <div>
      <UserNavbar />
      <br /><br /><br />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Waste Status</h2>
          <button style={styles.totalWasteButton}>
            Total Waste: {totalWaste} kg
          </button>
        </div>

        <div style={styles.downloadButtons}>
          <button style={styles.downloadButton} onClick={() => generatePDF("daily")}>Daily Report</button>
          <button style={styles.downloadButton} onClick={() => generatePDF("weekly")}>Weekly Report</button>
          <button style={styles.downloadButton} onClick={() => generatePDF("monthly")}>Monthly Report</button>
          <button style={styles.downloadButton} onClick={() => generatePDF("yearly")}>Yearly Report</button>
        </div>

        {wasteStatus.length > 0 ? (
          <ul style={styles.list}>
            {wasteStatus.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <p><strong>Waste Amount:</strong> {item.amount} kg</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p>
                  <strong>Collected On:</strong>{" "}
                  {item.collectedDate ? item.collectedDate.replace("T", " ") : "Not Collected"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noData}>No waste status available.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#E8F5E9",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2e7d32",
  },
  totalWasteButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  downloadButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "15px",
  },
  downloadButton: {
    backgroundColor: "#388e3c",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#81c784",
    padding: "15px",
    borderRadius: "8px",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "left",
  },
  noData: {
    color: "red",
    fontSize: "18px",
  },
};

export default UserView;
