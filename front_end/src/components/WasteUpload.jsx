import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "./UserNavbar";

const WasteUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [recyclingCenters, setRecyclingCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setRecyclingCenters([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/app", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.prediction);

      if (response.data.prediction === "recyclable") {
        const locationResponse = await axios.get("http://127.0.0.1:5000/api/recycling-centers");
        setRecyclingCenters(locationResponse.data.centers);
      }

      setTimeout(() => {
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      console.error("Error processing request:", error);
      alert("Failed to classify plastic waste. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.title}>♻️ Plastic Waste Classifier</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={styles.input} />

          {imagePreview && (
            <div style={styles.previewContainer}>
              <p style={styles.previewText}>Image Preview:</p>
              <img src={imagePreview} alt="Preview" style={styles.previewImage} />
            </div>
          )}

          <button onClick={handleUpload} style={styles.button} disabled={loading}>
            {loading ? "Processing..." : "Upload & Analyze"}
          </button>

          {result && (
            <div style={styles.result}>
              <h3>Classification Result: <span style={{ color: "#2e7d32" }}>{result}</span></h3>

              {/* 🚀 New Button to Navigate to Recycling Centers */}
              <button 
                onClick={() => navigate("/recycle")} 
                style={styles.button}
              >
                Find Recycling Centers
              </button>
            </div>
          )}

          {recyclingCenters.length > 0 && (
            <div style={styles.centers}>
              <h3>Nearby Recycling Centers:</h3>
              <ul>
                {recyclingCenters.map((center, index) => (
                  <li key={index}>{center}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ No CSS Changes
const styles = {
  page: {
    backgroundColor: "#dcedc8",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    textAlign: "center",
    padding: "30px",
    width: "600px",
    backgroundColor: "#E8F5E9",
    borderRadius: "15px",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#2e7d32",
    fontWeight: "bold",
  },
  input: {
    marginBottom: "15px",
    fontSize: "18px",
  },
  previewContainer: {
    marginTop: "10px",
    textAlign: "center",
  },
  previewText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#388e3c",
  },
  previewImage: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #388e3c",
    marginTop: "5px",
  },
  button: {
    padding: "12px 18px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "15px",
  },
  result: {
    marginTop: "20px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  centers: {
    marginTop: "20px",
    textAlign: "left",
    fontSize: "18px",
  },
};

export default WasteUpload;
