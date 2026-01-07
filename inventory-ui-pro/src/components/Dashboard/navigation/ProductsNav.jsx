function ProductsNav({ activeMenu, setActiveMenu, setCurrentPage }) {
  return (
    <div
      className={`menu-item ${activeMenu === "Products" ? "active" : ""}`}
      onClick={() => {
        setActiveMenu("Products");
        setCurrentPage("Products");
      }}
    >
      Products
    </div>
  );
}

export default ProductsNav;