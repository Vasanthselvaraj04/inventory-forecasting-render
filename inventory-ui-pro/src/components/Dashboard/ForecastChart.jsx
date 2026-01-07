// src/components/Dashboard/ForecastChart.jsx

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

function ForecastChart({ data }) {
  return (
    <section id="forecast-section" className="chart-section">
      <h2>Forecast Demand</h2>

      <p style={{ marginBottom: "10px", color: "#475569", fontSize: "14px" }}>
        Forecast based on recent sales patterns
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="days" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} units sold`, "Sales"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke="#e53935"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

export default ForecastChart;
