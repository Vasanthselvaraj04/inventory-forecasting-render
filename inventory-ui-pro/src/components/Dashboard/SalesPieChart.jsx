import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ca8a04",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

function SalesPieChart({ recentSales = [] }) {
  // 🔹 aggregate quantity by productId
  const salesMap = {};

  recentSales.forEach((sale) => {
    if (!salesMap[sale.productId]) {
      salesMap[sale.productId] = 0;
    }
    salesMap[sale.productId] += Number(sale.quantitySold || 0);
  });

  const pieData = Object.keys(salesMap).map((productId) => ({
    name: `Product ${productId}`,
    value: salesMap[productId],
  }));

  if (pieData.length === 0) {
    return <p style={{ color: "#64748b" }}>No data for pie chart</p>;
  }

  return (
    <div className="chart-section">
      <h2>📊 Sales Distribution</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {pieData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(value) => [`${value} units`, "Sold"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesPieChart;
