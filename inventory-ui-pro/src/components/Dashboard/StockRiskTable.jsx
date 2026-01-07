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
            <th>Avg Sales</th>
            <th>Trend</th>
            <th>Days Left</th>
            <th>Risk</th>
          </tr>
        </thead>

        <tbody>
          {stockRisk.map((r, idx) => {
            const avgSales = Number.isFinite(r.avgDailySales)
              ? r.avgDailySales.toFixed(2)
              : "-";

            const daysLeft = Number.isFinite(r.daysLeft)
              ? Math.ceil(r.daysLeft)
              : "-";

            return (
              <tr
                key={idx}
                className={`risk-${(r.riskLevel || "low").toLowerCase()}`}
              >
                <td>{r.productId}</td>
                <td>{r.currentStock}</td>
                <td>{avgSales}</td>

                <td style={{ fontSize: "18px" }}>
                  {Number.isFinite(r.avgDailySales)
                    ? getTrendArrow(r.avgDailySales)
                    : "—"}
                </td>

                <td>{daysLeft}</td>

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
