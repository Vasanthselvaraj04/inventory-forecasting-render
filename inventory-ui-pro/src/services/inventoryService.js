import API from "./api";

/**
 * Upload Inventory CSV
 * Backend endpoint: POST /api/inventory/import
 *
 * @param {File} file
 * @returns response data
 */
export const uploadInventoryCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/inventory/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
