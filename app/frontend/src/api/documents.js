import api from './index';

/**
 * Upload a document to the server
 * 
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - The uploaded document data from the server
 */
export const uploadDocument = async (file) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Add file metadata
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('fileSize', file.size);
    
    // Set the correct headers for file upload
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await api.post('/documents/upload', formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload document');
  }
};

/**
 * Get a list of documents
 * 
 * @param {Object} filters - Optional filters to apply (e.g., date range, type)
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated list of documents
 */
export const getDocuments = async (filters = {}, page = 1, limit = 10) => {
  try {
    const params = { page, limit, ...filters };
    const response = await api.get('/documents', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};

/**
 * Get a single document by ID
 * 
 * @param {string} documentId - The ID of the document to retrieve
 * @returns {Promise<Object>} - The document data
 */
export const getDocumentById = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching document with ID ${documentId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to fetch document');
  }
};

/**
 * Delete a document
 * 
 * @param {string} documentId - The ID of the document to delete
 * @returns {Promise<Object>} - Response data
 */
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting document with ID ${documentId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to delete document');
  }
};

/**
 * Update document properties
 * 
 * @param {string} documentId - The ID of the document to update
 * @param {Object} updates - The properties to update
 * @returns {Promise<Object>} - The updated document data
 */
export const updateDocument = async (documentId, updates) => {
  try {
    const response = await api.patch(`/documents/${documentId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating document with ID ${documentId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to update document');
  }
};