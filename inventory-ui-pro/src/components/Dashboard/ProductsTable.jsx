import React from "react";
import "../../Dashboard.css";

function ProductsTable({ products = [] }) {
  return (
    <section className="card">
      <h3>Products</h3>

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
              <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
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
    </section>
  );
}

export default ProductsTable;
