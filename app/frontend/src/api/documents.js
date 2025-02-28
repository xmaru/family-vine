import api from './index';

/**
 * Upload a new document
 * @param {FormData} formData - Form data containing file, title, and description
 * @returns {Promise} - Promise with the uploaded document data
 */
export const uploadDocument = (formData) => {
  return api.post('/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Get all documents for current user
 * @param {Object} params - Query parameters (skip, limit)
 * @returns {Promise} - Promise with the list of documents
 */
export const getDocuments = (params = {}) => {
  return api.get('/documents/', { params });
};

/**
 * Get document by ID
 * @param {number} id - Document ID
 * @returns {Promise} - Promise with the document data
 */
export const getDocument = (id) => {
  return api.get(`/documents/${id}`);
};

/**
 * Update document
 * @param {number} id - Document ID
 * @param {Object} data - Document data to update (title, description)
 * @returns {Promise} - Promise with the updated document data
 */
export const updateDocument = (id, data) => {
  return api.put(`/documents/${id}`, data);
};

/**
 * Delete document
 * @param {number} id - Document ID
 * @returns {Promise} - Promise with the delete operation result
 */
export const deleteDocument = (id) => {
  return api.delete(`/documents/${id}`);
};

/**
 * Get document download URL
 * @param {number} id - Document ID
 * @returns {string} - Document download URL
 */
export const getDocumentDownloadUrl = (id) => {
  return `${api.defaults.baseURL}/documents/${id}/download`;
};