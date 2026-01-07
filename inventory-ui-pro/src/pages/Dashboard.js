import React from "react";
import UsersPage from "./UsersPage";

/* ===================== DASHBOARD COMPONENTS ===================== */
import TopNavbar from "../components/Dashboard/TopNavbar";
import Sidebar from "../components/Dashboard/Sidebar";
import FiltersBar from "../components/Dashboard/FiltersBar";
import SummaryCards from "../components/Dashboard/SummaryCards";
import HighRiskTable from "../components/Dashboard/HighRiskTable";
import SalesChart from "../components/Dashboard/SalesChart";
import ForecastChart from "../components/Dashboard/ForecastChart";
import StockRiskTable from "../components/Dashboard/StockRiskTable";
import RecentSalesTable from "../components/Dashboard/RecentSalesTable";
import LowStockTable from "../components/Dashboard/LowStockTable";
import ProductsTable from "../components/Dashboard/ProductsTable";
import SalesPieChart from "../components/Dashboard/SalesPieChart";
import ForecastPieChart from "../components/Dashboard/ForecastPieChart";

/* ===================== PAGES ===================== */
import InventoryPage from "./InventoryPage";
import ProductsPage from "./ProductsPage";
import SalesPage from "./SalesPage";
import ForecastPage from "./ForecastPage";
import ReportsPage from "./ReportsPage";

/* ===================== LOGIC ===================== */
import useDashboardLogic from "../dashboard/useDashboardLogic";

/* ===================== STYLES ===================== */
import "../Dashboard.css";

