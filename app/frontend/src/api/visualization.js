// frontend/src/api/visualization.js
import api from './index';

// GET /api/visualization
export const getVisualizationData = () => {
  return api.get('/visualization/'); 
};