// src/components/Dashboard/TopNavbar.jsx

function TopNavbar({ user, onLogout }) {
  return (
    <header className="top-navbar">
      <div className="app-title">
        <h2>Inventory Tracking System</h2>
      </div>

      <div className="nav-actions">
        <span>{user.username}</span>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}

export default TopNavbar;
