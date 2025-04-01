import React, { useState } from "react";
import jsPDF from "jspdf";
import UserNavbar from "./UserNavbar";

const PlasticWasteCalculator = () => {
  const [wasteData, setWasteData] = useState({
    bottle: 0,
    bag: 0,
    wrapper: 0,
    container: 0,
  });

  const averageWeights = {
    bottle: 25, // grams per plastic bottle
    bag: 5,     // grams per plastic bag
    wrapper: 10, // grams per plastic wrapper
    container: 50, // grams per plastic container
  };

  const handleChange = (e) => {
    setWasteData({ ...wasteData, [e.target.name]: Number(e.target.value) });
  };

  const calculateTotalWaste = () => {
    let totalWasteGrams = Object.keys(wasteData).reduce(
      (total, key) => total + wasteData[key] * averageWeights[key],
      0
    );
    let totalWasteKg = totalWasteGrams / 1000; // Convert grams to kg
    return { totalWasteGrams, totalWasteKg };
  };

  const { totalWasteGrams, totalWasteKg } = calculateTotalWaste();

  const handleClear = () => {
    setWasteData({ bottle: 0, bag: 0, wrapper: 0, container: 0 });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Plastic Waste Report", 20, 20);

    doc.setFontSize(12);
    doc.text("Sort Smart", 20, 30);
    doc.line(20, 32, 190, 32); // Divider line

    doc.setFont("helvetica", "normal");
    let yPos = 45;
    
    Object.keys(wasteData).forEach((type) => {
      doc.text(
        `${type.charAt(0).toUpperCase() + type.slice(1)}: ${wasteData[type]} items`,
        20,
        yPos
      );
      yPos += 10;
    });

    doc.text(`Total Plastic Waste: ${totalWasteGrams} grams (${totalWasteKg.toFixed(2)} kg)`, 20, yPos + 10);
    
    let recommendation = "Try reducing your plastic usage!";
    if (totalWasteKg > 5) {
      recommendation = "High waste level! Consider recycling and reducing waste.";
    } else if (totalWasteKg < 1) {
      recommendation = "Great job! Keep minimizing plastic waste.";
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(`Recommendation: ${recommendation}`, 20, yPos + 20);
    
    doc.save("Plastic_Waste_Report.pdf");
  };

  // Function to submit waste data to the backend
  const submitWasteData = async () => {
    const username = localStorage.getItem("userName"); // Retrieve username from localStorage
    const email = localStorage.getItem("email"); // Retrieve username from localStorage
    const phone = localStorage.getItem("phone"); // Retrieve username from localStorage
    const address = localStorage.getItem("address"); // Retrieve username from localStorage

    if (!username) {
      alert("User is not logged in! Please log in again.");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,username,phone,address, amount: totalWasteKg }),
      });

      alert("Waste data submitted successfully!");
    } catch (error) {
      console.error("Error submitting waste data:", error);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div style={styles.page}> {/* Page background */}
        <div style={styles.container}>
          <h2 style={styles.title}>Plastic Waste Calculator</h2>
          <p style={styles.slogan}>Sort Smart</p>

          <div style={styles.form}>
            {Object.keys(wasteData).map((type) => (
              <div key={type} style={styles.inputGroup}>
                <label style={styles.label}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}:
                </label>
                <input
                  type="number"
                  name={type}
                  value={wasteData[type]}
                  onChange={handleChange}
                  style={styles.input}
                  min="0"
                />
              </div>
            ))}
          </div>

          <div style={styles.result}>
            <h3>Total Plastic Waste:</h3>
            <p><strong>{totalWasteGrams} grams</strong> ({totalWasteKg.toFixed(2)} kg)</p>
          </div>

          <button onClick={handleClear} style={styles.clearButton}>Clear</button>
          <button onClick={generatePDF} style={styles.reportButton}>Generate Report</button>
          <button onClick={submitWasteData} style={styles.submitButton}>Submit Waste Data</button>
        </div>
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  page: {
    backgroundColor: "#dcedc8", // Light green background
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    textAlign: "center",
    padding: "50px",
    maxWidth: "400px",
    backgroundColor: "#E8F5E9",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  title: {
    color: "#2e7d32",
    fontSize: "34px",
    fontWeight: "bold",
  },
  slogan: {
    fontSize: "25px",
    color: "#388e3c",
    fontStyle: "italic",
  },
  form: {
    margin: "20px 0",
  },
  inputGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    color: "#388e3c",
  },
  input: {
    width: "60px",
    padding: "5px",
    border: "1px solid #81c784",
    borderRadius: "5px",
    textAlign: "center",
  },
  result: {
    marginTop: "15px",
    fontSize: "16px",
    color: "#2e7d32",
  },
  clearButton: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "5px",
  },
  reportButton: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "5px",
  },
  submitButton: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#1976D2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default PlasticWasteCalculator;