function Dashboard() {

  /* ===================== HOOK ===================== */
  const dashboard = useDashboardLogic();

  const {
    user,
    isManager,
    summary,
    salesChart,
    forecastChart,
    recentSales,
    lowStock,
    stockRisk,
    forecastStatus,
    actionRequired,
    alertCount,
    activeMenu,
    setActiveMenu,
    currentPage,
    setCurrentPage,
    timeFilter,
    setTimeFilter,
    productFilter,
    setProductFilter,
    loadDashboard,
    logout,
    getTrendArrow,
    exportToCSV,
    exportToPDF,
  } = dashboard;

  /* ===================== SAFE SUMMARY ===================== */
  const totalProducts = summary?.totalProducts ?? 0;
  const lowStockCount = summary?.lowStockCount ?? 0;

  /* ========================================================
     TOP 5 STOCK RISK (DASHBOARD OVERVIEW ONLY)
     ======================================================== */
  const top5StockRisk = Array.isArray(stockRisk)
    ? [...stockRisk]
        .sort((a, b) => {
          const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
          return order[a.riskLevel] - order[b.riskLevel];
        })
        .slice(0, 5)
    : [];

  /* ========================================================
     TOP 5 RECENT SALES (LATEST FIRST)
     ======================================================== */
  const top5RecentSales = Array.isArray(recentSales)
    ? [...recentSales]
        .sort(
          (a, b) =>
            new Date(b.saleDate).getTime() -
            new Date(a.saleDate).getTime()
        )
        .slice(0, 5)
    : [];

  /* ========================================================
     TOP 5 PRODUCTS (LOWEST STOCK OVERVIEW)
     ======================================================== */
  const top5Products = Array.isArray(lowStock)
    ? [...lowStock]
        .sort((a, b) => a.currentStock - b.currentStock)
        .slice(0, 5)
    : [];

  /* ===================== LOADING ===================== */
  if (!user || !summary) {
    return (
      <h2 style={{ padding: "20px" }}>
        Loading dashboard...
      </h2>
    );
  }

  /* ===================== RENDER ===================== */
  return (
    <div className="dashboard-shell">

      {/* ===================== TOP NAVBAR ===================== */}
      <TopNavbar user={user} onLogout={logout} />

      <div className="dashboard-body">

        {/* ===================== SIDEBAR ===================== */}
        <Sidebar
          user={user}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          setCurrentPage={setCurrentPage}
          isManager={isManager}
          alertCount={alertCount}
          loadDashboard={loadDashboard}
          logout={logout}
        />

        {/* ===================== MAIN CONTENT ===================== */}
        <main className="dashboard-container">

          {/* ======================================================
             DASHBOARD PAGE
             ====================================================== */}
          {currentPage === "Dashboard" && (
            <>

              {/* ===================== HEADER ===================== */}
              <h1
                id="summary-section"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                Inventory Forecasting Dashboard

                {alertCount > 0 && (
                  <span
                    title="Inventory Alerts"
                    style={{
                      cursor: "pointer",
                      color: "#dc2626",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    🔔 {alertCount}
                  </span>
                )}
              </h1>

              {/* ===================== FILTERS ===================== */}
              <FiltersBar
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                productFilter={productFilter}
                setProductFilter={setProductFilter}
                isManager={isManager}
                loadDashboard={loadDashboard}
                exportToCSV={exportToCSV}
                exportToPDF={exportToPDF}
              />

              {/* ===================== SUMMARY ===================== */}
              <SummaryCards summary={summary} />

              {/* ===================== HIGH RISK (TOP 5) ===================== */}
              <HighRiskTable
                items={actionRequired.slice(0, 5)}
                isManager={isManager}
              />

              {/* ===================== CHARTS ===================== */}
              <SalesChart
                data={salesChart}
                salesTrend={forecastStatus}
              />{/* ===================== PIE CHARTS ROW ===================== */}
<div className="pie-charts-row">
  <div className="pie-chart-card">
    <SalesPieChart recentSales={recentSales} />
  </div>

  <div className="pie-chart-card">
    <ForecastPieChart forecastChart={forecastChart} />
  </div>
</div>

              <ForecastChart data={forecastChart} />

              {/* ===================== STOCK RISK ===================== */}
              <section>
                <StockRiskTable
                  stockRisk={top5StockRisk}
                  getTrendArrow={getTrendArrow}
                />

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <button
                    className="secondary"
                    onClick={() => setCurrentPage("Forecasting")}
                  >
                    View All →
                  </button>
                </div>
              </section>

              {/* ===================== RECENT SALES ===================== */}
              <section>
                <RecentSalesTable recentSales={top5RecentSales} />

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <button
                    className="secondary"
                    onClick={() => setCurrentPage("Sales")}
                  >
                    View All →
                  </button>
                </div>
              </section>

              {/* ===================== LOW STOCK ===================== */}
              <LowStockTable />

              {/* ===================== PRODUCTS ===================== */}
              <section>
                <ProductsTable products={top5Products} />

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <button
                    className="secondary"
                    onClick={() => setCurrentPage("Products")}
                  >
                    View All →
                  </button>
                </div>
              </section>

            </>
          )}

          {/* ===================== USERS PAGE ===================== */}
          {currentPage === "Users" && (
            <UsersPage loggedInUsername={user.username} />
          )}

          {/* ===================== INVENTORY PAGE ===================== */}
          {currentPage === "Inventory" && (
            <InventoryPage lowStock={lowStock} />
          )}

          {/* ===================== PRODUCTS PAGE ===================== */}
          {currentPage === "Products" && <ProductsPage />}

          {/* ===================== SALES PAGE ===================== */}
          {currentPage === "Sales" && (
            <SalesPage recentSales={recentSales} />
          )}

          {/* ===================== FORECAST PAGE ===================== */}
          {currentPage === "Forecasting" && (
            <ForecastPage forecastChart={forecastChart} />
          )}

          {/* ===================== REPORTS PAGE ===================== */}
          {currentPage === "Reports" && (
            <ReportsPage
              stockRisk={stockRisk}
              exportToCSV={exportToCSV}
              exportToPDF={exportToPDF}
              isManager={isManager}
            />
          )}

        </main>
      </div>
    </div>
  );
}

export default Dashboard;
