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
  const [hoveredDoc, setHoveredDoc] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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

  // Group documents by their date key (mm/dd/yyyy or created_at)
  /**
   * Groups documents by their date key (mm/dd/yyyy if valid, else yyyy-mm-dd from created_at).
   * @param {Array} docs - Array of document objects.
   * @param {Object} metadataMap - Map of docId to metadata.
   * @returns {Object} - { dateKey: [docs] }
   */
  function groupByDate(docs, metadataMap) {
    const groups = {};
    docs.forEach(doc => {
      const meta = metadataMap[doc.id];
      let dateKey = meta && meta.when && isValidMMDDYYYY(meta.when)
        ? meta.when
        : doc.created_at.split('T')[0]; // fallback to yyyy-mm-dd
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(doc);
    });
    return groups;
  }

  // --- Dynamic SVG sizing and node spacing ---
  const minSvgWidth = 600;
  const svgHeight = 600;
  const nodeRadius = 10;
  const margin = 100;
  const vineY = svgHeight / 2;
  const clusterYOffset = 40; // how far below the vine the cluster hangs

  // --- Clustered vine layout ---
  const clusters = React.useMemo(() => {
    return groupByDate(sortedVineData, metadataMap);
  }, [sortedVineData, metadataMap]);

  const clusterKeys = Object.keys(clusters).sort((a, b) => new Date(a) - new Date(b));
  const clusterCount = clusterKeys.length;
  const clusterSpacing = clusterCount > 1
    ? Math.max((minSvgWidth - 2 * margin) / (clusterCount - 1), 80)
    : 0;

  // Vine line runs through vineY
  const vineCenters = clusterKeys.map((dateKey, i) => ({
    x: margin + i * clusterSpacing,
    y: vineY,
  }));

  // Polyline through vine centers (chronologic order)
  const polylinePoints = vineCenters.map(pos => `${pos.x},${pos.y}`).join(' ');

  // For each cluster, arrange nodes in a downward-pointing triangle below the vine
  const clusterNodePositions = {};
  clusterKeys.forEach((dateKey, i) => {
    const docs = clusters[dateKey];
    const center = vineCenters[i];
    if (docs.length === 1) {
      // Single node: just below the vine
      clusterNodePositions[docs[0].id] = {
        x: center.x,
        y: center.y + clusterYOffset,
      };
    } else {
      // Multiple nodes: arrange in a triangle
      // Calculate rows for triangle
      let row = 0, count = 0;
      const rows = [];
      while (count < docs.length) {
        row += 1;
        const rowCount = row;
        rows.push(rowCount);
        count += rowCount;
      }
      // Adjust last row if too many
      if (count > docs.length) {
        rows[rows.length - 1] -= (count - docs.length);
      }
      let docIdx = 0;
      let yStart = center.y + clusterYOffset;
      let rowHeight = 22; // vertical distance between rows
      for (let r = 0; r < rows.length; r++) {
        const nInRow = rows[r];
        const y = yStart + r * rowHeight;
        // Center the row horizontally
        const totalWidth = (nInRow - 1) * (nodeRadius * 2.2);
        for (let j = 0; j < nInRow && docIdx < docs.length; j++, docIdx++) {
          clusterNodePositions[docs[docIdx].id] = {
            x: center.x - totalWidth / 2 + j * (nodeRadius * 2.2),
            y,
          };
        }
      }
    }
  });

  if (loading) {
    return <div>Loading vine data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!vineData || vineData.length === 0) {
    return <div>No vine data available.</div>;
  }

  return (
    <>
      {/* SVG width and node positions are now dynamic and clustered */}
      <svg width={minSvgWidth} height={svgHeight} style={{ backgroundColor: '#f9f9f9' }}>
        {/* Draw the line connecting the cluster centers in chronologic order */}
        <polyline
          points={polylinePoints}
          stroke="brown"
          strokeWidth="6"
          fill="none"
        />
        {/* Draw stems from vine to each cluster (grape bunch) */}
        {clusterKeys.map((dateKey, i) => {
          const docs = clusters[dateKey];
          const vineCenter = vineCenters[i];
          let topNode;
          if (docs.length === 1) {
            // Only one node, connect directly
            topNode = clusterNodePositions[docs[0].id];
          } else {
            // Top node is the one with the smallest y value (topmost in triangle)
            topNode = docs
              .map(doc => clusterNodePositions[doc.id])
              .reduce((min, curr) => (curr.y < min.y ? curr : min), { y: Infinity });
          }
          return (
            <line
              key={dateKey}
              x1={vineCenter.x}
              y1={vineCenter.y}
              x2={topNode.x}
              y2={topNode.y}
              stroke="brown"
              strokeWidth={4}
            />
          );
        })}
        {hoveredDoc && (
          <text
            x={tooltipPos.x}
            y={290}
            textAnchor="middle"
            fill="black"
            fontSize="14"
            fontWeight="bold"
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              textShadow: '0 1px 4px #fff, 0 1px 8px #fff'
            }}
          >
            {hoveredDoc.title}
          </text>
        )}
        {/* Draw the document nodes as circles, clustered by date */}
        {sortedVineData.map(doc => {
          const { x, y } = clusterNodePositions[doc.id];
          // Always show tooltip on hover for every node
          return (
            <g key={doc.id}>
              <circle
                cx={x}
                cy={y}
                r={nodeRadius}
                fill="purple"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCircleClick(doc)}
                onMouseEnter={e => {
                  setHoveredDoc(doc);
                  setTooltipPos({ x, y: y - 30 });
                }}
                onMouseLeave={() => setHoveredDoc(null)}
              />
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