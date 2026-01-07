function SalesNav({ activeMenu, setActiveMenu, setCurrentPage }) {
  return (
    <div
      className={`menu-item ${activeMenu === "Sales" ? "active" : ""}`}
      onClick={() => {
        setActiveMenu("Sales");
        setCurrentPage("Sales");
      }}
    >
      Sales
    </div>
  );
}

export default SalesNav;
