import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HarithaKarmaSenaView = () => {
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/waste")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWasteData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/waste/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        console.error("Error updating status:", await response.json());
        return;
      }

      const updatedWaste = await response.json();

      setWasteData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, status: updatedWaste.status, collectedDate: updatedWaste.collectedDate } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("hksToken");
    sessionStorage.clear(); // Clear session storage

    // Clear any session-related data
    setWasteData([]);  // Clear waste data
    setSelectedMonth("");  // Reset selected month

    // Redirect to login and replace history (prevents back button navigation)
    navigate("/hks_login", { replace: true });

    // Reload the page to fully clear the session
    window.location.reload();
};

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const filteredData = wasteData.filter((item) => {
    if (item.collectedDate) {
      return new Date(item.collectedDate).toISOString().slice(0, 7) === selectedMonth;
    }
    return false;
  });

  const generatePDF = () => {
    const doc = new jsPDF();

    // Get current date and time
    const currentDateTime = new Date().toLocaleString();

    // Title
    doc.text(`Haritha Karma Sena - Monthly Report (${selectedMonth})`, 20, 10);
    
    // Date and Time below the title
    doc.text(`Generated on: ${currentDateTime}`, 20, 20); 

    const tableColumn = ["User Email", "User", "Phone", "Address", "Amount (kg)", "Status", "Collected Date"];
    const tableRows = wasteData.map((item) => [
      item.email,
      item.username,
      item.phone,
      item.address,
      item.amount,
      item.status,
      item.collectedDate ? new Date(item.collectedDate).toLocaleDateString() : "Not Collected",
    ]);

    // Generate the table, starting after the date
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30, // Start below the date
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 30;
  
    // Calculate total collected and pending
    const totalCollected = wasteData.filter((item) => item.status === "Collected").length;
    const totalPending = wasteData.filter((item) => item.status === "Pending").length;

    // Add total count below the table
    doc.text(`Total Collected: ${totalCollected}`, 14, finalY + 10);
    doc.text(`Total Pending: ${totalPending}`, 14, finalY + 20);

    doc.save(`HarithaKarmaSena_Report_${selectedMonth}.pdf`);
    closePopup();
};


  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={handleLogout} style={{
          position: "absolute", top: "10px", right: "20px", padding: "8px 15px",
          backgroundColor: "#d32f2f", color: "white", border: "none", borderRadius: "5px",
          cursor: "pointer", fontSize: "14px",
      }}>
        Logout
      </button>

      <h1 style={{ textAlign: "center", color: "#2e7d32" }}><u>HARITHA KARMA SENA</u></h1>
      <h2 style={{ textAlign: "center", color: "#2e7d32" }}>Waste Collection Status</h2>

      <button onClick={openPopup} style={{
          display: "block", margin: "20px auto", padding: "10px 15px",
          backgroundColor: "#2e7d32", color: "white", border: "none",
          borderRadius: "5px", cursor: "pointer", fontSize: "16px",
      }}>
        Generate Monthly Report
      </button>

      {isPopupOpen && (
        <div style={{
          position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "white", padding: "20px", borderRadius: "8px", textAlign: "center"
          }}>
            <h3>Select Month for Report</h3>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: "5px", margin: "10px" }} />
            <div>
              <button onClick={generatePDF} style={{
                  padding: "8px 15px", backgroundColor: "#2e7d32", color: "white",
                  border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px"
              }}>
                Generate
              </button>
              <button onClick={closePopup} style={{
                  padding: "8px 15px", backgroundColor: "#d32f2f", color: "white",
                  border: "none", borderRadius: "5px", cursor: "pointer"
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#81c784", color: "white" }}>
            <th>User Email</th>
            <th>User</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Amount (kg)</th>
            <th>Status</th>
            <th>Collected Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wasteData.map((item) => (
            <tr key={item._id} style={{ textAlign: "center" }}>
              <td>{item.email}</td>
              <td>{item.username}</td>
              <td>{item.phone}</td>
              <td>{item.address}</td>
              <td>{item.amount}</td>
              <td style={{ color: item.status === "Collected" ? "green" : "red" }}>{item.status}</td>
              <td>{item.collectedDate ? new Date(item.collectedDate).toLocaleDateString() : "Not Collected"}</td>
              <td>
                <button onClick={() => updateStatus(item._id, "Collected")}
                  style={{ backgroundColor: "#2e7d32", color: "white", padding: "5px", marginRight: "5px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Collected
                </button>
                <button onClick={() => updateStatus(item._id, "Pending")}
                  style={{ backgroundColor: "#d32f2f", color: "white", padding: "5px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Pending
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HarithaKarmaSenaView;
