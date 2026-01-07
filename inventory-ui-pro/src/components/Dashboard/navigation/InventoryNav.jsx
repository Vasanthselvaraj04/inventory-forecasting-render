function InventoryNav({ activeMenu, setActiveMenu, setCurrentPage }) {
  return (
    <div
      className={`menu-item ${activeMenu === "Inventory" ? "active" : ""}`}
      onClick={() => {
        setActiveMenu("Inventory");
        setCurrentPage("Inventory");
      }}
    >
      Inventory
    </div>
  );
}

export default InventoryNav;
