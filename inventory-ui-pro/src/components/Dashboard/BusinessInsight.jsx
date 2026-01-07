// src/components/Dashboard/BusinessInsight.jsx

function BusinessInsight({ forecastStatus, actionRequiredCount }) {
  return (
    <section className="chart-section">
      <h2>📊 Business Insight</h2>

      <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Based on recent sales trends and current inventory levels, the system
        predicts
        <strong> {forecastStatus}</strong>.
        {actionRequiredCount > 0
          ? " Immediate replenishment is recommended to avoid stock-outs."
          : " Inventory levels are sufficient for the upcoming period."}
      </p>
    </section>
  );
}

export default BusinessInsight;
