// src/components/Dashboard/StockRiskTable.jsx

function StockRiskTable({ stockRisk = [], getTrendArrow }) {
  return (
    <section id="stock-risk-section">
      <h2>Stock Risk & Prediction</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Avg Daily Sales</th>
            <th>Trend</th>
            <th>Days Left</th>
            <th>Risk</th>
          </tr>
        </thead>

        <tbody>
          {stockRisk.map((r, idx) => {
            /* ===============================
               🔒 HARD STATIC VALUES (FINAL)
               =============================== */
            const avgDailySales = 5;   // ✅ STATIC
            const daysLeft = 30;       // ✅ STATIC

            return (
              <tr
                key={idx}
                className={`risk-${(r.riskLevel || "low").toLowerCase()}`}
              >
                <td>{r.productId}</td>

                <td>{r.currentStock}</td>

                {/* Avg Daily Sales */}
                <td>{avgDailySales}</td>

                {/* Trend */}
                <td style={{ fontSize: "18px" }}>
                  {getTrendArrow(avgDailySales)}
                </td>

                {/* Days Left */}
                <td>{daysLeft}</td>

                {/* Risk */}
                <td style={{ fontWeight: 600 }}>
                  {r.riskLevel === "HIGH" && (
                    <span style={{ color: "#dc2626" }}>⚠ HIGH</span>
                  )}
                  {r.riskLevel === "MEDIUM" && (
                    <span style={{ color: "#ca8a04" }}>⚠ MEDIUM</span>
                  )}
                  {r.riskLevel === "LOW" && (
                    <span style={{ color: "#166534" }}>● LOW</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default StockRiskTable;
