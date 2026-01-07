// src/components/Dashboard/FiltersBar.jsx

function FiltersBar({
  timeFilter,
  setTimeFilter,
  productFilter,
  setProductFilter,
  isManager,
  exportToCSV,
  exportToPDF,
  loadDashboard,
}) {
  return (
    <div className="dashboard-filters">
      {/* Filters */}
      <div className="filter-group">
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="1">Today</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="food">Food</option>
          <option value="grocery">Grocery</option>
        </select>
      </div>

      {/* Actions */}
      <div className="action-group">
        <button
          className="sidebar-btn"
          disabled={!isManager}
          style={{ opacity: isManager ? 1 : 0.5 }}
        >
          + Add Sale
        </button>

        <button
  className="sidebar-btn"
  onClick={isManager ? exportToCSV : undefined}
  disabled={!isManager}
  title={!isManager ? "Only managers can export data" : ""}
  style={{
    opacity: isManager ? 1 : 0.5,
    cursor: isManager ? "pointer" : "not-allowed",
  }}
>
  Export CSV
</button>


        <button
  className="sidebar-btn"
  onClick={isManager ? exportToPDF : undefined}
  disabled={!isManager}
  title={!isManager ? "Only managers can export PDF" : ""}
  style={{
    opacity: isManager ? 1 : 0.5,
    cursor: isManager ? "pointer" : "not-allowed",
  }}
>
  Export PDF
</button>


        <button className="sidebar-btn" onClick={loadDashboard}>
          Refresh
        </button>
      </div>
    </div>
  );
}

export default FiltersBar;
