import React from "react";
import "../../Dashboard.css";

function RecentSalesTable({ recentSales = [] }) {
  return (
    <section id="recent-sales-section" className="card">
      <h3>Recent Sales</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {recentSales.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                No recent sales found
              </td>
            </tr>
          ) : (
            recentSales.map((s) => (
              <tr key={s.saleId}>
                <td>{s.saleId}</td>
                <td>{s.productId}</td>
                <td>{s.quantitySold}</td>
                <td>{new Date(s.saleDate).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default RecentSalesTable;
