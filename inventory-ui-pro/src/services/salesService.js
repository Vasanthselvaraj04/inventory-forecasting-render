import API from "./api";

/* ===================== GET ALL SALES ===================== */
export const getAllSales = async () => {
  const res = await API.get("/sales");
  return res.data;
};

/* ===================== CREATE SALE ===================== */
export const createSale = async (sale) => {
  const res = await API.post("/sales", sale);
  return res.data;
};
