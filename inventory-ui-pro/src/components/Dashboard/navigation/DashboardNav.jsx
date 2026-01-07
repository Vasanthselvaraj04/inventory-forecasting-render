function DashboardNav({ activeMenu, setActiveMenu, setCurrentPage, scrollToSection }) {
  return (
    <div
      className={`menu-item ${activeMenu === "Dashboard" ? "active" : ""}`}
      onClick={() => {
        setActiveMenu("Dashboard");
        setCurrentPage("Dashboard");
      }}
    >
      Dashboard
    </div>
  );
}

export default DashboardNav;
