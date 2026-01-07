import DashboardNav from "./navigation/DashboardNav";
import InventoryNav from "./navigation/InventoryNav";
import ProductsNav from "./navigation/ProductsNav";
import SalesNav from "./navigation/SalesNav";
import ForecastingNav from "./navigation/ForecastingNav";
import ReportsNav from "./navigation/ReportsNav";

function Sidebar({
  user,
  activeMenu,
  setActiveMenu,
  setCurrentPage,
  isManager,
  alertCount,
  loadDashboard,
  logout,
}) {
  return (
    <aside className="left-sidebar">
      {/* PROFILE */}
      <div className="sidebar-profile">
        <div className="avatar">👤</div>
        <h3>{user.username}</h3>
        <p className="role">{user.role}</p>
        <p className="status">● Online</p>
      </div>

      {/* NAVIGATION */}
      <div className="sidebar-section">
        <h4>Navigation</h4>

        <DashboardNav
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          setCurrentPage={setCurrentPage}
        />

        {/* INVENTORY — ALL USERS */}
<InventoryNav
  activeMenu={activeMenu}
  setActiveMenu={setActiveMenu}
  setCurrentPage={setCurrentPage}
  alertCount={alertCount}
/>


        <ProductsNav
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          setCurrentPage={setCurrentPage}
        />

        <SalesNav
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          setCurrentPage={setCurrentPage}
        />

        <ForecastingNav
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          setCurrentPage={setCurrentPage}
        />

        {/* REPORTS — MANAGER ONLY */}
        {isManager && (
          <ReportsNav
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            setCurrentPage={setCurrentPage}
            alertCount={alertCount}
          />
        )}

        {/* USERS — MANAGER ONLY */}
        {isManager && (
          <div
            className={`menu-item ${activeMenu === "Users" ? "active" : ""}`}
            onClick={() => {
              setActiveMenu("Users");
              setCurrentPage("Users");
            }}
          >
            Users
          </div>
        )}

      </div>

      {/* ACTIONS */}
      <div className="sidebar-section">
        <h4>Actions</h4>
        <button className="sidebar-btn" onClick={loadDashboard}>
          🔄 Refresh Data
        </button>
        <button className="sidebar-btn danger" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      <div className="sidebar-footer">© 2025 Inventory System</div>
    </aside>
  );
}

export default Sidebar;
