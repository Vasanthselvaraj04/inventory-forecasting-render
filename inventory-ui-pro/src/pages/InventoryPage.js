import React, { useMemo, useState, useEffect } from "react";
import "../Dashboard.css";
import {
  getDashboardSummary,
  getStockRisk,
} from "../services/dashboardService";

import CSVImport from "../components/common/CSVImport";


function InventoryPage({ isManager = true }) {

  /* ===================== BACKEND STATE ===================== */
  const [summary, setSummary] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===================== UI STATE ===================== */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortLowFirst, setSortLowFirst] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ===================== LOAD FROM BACKEND ===================== */
  useEffect(() => {
    loadInventoryFromBackend();
  }, []);

  const loadInventoryFromBackend = async () => {
    try {
      const summaryData = await getDashboardSummary();
      const stockRiskData = await getStockRisk();

      // USE ONLY BACKEND DATA (NO PLACEHOLDERS)
      const inventoryData = stockRiskData.map((item) => ({
        productId: item.productId,
        stock: item.currentStock,
        avgDailySales: item.avgDailySales,
        daysLeft: item.daysLeft,
        riskLevel: item.riskLevel,
      }));

      setSummary(summaryData);
      setInventory(inventoryData);
    } catch (err) {
      console.error("Failed to load inventory from backend", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== HELPERS ===================== */
  const getStatus = (stock) => {
    if (stock === 0) return "OUT";
    if (stock <= 20) return "LOW";
    return "OK";
  };

  /* ===================== FILTER + SORT ===================== */
  const filteredInventory = useMemo(() => {
    let data = [...inventory];

    if (search) {
      data = data.filter((p) =>
        String(p.productId).includes(search)
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter(
        (p) => getStatus(p.stock) === statusFilter
      );
    }

    if (sortLowFirst) {
      data.sort((a, b) => a.stock - b.stock);
    }

    return data;
  }, [inventory, search, statusFilter, sortLowFirst]);

  /* ===================== SUMMARY COUNTS ===================== */
  const total = inventory.length;
  const low = inventory.filter(p => p.stock > 0 && p.stock <= 20).length;
  const out = inventory.filter(p => p.stock === 0).length;
  const ok = total - low - out;

  const highRiskCount = inventory.filter(
    (p) => (p.riskLevel || "").toUpperCase() === "HIGH"
  ).length;

  const inventoryHealth =
    total > 0
      ? Math.round(((total - highRiskCount) / total) * 100)
      : 100;

  const forecastStatus =
    summary && summary.forecastDemand > total * 0.7
      ? "📈 High Demand Expected"
      : "➖ Stable Demand";

  /* ===================== LOADING ===================== */
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading inventory...</h2>;
  }

  return (
    <div>

{/* ================= INVENTORY HEADER ================= */}
<div className="inventory-header">
  <div>
    <h1>📦 Inventory Management</h1>
    <p>Real-time stock visibility & risk tracking</p>
  </div>

  <div className="inventory-actions">
    <button className="secondary">⬇ Export</button>
    <button className="secondary" onClick={loadInventoryFromBackend}>
      🔄 Refresh
    </button>
  </div>
</div>

{/* ================= STATUS SUMMARY ================= */}
<div className="inventory-summary">
  <div className="summary-card total">📦 Total <b>{total}</b></div>
  <div className="summary-card ok">🟢 OK <b>{ok}</b></div>
  <div className="summary-card low">🟡 Low Stock <b>{low}</b></div>
  <div className="summary-card out">🔴 Out Of Stock <b>{out}</b></div>
</div>

{/* ================= HEALTH | INSIGHT | CSV ================= */}
<div className="triple-summary-row">

  {/* Inventory Health */}
  <div className="summary-card">
    <h3>📦 Inventory Health</h3>
    <p
      style={{
        fontSize: "28px",
        fontWeight: 700,
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
    <small>{highRiskCount} high-risk products</small>
  </div>

  {/* Business Insight */}
  <div className="summary-card">
    <h3>📊 Business Insight</h3>
    <p style={{ fontSize: "22px", fontWeight: 700 }}>
      {forecastStatus}
    </p>
    <small>
      {highRiskCount > 0
        ? "Immediate replenishment recommended"
        : "Inventory levels are stable"}
    </small>
  </div>

  {/* Import Inventory CSV */}
  <div className="summary-card">
    <CSVImport />
  </div>

</div>

{/* ================= SEARCH | FILTER | SORT ================= */}
<div className="inventory-controls">
  <input
    placeholder="Search by Product ID"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="ALL">All</option>
    <option value="OK">OK</option>
    <option value="LOW">LOW</option>
    <option value="OUT">OUT</option>
  </select>

  <button
    className={`sort-btn ${sortLowFirst ? "active" : ""}`}
    onClick={() => setSortLowFirst(!sortLowFirst)}
  >
    Sort by Stock {sortLowFirst ? "🔽" : "🔼"}
  </button>
</div>

{/* ================= INVENTORY TABLE (DB-RICH) ================= */}
<table className="data-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Stock</th>
      <th>Avg Daily Sales</th>
      <th>Days Left</th>
      <th>Risk Level</th>
      <th>Status</th>
      {isManager && <th>Action</th>}
    </tr>
  </thead>

  <tbody>
    {filteredInventory.map((p) => {
      const status = getStatus(p.stock);

      return (
        <tr
          key={p.productId}
          onClick={() => setSelectedProduct(p)}
        >
          <td>{p.productId}</td>
          <td>{p.stock}</td>
          <td>{p.avgDailySales?.toFixed(2)}</td>
          <td>{Math.ceil(p.daysLeft)}</td>
          <td
            style={{
              fontWeight: 600,
              color:
                p.riskLevel === "HIGH"
                  ? "#dc2626"
                  : p.riskLevel === "MEDIUM"
                  ? "#ca8a04"
                  : "#16a34a",
            }}
          >
            {p.riskLevel}
          </td>
          <td>
            <span className={`status-badge status-${status.toLowerCase()}`}>
              {status}
            </span>
          </td>
          {isManager && (
            <td>
              <button className="edit-btn">Edit</button>
            </td>
          )}
        </tr>
      );
    })}
  </tbody>
</table>

{/* ================= DETAILS PANEL ================= */}
{selectedProduct && (
  <div className="details-panel">
    <h3>📊 Product Details</h3>
    <p><b>ID:</b> {selectedProduct.productId}</p>
    <p><b>Stock:</b> {selectedProduct.stock}</p>
    <p><b>Avg Sales:</b> {selectedProduct.avgDailySales?.toFixed(2)}</p>
    <p><b>Days Left:</b> {Math.ceil(selectedProduct.daysLeft)}</p>
    <p><b>Risk:</b> {selectedProduct.riskLevel}</p>

    <button onClick={() => setSelectedProduct(null)}>
      Close
    </button>
  </div>
)}

    </div>
  );
}

export default InventoryPage;
