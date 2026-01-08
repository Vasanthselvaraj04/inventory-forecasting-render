import React, { useEffect, useState } from "react";
import "../Dashboard.css";
import {
  getAllSales,
  createSale,
} from "../services/salesService";

function SalesPage() {
  /* ===================== STATE ===================== */
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ===================== FORM STATE ===================== */
  const [productId, setProductId] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [saleDate, setSaleDate] = useState("");

  /* ===================== LOAD SALES ===================== */
  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await getAllSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== ADD SALE ===================== */
  const handleAddSale = async () => {
    setError("");
    setSuccessMessage("");

    if (!productId || !quantitySold || !saleDate) {
      setError("All fields are required");
      return;
    }

    try {
      await createSale({
        productId: Number(productId),
        quantitySold: Number(quantitySold),
        saleDate,
      });

      setSuccessMessage("✅ Sale recorded successfully");

      // reset form
      setProductId("");
      setQuantitySold("");
      setSaleDate("");

      // reload from DB
      loadSales();
    } catch (err) {
      console.error(err);
      setError("Failed to record sale");
    }
  };

  /* ===================== UI ===================== */
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading sales...</h2>;
  }

  return (
    <div>
      <h1>💰 Sales</h1>

      {/* ===================== ADD SALE CARD ===================== */}
      <div
        style={{
          background: "#ffffff",
          padding: "18px",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          maxWidth: "420px",
        }}
      >
        <h3>Add Sale</h3>

        <input
          className="input"
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Quantity Sold"
          value={quantitySold}
          onChange={(e) => setQuantitySold(e.target.value)}
        />

        <input
          className="input"
          type="date"
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
        />

        <button className="sidebar-btn" onClick={handleAddSale}>
          Add Sale
        </button>

        {error && <div style={{ color: "#dc2626" }}>{error}</div>}
        {successMessage && (
          <div style={{ color: "#16a34a", fontWeight: 600 }}>
            {successMessage}
          </div>
        )}
      </div>

      {/* ===================== SALES TABLE ===================== */}
      {sales.length === 0 ? (
        <p>No sales data available.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Product ID</th>
              <th>Quantity Sold</th>
              <th>Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.saleId}>
                <td>{s.saleId}</td>
                <td>{s.productId}</td>
                <td>{s.quantitySold}</td>
                <td>{s.saleDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesPage;
