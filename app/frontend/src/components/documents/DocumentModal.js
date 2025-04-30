import React, { useState, useEffect } from "react";
import { getMetadata } from "../../api/metadata";

/**
 * Modal for displaying document details, metadata, image preview, and download.
 * @param {Object} props
 * @param {Object} props.document - The document object to display.
 * @param {Function} props.onClose - Function to close the modal.
 */
function DocumentModal({ document, onClose }) {
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState("");
  const [fileBlobUrl, setFileBlobUrl] = useState(null);

  // Fetch metadata and file blob when document changes
  useEffect(() => {
    if (!document) return;
    setMetadata(null);
    setMetadataError("");
    setMetadataLoading(true);
    // Fetch metadata
    getMetadata(document.id)
      .then(response => setMetadata(response.data))
      .catch(() => setMetadataError("Failed to load metadata."))
      .finally(() => setMetadataLoading(false));
  }, [document]);

  // Fetch file blob for download and preview
  useEffect(() => {
    if (!document) {
      setFileBlobUrl(null);
      return;
    }
    // Get token from localStorage
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/documents/${document.id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch file");
        return res.blob();
      })
      .then(blob => {
        setFileBlobUrl(URL.createObjectURL(blob));
      })
      .catch(() => setFileBlobUrl(null));
  }, [document]);

  // Clean up blob URL when fileBlobUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (fileBlobUrl) URL.revokeObjectURL(fileBlobUrl);
    };
  }, [fileBlobUrl]);

  if (!document) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        <h2>{document.title}</h2>
        {/* Always show a download link for the file using the blob URL */}
        {fileBlobUrl && (
          <a
            href={fileBlobUrl}
            download={document.title}
            style={{ display: "block", marginBottom: "10px" }}
            onClick={e => e.stopPropagation()}
          >
            Download file
          </a>
        )}
        {/* Try to preview image if the file_type is an image */}
        {fileBlobUrl && document.file_type && document.file_type.startsWith('image/') && (
          <img
            src={fileBlobUrl}
            alt={document.title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "300px",
              objectFit: "cover",
              marginBottom: "5px",
              borderRadius: "8px",
            }}
          />
        )}
        {/* Show loading, error, or metadata details */}
        {metadataLoading ? (
          <div>Loading details...</div>
        ) : metadataError ? (
          <div className="error-message">{metadataError}</div>
        ) : metadata ? (
          <>
            {/* Two vertical stacks side-by-side */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: "20px",
                marginBottom: "20px",
                textAlign: "left",
                padding: "0 20px",
              }}
            >
              {/* Left side: What + Where */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p>
                  <strong>What:</strong> {metadata.what}
                </p>
                <p>
                  <strong>Where:</strong> {metadata.where}
                </p>
              </div>
              {/* Right side: When + Why */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p>
                  <strong>When:</strong> {metadata.when}
                </p>
                <p>
                  <strong>Why:</strong> {metadata.why}
                </p>
              </div>
            </div>
            {/* Who centered at bottom */}
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Who:</strong> {metadata.who}
              </p>
            </div>
          </>
        ) : (
          <div>No details available.</div>
        )}
        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ marginTop: "10px" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default DocumentModal; 