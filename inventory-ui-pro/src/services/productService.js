import API from "./api";

/* ===================== GET ALL PRODUCTS ===================== */
export const getAllProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

/* ===================== ADD PRODUCT ===================== */
export const addProduct = async (product) => {
  const res = await API.post("/products", product);
  return res.data;
};

/* ===================== CREATE PRODUCT (FORM → DB) ===================== */
export const createProduct = async (product) => {
  const res = await API.post("/products", product);
  return res.data;
};

/* ===================== CSV IMPORT (OPTIONAL / EXISTING) ===================== */
export const uploadProductsCSV = async (formData) => {
  const res = await API.post("/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
