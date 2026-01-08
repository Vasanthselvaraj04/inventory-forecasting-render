import React, { useEffect, useState } from "react";
import "../Dashboard.css";
import {
  getAllProducts,
  createProduct,
} from "../services/productService";

function ProductsPage() {
  /* ===================== STATE ===================== */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ===================== FORM STATE ===================== */
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  /* ===================== LOAD PRODUCTS ===================== */
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

  /* ===================== ADD PRODUCT ===================== */
  const handleAddProduct = async () => {
    setError("");
    setSuccessMessage("");

    if (!productName || !category || !unitPrice) {
      setError("All fields are required");
      return;
    }

    try {
      await createProduct({
        productName,
        category,
        unitPrice: Number(unitPrice),
      });

      setSuccessMessage("✅ Product added successfully");

      // reset form
      setProductName("");
      setCategory("");
      setUnitPrice("");

      // reload from DB
      loadProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to add product");
    }
  };

  /* ===================== UI ===================== */
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading products...</h2>;
  }

  return (
    <div>
      <h1>📦 Products</h1>

      {/* ===================== ADD PRODUCT CARD ===================== */}
      <div className="ui-card">

        <h3 className="ui-card-title">Add Product</h3>

        <div className="ui-form-grid">
          <input
            className="input"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            className="input"
            type="number"
            placeholder="Unit Price"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </div>

        <button
          className="sidebar-btn ui-btn"
          onClick={handleAddProduct}
        >
          Add Product
        </button>

        {error && <div className="ui-error">{error}</div>}
        {successMessage && (
          <div className="ui-success">{successMessage}</div>
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
              <td colSpan="4" style={{ textAlign: "center" }}>
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
