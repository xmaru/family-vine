// frontend/src/components/Visualization.js
import React from 'react';
import useVisualization from '../hooks/useVisualization';

function Visualization() {
  const { vineData, loading, error } = useVisualization();

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
        
        // If you want a date: parse doc.created_at or doc.date field
        const dateLabel = doc.created_at
          ? new Date(doc.created_at).toISOString().slice(0, 10)
          : 'Unknown';
  
        
        return (
          <g key={doc.id}>
            <circle cx={x} cy={y} r={10} fill="purple" style={{ cursor: 'pointer' }}
    onClick={() => {
      // Open the document in a new tab
      window.open(`http://localhost:8000/api/documents/${doc.id}/download`, '_blank');
    }}
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
  );
}

export default Visualization;