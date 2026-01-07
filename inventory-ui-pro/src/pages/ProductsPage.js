import React, { useEffect, useState } from "react";
import "../Dashboard.css";
import { getAllProducts } from "../services/productService";

function ProductsPage() {
  /* ===================== STATE ===================== */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  /* ===================== LOAD PRODUCTS (BACKEND) ===================== */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== FILE SELECT ===================== */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setError("");
    setSuccessMessage("");
  };

  /* ===================== FRONTEND CSV IMPORT ===================== */
  const handleImportCSV = () => {
    if (!selectedFile) {
      setError("Please choose a CSV file first");
      return;
    }

    setImporting(true);
    setError("");
    setSuccessMessage("");

    const reader = new FileReader();

    reader.onload = () => {
      const lines = reader.result
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      // skip header
      const dataLines = lines.slice(1);

      const importedProducts = dataLines.map((line, index) => {
        const values = line.split(",");

        return {
          productId: products.length + index + 1,
          productName: values[0]?.trim() || "Unknown",
          category: values[1]?.trim() || "General",
          unitPrice: values[2]?.trim() || "0",
        };
      });

      // ✅ APPEND imported rows
      setProducts((prev) => [...prev, ...importedProducts]);

      setImporting(false);
      setSelectedFile(null);
      setSuccessMessage("✅ Products imported successfully");
    };

    reader.onerror = () => {
      setImporting(false);
      setError("Failed to read CSV file");
    };

    reader.readAsText(selectedFile);
  };

  /* ===================== UI ===================== */
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading products...</h2>;
  }

  return (
    <div>
      <h1>📦 Products</h1>

      {/* ===================== IMPORT CARD ===================== */}
      <div
        style={{
          background: "#ffffff",
          padding: "18px",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: "16px" }}>
          Import Products (CSV)
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={importing}
          />

          <button
            className="sidebar-btn"
            onClick={handleImportCSV}
            disabled={importing}
            style={{ opacity: importing ? 0.6 : 1 }}
          >
            {importing ? "Importing..." : "Import CSV"}
          </button>

          {selectedFile && (
            <span style={{ fontSize: "13px", color: "#475569" }}>
              📄 {selectedFile.name}
            </span>
          )}
        </div>

        {/* ===== MESSAGES ===== */}
        {error && <div style={{ color: "#dc2626" }}>{error}</div>}

        {successMessage && (
          <div style={{ color: "#16a34a", fontWeight: 600 }}>
            {successMessage}
          </div>
        )}
      </div>

      {/* ===================== PRODUCTS TABLE ===================== */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Unit Price</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{ textAlign: "center", color: "#64748b" }}
              >
                No products available
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.productName}</td>
                <td>{p.category}</td>
                <td>₹ {p.unitPrice}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
