import React from "react";
import { useDriverDashboardC } from "../context/DriverDashboardContext."; // Adjust the import path

const DriverDashboardTest = () => {
  const {
    earnings,
    totalDistance,
    overallRating,
    status,
    isLoading,
    refreshData,
    toggleAvailability,
    isAvailable,
  } = useDriverDashboardC();

  return (
    <div style={styles.container}>
      <h1>Driver Dashboard Context Test Page</h1>

      <div style={styles.section}>
        <h2>GET Endpoints Test</h2>

        <button onClick={refreshData} style={styles.button}>
          Refresh All Data
        </button>

        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          <>
            {/* Earnings Section */}
            <div style={styles.dataCard}>
              <h3>/api/driver/:id/earnings</h3>
              <div style={styles.dataRow}>
                {Object.entries(earnings).map(([key, value]) => (
                  <div key={key} style={styles.dataItem}>
                    <strong>{key}:</strong> ${value.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Distance Section */}
            <div style={styles.dataCard}>
              <h3>/api/driver/:id/total-distance</h3>
              <div style={styles.dataItem}>
                <strong>Total Distance:</strong> {totalDistance} km
              </div>
            </div>

            {/* Rating Section */}
            <div style={styles.dataCard}>
              <h3>/api/driver/:id/rating</h3>
              <div style={styles.dataItem}>
                <strong>Overall Rating:</strong> {overallRating}/5
              </div>
            </div>

            {/* Status Section */}
            <div style={styles.dataCard}>
              <h3>/api/driver/:id/status</h3>
              <div style={styles.dataRow}>
                <div style={styles.dataItem}>
                  <strong>Current Status:</strong> {status}
                </div>
                <button
                  onClick={toggleAvailability}
                  style={{
                    ...styles.button,
                    backgroundColor: isAvailable ? "#ff4444" : "#4CAF50",
                  }}
                >
                  {isAvailable ? "Go Offline" : "Go Online"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  dataCard: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    margin: "10px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
  },
  dataItem: {
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    margin: "5px 0",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
    fontSize: "14px",
  },
};

export default DriverDashboardTest;
