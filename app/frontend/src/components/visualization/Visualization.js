// frontend/src/components/Visualization.js
import React, { useState, useEffect } from 'react';
import useVisualization from '../../hooks/useVisualization';
import { getMetadata } from '../../api/metadata';
import useAuth from '../../hooks/useAuth';
import DocumentModal from '../documents/DocumentModal';
import { isValidMMDDYYYY } from '../../utils/validators';

function Visualization() {
  const { vineData, loading, error } = useVisualization();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [metadataMap, setMetadataMap] = useState({}); // docId -> metadata
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState("");
  const { user } = useAuth();
  // State for the blob URL of the file
  const [fileBlobUrl, setFileBlobUrl] = useState(null);

  // Prefetch all metadata for vineData
  useEffect(() => {
    if (!vineData || vineData.length === 0) return;
    setMetadataLoading(true);
    setMetadataError("");
    Promise.all(
      vineData.map(doc =>
        getMetadata(doc.id)
          .then(res => ({ id: doc.id, metadata: res.data }))
          .catch(() => ({ id: doc.id, metadata: null }))
      )
    )
      .then(results => {
        const map = {};
        results.forEach(({ id, metadata }) => {
          map[id] = metadata;
        });
        setMetadataMap(map);
      })
      .catch(() => setMetadataError('Failed to load some metadata.'))
      .finally(() => setMetadataLoading(false));
  }, [vineData]);

  // Sort vineData by metadata.when (if valid mm/dd/yyyy), else by created_at
  const sortedVineData = [...vineData].sort((a, b) => {
    const metaA = metadataMap[a.id];
    const metaB = metadataMap[b.id];
    const whenA = metaA && metaA.when && isValidMMDDYYYY(metaA.when) ? metaA.when : null;
    const whenB = metaB && metaB.when && isValidMMDDYYYY(metaB.when) ? metaB.when : null;
    if (whenA && whenB) {
      // mm/dd/yyyy to Date
      const [mA, dA, yA] = whenA.split('/').map(Number);
      const [mB, dB, yB] = whenB.split('/').map(Number);
      const dateA = new Date(yA, mA - 1, dA);
      const dateB = new Date(yB, mB - 1, dB);
      return dateA - dateB;
    } else if (whenA) {
      return -1;
    } else if (whenB) {
      return 1;
    } else {
      // Fallback to created_at (assume ISO string or yyyy-mm-dd)
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

  /**
   * Handles click on a document circle: fetches metadata and opens modal.
   * @param {Object} doc - The document object.
   */
  const handleCircleClick = async (doc) => {
    setSelectedDoc(doc);
    setMetadataError("");
    setMetadataLoading(false); // No need to fetch metadata here, already prefetched
  };

  const handleCloseModal = () => {
    setSelectedDoc(null);
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

  // --- Dynamic SVG sizing and node spacing ---
  // Minimum SVG width and margin for aesthetics
  const minSvgWidth = 600;
  const svgHeight = 600;
  const nodeRadius = 10;
  const margin = 100;
  // Calculate spacing and SVG width so all nodes fit
  const nodeCount = sortedVineData.length;
  // Minimum spacing between nodes for readability
  const spacing = nodeCount > 1
    ? Math.max((minSvgWidth - 2 * margin) / (nodeCount - 1), 80)
    : 0;
  // SVG width grows if more nodes are present
  const svgWidth = Math.max(minSvgWidth, margin * 2 + spacing * (nodeCount - 1));

  // Calculate positions for each document node so all are visible
  const nodePositions = sortedVineData.map((doc, index) => ({
    x: margin + index * spacing,
    y: svgHeight / 2,
  }));

  // Create a string for the SVG polyline points to connect the nodes
  // This draws the line between the files in chronologic order
  const polylinePoints = nodePositions.map(pos => `${pos.x},${pos.y}`).join(' ');

  return (
    <>
      {/* SVG width and node positions are now dynamic */}
      <svg width={svgWidth} height={svgHeight} style={{ backgroundColor: '#f9f9f9' }}>
        {/* Draw the line connecting the document nodes */}
        <polyline
          points={polylinePoints}
          stroke="brown"
          strokeWidth="6"
          fill="none"
        />
        {/* Draw the document nodes as circles */}
        {sortedVineData.map((doc, index) => {
          const { x, y } = nodePositions[index];
          const docLabel = doc.title;

          return (
            <g key={doc.id}>
              <circle
                cx={x}
                cy={y}
                r={nodeRadius}
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