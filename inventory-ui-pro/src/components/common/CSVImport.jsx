import React, { useState, useRef } from "react";
import "../../Dashboard.css";
import { uploadInventoryCSV } from "../../services/inventoryService";

/*
  We ONLY require these two fields to exist.
  CSV may have extra columns (inventory_id, last_updated, etc.)
*/
const REQUIRED_HEADERS = ["product_id", "current_stock"];

function CSVImport({ title = "Import Inventory CSV", onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= FILE SELECT ================= */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setSuccess(false);
    setError(null);

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file");
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  /* ================= CSV PARSER ================= */
  const parseCSV = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      const lines = text.split("\n").filter((l) => l.trim() !== "");

      if (lines.length < 2) {
        setError("CSV must contain header and data rows");
        return;
      }

      const parsedHeaders = lines[0]
        .split(",")
        .map((h) => h.trim().toLowerCase());

      /*
        CHANGE:
        - Do NOT require exact header count
        - Only ensure required headers exist
      */
      const valid = REQUIRED_HEADERS.every((h) =>
        parsedHeaders.includes(h)
      );

      if (!valid) {
        setError(
          `Invalid CSV headers. Required at minimum: ${REQUIRED_HEADERS.join(
            ", "
          )}`
        );
        setHeaders([]);
        setRows([]);
        return;
      }

      const parsedRows = lines.slice(1).map((line) =>
        line.split(",").map((cell) => cell.trim())
      );

      setHeaders(parsedHeaders);
      setRows(parsedRows);
    };

    reader.readAsText(file);
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      /*
        CHANGE:
        - Upload goes to INVENTORY backend
        - Not productService
      */
      await uploadInventoryCSV(file);

      setSuccess(true);
      setFile(null);
      setHeaders([]);
      setRows([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please check CSV format or backend.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="csv-import-wrapper">
      {uploading && (
        <p className="csv-status loading">Uploading...</p>
      )}

      {success && (
        <p className="csv-status success">
          ✔ Inventory updated successfully
        </p>
      )}

      {error && (
        <p className="csv-status error">{error}</p>
      )}

      <div className="csv-import-card">
        <h2>📥 {title}</h2>

        <div className="csv-upload-row">
          <label className="file-upload-btn">
            Choose CSV File
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
          </label>

          <button
            className="csv-upload-btn"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {file && (
          <p className="csv-file-name">📄 {file.name}</p>
        )}

        {/* CSV PREVIEW */}
        {headers.length > 0 && (
          <div
            style={{
              marginTop: "16px",
              maxHeight: "220px",
              overflow: "auto",
            }}
          >
            <table className="data-table">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CSVImport;
