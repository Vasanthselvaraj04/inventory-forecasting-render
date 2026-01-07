import API from "./api";

// SUMMARY
export const getDashboardSummary = async () => {
  const res = await API.get("/dashboard/summary");
  return res.data;
};

// CHART DATA
export const getChartData = async () => {
  const res = await API.get("/dashboard/chart-data");
  return res.data;
};

// RECENT SALES
export const getRecentSales = async () => {
  const res = await API.get("/dashboard/recent-sales");
  return res.data;
};

// LOW STOCK
export const getLowStockItems = async () => {
  const res = await API.get("/dashboard/low-stock");
  return res.data;
};

// STOCK RISK
export const getStockRisk = async () => {
  const res = await API.get("/dashboard/stock-risk");
  return res.data;
};
