// frontend/src/components/Visualization.js
import React, { useState, useEffect } from 'react';
import useVisualization from '../hooks/useVisualization';
import { getMetadata } from '../api/metadata';
import useAuth from '../hooks/useAuth';
import DocumentModal from './documents/DocumentModal';

function Visualization() {
  const { vineData, loading, error } = useVisualization();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState("");
  const { user } = useAuth();
  // State for the blob URL of the file
  const [fileBlobUrl, setFileBlobUrl] = useState(null);

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

  // Fetch the file as a blob with Authorization when a document is selected
  useEffect(() => {
    if (!selectedDoc) {
      setFileBlobUrl(null);
      return;
    }
    // Get token from localStorage
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/documents/${selectedDoc.id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch file');
        return res.blob();
      })
      .then(blob => {
        setFileBlobUrl(URL.createObjectURL(blob));
      })
      .catch(() => setFileBlobUrl(null));
    // Clean up blob URL on close
    return () => {
      if (fileBlobUrl) URL.revokeObjectURL(fileBlobUrl);
    };
  }, [selectedDoc]);

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
      {/* Use the shared DocumentModal for details and download */}
      {selectedDoc && (
        <DocumentModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </>
  );
}

export default Visualization;