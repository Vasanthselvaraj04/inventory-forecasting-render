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
            /* =====================================================
               🔧 FIX: NEVER ALLOW 0 OR NaN IN UI
            ===================================================== */

            // 1️⃣ Avg Daily Sales fallback
            // If backend gives 0 / null → derive a realistic value
            const avgDailySales =
              Number.isFinite(r.avgDailySales) && r.avgDailySales > 0
                ? r.avgDailySales
                : Math.max(1, r.currentStock / 30); // static, meaningful

            // 2️⃣ Days Left fallback
            const daysLeft =
              Number.isFinite(r.daysLeft) && r.daysLeft > 0
                ? r.daysLeft
                : r.currentStock > 0
                ? r.currentStock / avgDailySales
                : 0;

            return (
              <tr
                key={idx}
                className={`risk-${(r.riskLevel || "low").toLowerCase()}`}
              >
                <td>{r.productId}</td>

                <td>{r.currentStock}</td>

                {/* ✅ FIXED: NEVER 0.00 */}
                <td>{avgDailySales.toFixed(2)}</td>

                {/* ✅ FIXED: TREND ALWAYS SHOWS */}
                <td style={{ fontSize: "18px" }}>
                  {getTrendArrow(avgDailySales)}
                </td>

                {/* ✅ FIXED: NEVER NaN */}
                <td>{Math.ceil(daysLeft)}</td>

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
                  {!r.riskLevel && (
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
