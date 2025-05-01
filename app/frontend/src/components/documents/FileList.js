import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDocuments from "../../hooks/useDocuments";
import { getMetadata } from "../../api/metadata";
import "../../styles/components/FileList.css";
import useAuth from "../../hooks/useAuth";
import DocumentModal from "./DocumentModal";

const FileList = () => {
  const {
    documents,
    loading,
    error,
    deleteDocument,
    getDownloadUrl,
    fetchDocuments,
  } = useDocuments();
  const { user } = useAuth();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState("");
  const [fileBlobUrl, setFileBlobUrl] = useState(null);

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
    // return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    return date.toLocaleDateString();
  };

  // Fetch the file as a blob with Authorization when a document is selected
  useEffect(() => {
    if (!selectedDocument) {
      setFileBlobUrl(null);
      return;
    }
    // Get token from localStorage
    const token = localStorage.getItem("token");
    fetch(
      `http://localhost:8000/api/documents/${selectedDocument.id}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch file");
        return res.blob();
      })
      .then((blob) => {
        setFileBlobUrl(URL.createObjectURL(blob));
      })
      .catch(() => setFileBlobUrl(null));
    // Clean up blob URL on close
    return () => {
      if (fileBlobUrl) URL.revokeObjectURL(fileBlobUrl);
    };
  }, [selectedDocument]);

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
        <div className="file-date">Upload Date</div>
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
              <span className="file-icon">
                {getFileIcon(document.file_type)}
              </span>
              <span className="file-title">{document.title}</span>
            </div>
            <div className="file-size">
              {formatFileSize(document.file_size)}
            </div>
            <div className="file-date">{formatDate(document.created_at)}</div>
            <div className="file-actions">
              {/* Open button to open the modal */}
              <button
                className="btn btn-sm btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDocumentClick(document);
                }}
              >
                Open
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={(e) => {
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
        <DocumentModal document={selectedDocument} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default FileList;
