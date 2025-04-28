import React, { useState } from "react";
import { Link } from "react-router-dom";
import useDocuments from "../../hooks/useDocuments";
import { getMetadata } from "../../api/metadata";
import "../../styles/components/FileList.css";

const FileList = () => {
  const {
    documents,
    loading,
    error,
    deleteDocument,
    getDownloadUrl,
    fetchDocuments,
  } = useDocuments();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState("");

  /**
   * Handles document click: fetches metadata and opens modal.
   * @param {Object} doc - The document object.
   */
  const handleDocumentClick = async (doc) => {
    setSelectedDocument(doc);
    setMetadata(null);
    setMetadataError("");
    setMetadataLoading(true);
    try {
      // Fetch metadata for the selected document
      const response = await getMetadata(doc.id);
      setMetadata(response.data);
    } catch (err) {
      setMetadataError("Failed to load metadata.");
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
    setMetadata(null);
    setMetadataError("");
    setMetadataLoading(false);
  };

  const handleDelete = async (id, documentName) => {
    if (window.confirm(`Are you sure you want to delete "${documentName}"?`)) {
      try {
        setDeleteInProgress(true);
        setDeleteError("");
        await deleteDocument(id);
      } catch (err) {
        setDeleteError("Failed to delete document. Please try again.");
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return "🖼️";
    } else if (fileType.startsWith("video/")) {
      return "🎬";
    } else if (fileType.startsWith("audio/")) {
      return "🎵";
    } else if (fileType.includes("pdf")) {
      return "📄";
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return "📝";
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return "📊";
    } else if (
      fileType.includes("presentation") ||
      fileType.includes("powerpoint")
    ) {
      return "📑";
    } else {
      return "📁";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="loading-indicator">Loading documents...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={fetchDocuments}>
          Try Again
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <h3>No documents yet</h3>
        <p>Upload your first document to get started</p>
        <Link to="/upload" className="btn btn-primary">
          Upload Document
        </Link>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      {deleteError && <div className="error-message">{deleteError}</div>}

      <div className="file-list-header">
        <div className="file-name">Name</div>
        <div className="file-size">Size</div>
        <div className="file-date">Date</div>
        <div className="file-actions">Actions</div>
      </div>

      <ul className="file-list">
        {documents.map((document) => (
          <li
            key={document.id}
            className="file-item"
            onClick={() => handleDocumentClick(document)}
            style={{ cursor: "pointer" }}
          >
            <div className="file-name">
              <span className="file-icon">{getFileIcon(document.file_type)}</span>
              <span className="file-title">{document.title}</span>
            </div>
            <div className="file-size">{formatFileSize(document.file_size)}</div>
            <div className="file-date">{formatDate(document.created_at)}</div>
            <div className="file-actions">
              <a
                href={getDownloadUrl(document.id)}
                className="btn btn-sm btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                Download
              </a>
              <button
                className="btn btn-sm btn-danger"
                onClick={e => {
                  e.stopPropagation();
                  handleDelete(document.id, document.title);
                }}
                disabled={deleteInProgress}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for document details and metadata */}
      {selectedDocument && (
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
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
            <h2>{selectedDocument.title}</h2>
            {/* Optionally show an image if available */}
            {selectedDocument.file_type && selectedDocument.file_type.startsWith("image/") && (
              <img
                src={getDownloadUrl(selectedDocument.id)}
                alt={selectedDocument.title}
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
              onClick={handleCloseModal}
              className="btn btn-primary"
              style={{ marginTop: "10px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
