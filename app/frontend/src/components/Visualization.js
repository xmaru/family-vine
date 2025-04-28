// frontend/src/components/Visualization.js
import React, { useState } from 'react';
import useVisualization from '../hooks/useVisualization';
import { getMetadata } from '../api/metadata';

function Visualization() {
  const { vineData, loading, error } = useVisualization();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState("");

  /**
   * Handles click on a document circle: fetches metadata and opens modal.
   * @param {Object} doc - The document object.
   */
  const handleCircleClick = async (doc) => {
    setSelectedDoc(doc);
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
    setSelectedDoc(null);
    setMetadata(null);
    setMetadataError("");
    setMetadataLoading(false);
  };

  if (loading) {
    return <div>Loading vine data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!vineData || vineData.length === 0) {
    return <div>No vine data available.</div>;
  }

  // Example: draw an SVG path with circles for each document
  return (
    <>
      <svg width="1000" height="600" style={{ backgroundColor: "white" }}>
        <path
          d="M 50 300
             C 150 100, 350 100, 450 300
             C 550 500, 750 500, 850 300"
          stroke="brown"
          strokeWidth="6"
          fill="none"
        />
        {vineData.map((doc, index) => {
          // Example logic: X is 100 + 200 * index
          // Y is 300
          const x = 100 + index * 200;
          const y = 300;
          const dateLabel = doc.created_at
            ? new Date(doc.created_at).toISOString().slice(0, 10)
            : 'Unknown';

          return (
            <g key={doc.id}>
              <circle
                cx={x}
                cy={y}
                r={10}
                fill="purple"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCircleClick(doc)}
              />
              <text
                x={x}
                y={y - 20}
                textAnchor="middle"
                fill="black"
                fontSize="12"
                fontWeight="bold"
              >
                {dateLabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Modal for document details and metadata */}
      {selectedDoc && (
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
            <h2>{selectedDoc.title}</h2>
            {/* Optionally show an image if available */}
            {selectedDoc.file_type && selectedDoc.file_type.startsWith("image/") && (
              <img
                src={`http://localhost:8000/api/documents/${selectedDoc.id}/download`}
                alt={selectedDoc.title}
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
    </>
  );
}

export default Visualization;