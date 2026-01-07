function SummaryCard({ title, value, icon, color }) {
  return (
    <div
      className="summary-card"
      style={{
        borderLeft: `6px solid ${color}`,
        padding: "18px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{ fontSize: "28px" }}>{icon}</span>
        <div>
          <h3 style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
