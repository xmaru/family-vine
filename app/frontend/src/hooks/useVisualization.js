// frontend/src/hooks/useVisualization.js
import { useState, useEffect, useCallback } from 'react';
import { getVisualizationData } from '../api/visualization'; // We'll define this next

function useVisualization() {
  const [vineData, setVineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVineData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVisualizationData();
      setVineData(response.data);
    } catch (err) {
      console.error('Error fetching vine data:', err);
      setError(err.response?.data?.detail || 'Failed to fetch vine data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVineData();
  }, [fetchVineData]);

  return {
    vineData,
    loading,
    error,
    refetch: fetchVineData,
  };
}

export default useVisualization;