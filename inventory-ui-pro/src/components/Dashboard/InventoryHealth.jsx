// src/components/Dashboard/InventoryHealth.jsx

function InventoryHealth({
  totalProducts,
  highRiskCount,
  lowStockCount,
}) {
  return (
    <section className="chart-section" id="high-risk-section">
      <h2>📦 Inventory Health (Today)</h2>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div>
          <strong>Total Products:</strong> {totalProducts}
        </div>

        <div style={{ color: "#dc2626", fontWeight: 600 }}>
          High Risk Items: {highRiskCount}
        </div>

        <div style={{ color: "#ca8a04", fontWeight: 600 }}>
          Low Stock Alerts: {lowStockCount}
        </div>
      </div>
    </section>
  );
}

export default InventoryHealth;
