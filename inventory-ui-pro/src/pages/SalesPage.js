import React, { useState } from "react";
import "../Dashboard.css";

function SalesPage({ recentSales = [] }) {
  /* ===================== STATE ===================== */
  const [sales, setSales] = useState(recentSales);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ===================== FILE SELECT ===================== */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setError("");
    setSuccessMessage("");
  };

  /* ===================== FRONTEND CSV IMPORT ===================== */
  const handleImportCSV = () => {
    if (!selectedFile) {
      setError("Please choose a CSV file first");
      return;
    }

    setImporting(true);
    setError("");
    setSuccessMessage("");

    const reader = new FileReader();

    reader.onload = () => {
      const lines = reader.result
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      // skip header
      const dataLines = lines.slice(1);

      const importedSales = dataLines.map((line, index) => {
        const values = line.split(",");

        return {
          saleId: sales.length + index + 1, // frontend-only
          productId: values[0]?.trim() || "N/A",
          quantitySold: values[1]?.trim() || "0",
          saleDate: values[2]?.trim() || "N/A",
        };
      });

      // ✅ append imported sales
      setSales((prev) => [...prev, ...importedSales]);

      setImporting(false);
      setSelectedFile(null);
      setSuccessMessage("✅ Sales imported successfully");
    };

    reader.onerror = () => {
      setImporting(false);
      setError("Failed to read CSV file");
    };

    reader.readAsText(selectedFile);
  };

  /* ===================== UI ===================== */
  return (
    <div>
      <h1>💰 Sales</h1>

      <p style={{ marginBottom: "16px", color: "#64748b" }}>
        Recent sales transactions.
      </p>

      {/* ===================== IMPORT CARD ===================== */}
      <div
        style={{
          background: "#ffffff",
          padding: "18px",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: "16px" }}>
          Import Sales (CSV)
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={importing}
          />

          <button
            className="sidebar-btn"
            onClick={handleImportCSV}
            disabled={importing}
            style={{ opacity: importing ? 0.6 : 1 }}
          >
            {importing ? "Importing..." : "Import CSV"}
          </button>

          {selectedFile && (
            <span style={{ fontSize: "13px", color: "#475569" }}>
              📄 {selectedFile.name}
            </span>
          )}
        </div>

        {/* ===== MESSAGES ===== */}
        {error && <div style={{ color: "#dc2626" }}>{error}</div>}

        {successMessage && (
          <div style={{ color: "#16a34a", fontWeight: 600 }}>
            {successMessage}
          </div>
        )}
      </div>

      {/* ===================== SALES TABLE ===================== */}
      {sales.length === 0 ? (
        <p>No sales data available.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Product ID</th>
              <th>Quantity Sold</th>
              <th>Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.saleId}>
                <td>{sale.saleId}</td>
                <td>{sale.productId}</td>
                <td>{sale.quantitySold}</td>
                <td>{sale.saleDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesPage;
