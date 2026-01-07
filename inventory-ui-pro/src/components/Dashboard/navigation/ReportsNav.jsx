function ReportsNav({ activeMenu, setActiveMenu, setCurrentPage, alertCount }) {
  return (
    <div
      className={`menu-item ${activeMenu === "Reports" ? "active" : ""}`}
      onClick={() => {
        setActiveMenu("Reports");
        setCurrentPage("Reports");
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>Reports</span>

      {alertCount > 0 && (
        <span
          style={{
            backgroundColor: "#dc2626",
            color: "#fff",
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          {alertCount}
        </span>
      )}
    </div>
  );
}

export default ReportsNav;
