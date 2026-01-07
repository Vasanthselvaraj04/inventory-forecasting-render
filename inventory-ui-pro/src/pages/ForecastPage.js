import React, { useEffect, useMemo, useState } from "react";
import "../Dashboard.css";
import { getAllForecasts } from "../services/forecastService";

function ForecastPage() {
  /* ===================== STATE ===================== */
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STEP 1: SUMMARY
  const [forecastSummary, setForecastSummary] = useState({
    total: 0,
    highDemand: 0,
    critical: 0,
    stable: 0,
  });

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    loadForecasts();
  }, []);

  const loadForecasts = async () => {
    try {
      const data = await getAllForecasts();
      setForecasts(data);
      calculateForecastSummary(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load forecast data");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== STEP 1: SUMMARY ===================== */
  const calculateForecastSummary = (data) => {
  const validForecasts = data.filter(
    (f) => f.predictedQuantity > 0
  );

  const total = data.length;
  const withData = validForecasts.length;

  let highDemand = 0;
  let critical = 0;

  validForecasts.forEach((f) => {
    if (f.predictedQuantity >= 20) highDemand++;
    if (f.predictedQuantity > (f.currentStock ?? 0)) critical++;
  });

  setForecastSummary({
    total,
    highDemand,
    critical,
    stable: withData - critical,
  });
};


  /* ===================== STEP 3: RISK LOGIC ===================== */
  const enrichedForecasts = useMemo(() => {
    return forecasts.map((f) => {
      const predicted = f.predictedQuantity;
      const days = f.forecastDays || 7;
      const stock = f.currentStock ?? 0;

      const avgDailyDemand = predicted / days;

      let daysLeft;
      if (avgDailyDemand <= 0) {
        daysLeft = stock > 0 ? 999 : 0;
      } else {
        daysLeft = stock / avgDailyDemand;
      }

      let riskLevel;
      let action;

      if (predicted === 0) {
  riskLevel = "NO_DATA";
  action = "Await Forecast Data";
} else if (stock === 0 || daysLeft <= 3) {
  riskLevel = "HIGH";
  action = "Reorder Immediately";
} else if (daysLeft <= 7) {
  riskLevel = "MEDIUM";
  action = "Reorder Soon";
} else {
  riskLevel = "LOW";
  action = "Monitor";
}


      return {
        ...f,
        avgDailyDemand: Number(avgDailyDemand.toFixed(2)),
        daysLeft:
          daysLeft === 999 ? "Sufficient" : Math.ceil(daysLeft),
        riskLevel,
        action,
      };
    })
    // Default sort: HIGH → MEDIUM → LOW
    .sort((a, b) => {
      const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return order[a.riskLevel] - order[b.riskLevel];
    });
  }, [forecasts]);

  /* ===================== LOADING / ERROR ===================== */
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading forecast data...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: "20px", color: "red" }}>{error}</h2>;
  }

  return (
    <div>

      {/* ================= HEADER ================= */}
      <div className="inventory-header">
        <div>
          <h1>📈 Inventory Forecast</h1>
          <p>Demand risk & replenishment planning</p>
        </div>

        <div className="inventory-actions">
          <button className="secondary" onClick={loadForecasts}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ================= STEP 1: SUMMARY ================= */}
      <div className="forecast-summary-row">
        <div className="summary-card">
          <h4>📦 Total Forecasts</h4>
          <p className="summary-value">{forecastSummary.total}</p>
        </div>

        <div className="summary-card warning">
          <h4>⚠️ High Demand</h4>
          <p className="summary-value">{forecastSummary.highDemand}</p>
        </div>

        <div className="summary-card danger">
          <h4>🔥 Critical</h4>
          <p className="summary-value">{forecastSummary.critical}</p>
        </div>

        <div className="summary-card success">
          <h4>✅ Stable</h4>
          <p className="summary-value">{forecastSummary.stable}</p>
        </div>
      </div>

      {/* ================= STEP 2 + 3: TABLE ================= */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Predicted</th>
            <th>Avg / Day</th>
            <th>Days Left</th>
            <th>Risk</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {enrichedForecasts.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="6">No forecast data available</td>
            </tr>
          ) : (
            enrichedForecasts.map((f) => (
              <tr
                key={f.forecastId}
                className={
                  f.riskLevel === "HIGH" ? "forecast-critical-row" : ""
                }
              >
                <td>{f.productId}</td>
                <td className="predicted">{f.predictedQuantity}</td>
                <td>{f.avgDailyDemand}</td>
                <td>{f.daysLeft}</td>
                <td
  className={
    f.riskLevel === "HIGH"
      ? "forecast-high"
      : f.riskLevel === "MEDIUM"
      ? "forecast-medium"
      : f.riskLevel === "LOW"
      ? "forecast-low"
      : "forecast-neutral"
  }
>
<td>{f.riskLevel === "NO_DATA" ? "NO DATA" : f.riskLevel}</td>

                  {f.riskLevel}
                </td>
                <td>{f.action}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default ForecastPage;
