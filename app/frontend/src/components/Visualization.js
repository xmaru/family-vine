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

  // Sort is not needed here since backend returns sorted by date (oldest to newest)
  // Calculate positions for each document node
  const nodePositions = vineData.map((doc, index) => ({
    x: 100 + index * 200,
    y: 300,
  }));

  // Create a string for the SVG polyline points to connect the nodes
  // This draws the line between the files in chronological order
  const polylinePoints = nodePositions.map(pos => `${pos.x},${pos.y}`).join(' ');

  return (
    <>
      <svg width="1000" height="600" style={{ backgroundColor: '#f9f9f9' }}>
        {/* Draw the line connecting the document nodes */}
        <polyline
          points={polylinePoints}
          stroke="brown"
          strokeWidth="6"
          fill="none"
        />
        {/* Draw the document nodes as circles */}
        {vineData.map((doc, index) => {
          const { x, y } = nodePositions[index];
          const docLabel = doc.title;

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
                {docLabel}
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