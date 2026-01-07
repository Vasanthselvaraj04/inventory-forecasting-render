// src/components/Dashboard/SalesChart.jsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function SalesChart({ data, salesTrend }) {
  return (
    <section id="sales-section" className="chart-section">
      <h2>
        Sales Trend (Actual) —{" "}
        <span style={{ fontWeight: 600 }}>{salesTrend}</span>
      </h2>

      <p style={{ marginBottom: "10px", color: "#475569", fontSize: "14px" }}>
        {salesTrend}
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} units`, "Quantity"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke="#1976d2"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 7, fill: "#e53935" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

export default SalesChart;
