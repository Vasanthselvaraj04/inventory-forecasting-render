import { useState } from "react";
import "./ReportsPage.css";
function ReportsPage({ stockRisk, exportToCSV, exportToPDF, isManager }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FILTER LOGIC ================= */
  const filteredStockRisk = stockRisk.filter((item) => {
    if (!item.lastUpdated) return true;

    const itemDate = new Date(item.lastUpdated);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && itemDate < from) return false;
    if (to && itemDate > to) return false;

    return true;
  });

  /* ================= SUMMARY CALCULATIONS ================= */
  const totalItems = filteredStockRisk.length;

  const highRiskCount = filteredStockRisk.filter(
    (item) => (item.riskLevel || "").toUpperCase() === "HIGH"
  ).length;

  const lowStockCount = filteredStockRisk.filter(
    (item) => item.daysLeft !== undefined && item.daysLeft <= 3
  ).length;

  const inventoryHealth =
    totalItems === 0
      ? 100
      : Math.round(
          ((totalItems - highRiskCount) / totalItems) * 100
        );

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">
      <h1>Reports</h1>

      <p style={{ marginBottom: "16px", color: "#64748b" }}>
        Inventory risk and stock analysis reports.
      </p>

      {/* ===== SUMMARY HEADER ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="summary-card">
          <h3>Total Items</h3>
          <p>{totalItems}</p>
        </div>

        <div className="summary-card">
          <h3>High Risk</h3>
          <p style={{ color: "#dc2626" }}>{highRiskCount}</p>
        </div>

        <div className="summary-card">
          <h3>Low Stock</h3>
          <p style={{ color: "#ca8a04" }}>{lowStockCount}</p>
        </div>

        <div className="summary-card">
          <h3>Inventory Health</h3>
          <p
            style={{
              color:
                inventoryHealth >= 80
                  ? "#16a34a"
                  : inventoryHealth >= 50
                  ? "#ca8a04"
                  : "#dc2626",
            }}
          >
            {inventoryHealth}%
          </p>
        </div>
      </div>

      {/* ===== DATE FILTERS ===== */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={{ fontSize: "13px" }}>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px" }}>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* ===== EXPORT (MANAGER ONLY) ===== */}
      {isManager && (
        <div style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
          <button className="sidebar-btn" onClick={exportToCSV}>
            Export CSV
          </button>

          <button className="sidebar-btn" onClick={exportToPDF}>
            Export PDF
          </button>
        </div>
      )}

      {/* ===== TABLE ===== */}
      {filteredStockRisk.length === 0 ? (
        <p>No report data available.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Current Stock</th>
              <th>Avg Daily Sales</th>
              <th>Days Left</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockRisk.map((item, index) => (
              <tr key={index}>
                <td>{item.productId}</td>
                <td>{item.currentStock}</td>
                <td>{item.avgDailySales}</td>
                <td>{Math.ceil(item.daysLeft)}</td>
                <td>{item.riskLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReportsPage;
