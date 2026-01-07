import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardSummary,
  getChartData,
  getRecentSales,
  getLowStockItems,
  getStockRisk,
} from "../services/dashboardService";


export default function useDashboardLogic() {
  const navigate = useNavigate();

  /* ===================== AUTH ===================== */
  const [user, setUser] = useState(null);
  const isManager = user?.role === "MANAGER";

  /* ===================== DASHBOARD DATA ===================== */
  const [summary, setSummary] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [forecastChart, setForecastChart] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [stockRisk, setStockRisk] = useState([]);

  /* ===================== UI STATE ===================== */
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [timeFilter, setTimeFilter] = useState("7");
  const [productFilter, setProductFilter] = useState("all");

  /* ===================== CALCULATIONS ===================== */
  const forecastStatus =
    summary && summary.forecastDemand > summary.totalProducts * 0.7
      ? "📈 High Demand Expected"
      : "➖ Stable Demand";

  const actionRequired = stockRisk.filter((item) => {
    const daysLeftRisk =
      item.daysLeft !== undefined && item.daysLeft <= 3;

    const highRisk =
      (item.riskLevel || "").toUpperCase() === "HIGH";

    return daysLeftRisk || highRisk;
  });

  const alertCount = actionRequired.length;

  const getTrendArrow = (avg) => {
    if (avg === undefined || avg === null) return "➖";
    if (avg >= 5) return "📈";
    if (avg <= 2) return "📉";
    return "➖";
  };

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    loadDashboard();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboard();
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  /* ===================== API CALLS ===================== */
  const loadDashboard = async () => {
    try {
      // ===== SUMMARY =====
      const summaryRes = await getDashboardSummary();
      console.log("SUMMARY API RESPONSE:", summaryRes);

      setSummary({
        totalProducts:
          summaryRes?.totalProducts ??
          summaryRes?.total_products ??
          0,

        totalSales:
          summaryRes?.totalSales ??
          summaryRes?.total_sales ??
          0,

        lowStockCount:
          summaryRes?.lowStockCount ??
          summaryRes?.low_stock_count ??
          0,

        forecastDemand:
          summaryRes?.forecastDemand ??
          summaryRes?.forecast_demand ??
          0,
      });

      // ===== CHART DATA =====
      const chartRes = await getChartData();

      setSalesChart(
        (chartRes?.sales || []).map((i) => ({
          date: i[0],
          quantity: i[1],
        }))
      );

      setForecastChart(
        (chartRes?.forecast || []).map((i) => ({
          days: `Day ${i[0]}`,
          quantity: i[1],
        }))
      );

      // ===== TABLE DATA =====
      setRecentSales(await getRecentSales());
      setLowStock(await getLowStockItems());
      setStockRisk(await getStockRisk());

    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

  /* ===================== ACTIONS ===================== */
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const exportToCSV = () => {
    if (!stockRisk || stockRisk.length === 0) {
      alert("No data available for export");
      return;
    }

    const headers = [
      "Product ID",
      "Current Stock",
      "Avg Daily Sales",
      "Days Left",
      "Risk Level",
    ];

    const rows = stockRisk.map((item) => [
      item.productId,
      item.currentStock,
      item.avgDailySales,
      Math.ceil(item.daysLeft),
      item.riskLevel,
    ]);

    const csvContent =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory_report.csv";
    link.click();
  };

  const exportToPDF = () => {
    if (!stockRisk || stockRisk.length === 0) {
      alert("No data available to export");
      return;
    }

    const doc = new jsPDF();
    doc.text("Inventory Risk Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        "Product ID",
        "Current Stock",
        "Avg Daily Sales",
        "Days Left",
        "Risk Level",
      ]],
      body: stockRisk.map((item) => [
        item.productId,
        item.currentStock,
        item.avgDailySales,
        Math.ceil(item.daysLeft),
        item.riskLevel,
      ]),
    });

    doc.save("inventory_risk_report.pdf");
  };

  /* ===================== RETURN ===================== */
  return {
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
  };
}
