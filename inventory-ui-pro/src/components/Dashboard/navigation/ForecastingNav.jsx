function ForecastingNav({ activeMenu, setActiveMenu, setCurrentPage }) {
  return (
    <div
      className={`menu-item ${activeMenu === "Forecasting" ? "active" : ""}`}
      onClick={() => {
        setActiveMenu("Forecasting");
        setCurrentPage("Forecasting");
      }}
    >
      Forecasting
    </div>
  );
}

export default ForecastingNav;
