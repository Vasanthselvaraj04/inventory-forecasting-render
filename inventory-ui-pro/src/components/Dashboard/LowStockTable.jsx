import React, { useEffect, useState } from "react";
import { getLowStockItems } from "../../services/dashboardService";

import "../../Dashboard.css";

function LowStockTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLowStock();
  }, []);

  const loadLowStock = async () => {
    try {
      const data = await getLowStockItems();
      console.log("LOW STOCK API DATA:", data); // keep for verification
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load low stock items");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading low stock items...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="card">
      <h3>Low Stock Items</h3>

      {items.length === 0 ? (
        <p>No low stock items 🎉</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId}>
                <td>{item.productId}</td>
                <td>{item.productName}</td>   {/* ✅ CORRECT KEY */}
                <td>{item.category}</td>      {/* ✅ CORRECT KEY */}
                <td>{item.currentStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LowStockTable;
