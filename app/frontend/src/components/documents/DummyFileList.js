import React, { useState } from "react";
import "../../styles/components/DummyFileList.css";

const DummyFileList = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documents = [
    {
      id: 1,
      title: "Umar's Birthday",
      what: "Birthday Party",
      when: "Nov 17",
      where: "Home",
      who: "Family",
      why: "Special day",
      file_type: "image/jpeg",
      file_size: 250000, // in bytes
      created_at: new Date().toISOString(),
      imageUrl: "/godfather.jpeg",
    },
    {
      id: 2,
      title: "Vacation Trip",
      what: "Beach Trip",
      when: "July",
      where: "Florida",
      who: "Friends",
      why: "Relaxation",
      file_type: "image/png",
      file_size: 450000, // in bytes
      created_at: new Date().toISOString(),
      imageUrl: "/BMW_M5.png",
    },
  ];

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <div className="file-name">Name</div>
        <div className="file-size">Size</div>
        <div className="file-date">Date</div>
        <div className="file-actions">Actions</div>
      </div>

      <ul className="file-list">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="file-item"
            onClick={() => setSelectedDocument(doc)}
            style={{ cursor: "pointer" }}
          >
            <div className="file-name">📄 {doc.title}</div>
            <div className="file-size">{formatFileSize(doc.file_size)}</div>
            <div className="file-date">{formatDate(doc.created_at)}</div>
            <div className="file-actions">
              <a
                href={doc.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </a>
            </div>
          </li>
        ))}
      </ul>

      {selectedDocument && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedDocument(null)}
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
            onClick={(e) => e.stopPropagation()}
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
            <img
              src={selectedDocument.imageUrl}
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
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <p>
                  <strong>What:</strong> {selectedDocument.what}
                </p>
                <p>
                  <strong>Where:</strong> {selectedDocument.where}
                </p>
              </div>

              {/* Right side: When + Why */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <p>
                  <strong>When:</strong> {selectedDocument.when}
                </p>
                <p>
                  <strong>Why:</strong> {selectedDocument.why}
                </p>
              </div>
            </div>

            {/* Who centered at bottom */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <p>
                <strong>Who:</strong> {selectedDocument.who}
              </p>
            </div>

            <button
              onClick={() => setSelectedDocument(null)}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DummyFileList;
