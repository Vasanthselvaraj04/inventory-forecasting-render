// src/components/Dashboard/HighRiskTable.jsx

function HighRiskTable({ items, isManager }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="chart-section">
      <h2>⚠ High Risk Products</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Days Left</th>
            <th>Risk</th>
            <th>Suggested Action</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0, 5).map((item, idx) => (
            <tr key={idx} className="risk-high">
              <td>{item.productId}</td>
              <td>{Math.ceil(item.daysLeft)}</td>
              <td>{item.riskLevel}</td>
              <td>
                {isManager ? (
                  <button
                    className="sidebar-btn"
                    style={{ padding: "4px 10px", fontSize: "12px" }}
                  >
                    Reorder
                  </button>
                ) : (
                  <span style={{ color: "#6b7280", fontStyle: "italic" }}>
                    Manager only
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default HighRiskTable;
