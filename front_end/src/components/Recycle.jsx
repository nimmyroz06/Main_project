import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import UserNavbar from "./UserNavbar";

const Recycle = () => {
  const [bins, setBins] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        console.log("📡 Fetching bins for:", latitude, longitude);
        const response = await fetch(
          `http://localhost:5000/nearest-bins?latitude=${latitude}&longitude=${longitude}`
        );
        const data = await response.json();
        console.log("🔄 API Response:", data);

        if (data && Array.isArray(data)) {
          setBins(data);
        } else {
          console.warn("⚠️ No bins found in API response.");
          setBins([]);
        }

        // ✅ Prevent multiple map initializations
        if (!map) {
          const leafletMap = L.map("map").setView([latitude, longitude], 13);
          setMap(leafletMap);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMap);
          L.marker([latitude, longitude]).addTo(leafletMap).bindPopup("📍 You are here").openPopup();
        }
      } catch (error) {
        console.error("❌ Error fetching recycling bins:", error);
      }
    });
  }, []); // ✅ Empty dependency array to run only once

  useEffect(() => {
    if (map && bins.length > 0) {
      console.log("📍 Adding bins to the map:", bins);

      bins.forEach((bin) => {
        L.marker([bin.location.coordinates[1], bin.location.coordinates[0]])
          .addTo(map)
          .bindPopup(`♻️ ${bin.name}`);
      });
    }
  }, [bins]); // ✅ Run only when `bins` update

  return <div>
    <UserNavbar/>
    <div id="map" style={{ width: "100%", height: "800px" }}></div>
    </div>
};

export default Recycle;
