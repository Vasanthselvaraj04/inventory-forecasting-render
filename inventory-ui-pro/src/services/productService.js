import API from "./api";

export const getAllProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const uploadProductsCSV = async (formData) => {
  const res = await API.post("/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
