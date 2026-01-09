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
            const stock = Number(r.currentStock ?? 0);

            /* ===============================
               FIX 1: DERIVE AVG DAILY SALES
               =============================== */
            let avgDailySales =
              Number.isFinite(r.avgDailySales) && r.avgDailySales > 0
                ? r.avgDailySales
                : stock > 0
                ? Math.max(1, stock / 30) // 🔥 fallback logic
                : 0;

            /* ===============================
               FIX 2: DERIVE DAYS LEFT
               =============================== */
            let daysLeft =
              Number.isFinite(r.daysLeft) && r.daysLeft > 0
                ? r.daysLeft
                : avgDailySales > 0
                ? stock / avgDailySales
                : 0;

            return (
              <tr
                key={idx}
                className={`risk-${(r.riskLevel || "low").toLowerCase()}`}
              >
                <td>{r.productId}</td>

                <td>{stock}</td>

                {/* Avg Daily Sales */}
                <td>{avgDailySales.toFixed(2)}</td>

                {/* Trend */}
                <td style={{ fontSize: "18px" }}>
                  {avgDailySales > 0 ? getTrendArrow(avgDailySales) : "—"}
                </td>

                {/* Days Left */}
                <td>{Math.ceil(daysLeft)}</td>

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
