import SummaryCard from "./SummaryCard";

export default function SummaryCards({ summary }) {
  if (!summary || typeof summary !== "object") {
    return (
      <div className="summary-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="summary-card">Loading...</div>
        ))}
      </div>
    );
  }

  const {
    totalProducts = 0,
    totalSales = 0,
    lowStockCount = 0,
    forecastDemand = 0,

    // 👇 optional / future-ready fields
    totalOrders = totalSales,          // placeholder
    highRiskItems = lowStockCount,     // placeholder
    avgDailySales = Math.round(totalSales / 7),
    outOfStock = 0,
  } = summary;

  return (
    <div className="summary-grid">
      {/* ===== ROW 1 ===== */}
      <SummaryCard
        title="Total Products"
        value={totalProducts}
        icon="📦"
        color="#2563eb"
      />

      <SummaryCard
        title="Total Sales"
        value={totalSales}
        icon="💰"
        color="#16a34a"
      />

      <SummaryCard
        title="Low Stock Alerts"
        value={lowStockCount}
        icon="⚠"
        color="#dc2626"
      />

      <SummaryCard
        title="Forecast Demand"
        value={forecastDemand}
        icon="📈"
        color="#ca8a04"
      />

      {/* ===== ROW 2 (NEW) ===== */}
      <SummaryCard
        title="Total Orders"
        value={totalOrders}
        icon="🧾"
        color="#0ea5e9"
      />

      <SummaryCard
        title="High Risk Items"
        value={highRiskItems}
        icon="🔥"
        color="#be123c"
      />

      <SummaryCard
        title="Avg Daily Sales"
        value={avgDailySales}
        icon="📊"
        color="#22c55e"
      />

      <SummaryCard
        title="Out of Stock"
        value={outOfStock}
        icon="❌"
        color="#64748b"
      />
    </div>
  );
}
