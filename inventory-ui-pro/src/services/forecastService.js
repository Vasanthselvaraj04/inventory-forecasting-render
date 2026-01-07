import API from "./api";

export const getAllForecasts = async () => {
  const res = await API.get("/forecast");
  return res.data;
};
