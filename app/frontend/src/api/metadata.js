import api from './index';

/**
 * Save metadata for a document
 * 
 * @param {Object} metadata - The metadata to save
 * @param {string} metadata.documentId - The ID of the document this metadata belongs to
 * @param {string} metadata.what - Description of what the document is
 * @param {string} metadata.why - Reason the document was created
 * @param {string} metadata.when - Date the document was created (ISO string)
 * @param {string} metadata.where - Location where the document was created
 * @param {string} metadata.uploadedBy - ID of the user who uploaded the document
 * @param {string} metadata.uploadedAt - Timestamp when the document was uploaded
 * @returns {Promise<Object>} - The saved metadata
 */
export const saveMetadata = async (metadata) => {
  try {
    const response = await api.post('/metadata', metadata);
    return response.data;
  } catch (error) {
    console.error('Error saving metadata:', error);
    throw new Error(error.response?.data?.message || 'Failed to save metadata');
  }
};

/**
 * Get metadata for a document
 * 
 * @param {string} documentId - The ID of the document to get metadata for
 * @returns {Promise<Object>} - The document metadata
 */
export const getMetadata = async (documentId) => {
  try {
    const response = await api.get(`/metadata/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching metadata for document ${documentId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to fetch metadata');
  }
};

/**
 * Update metadata for a document
 * 
 * @param {string} documentId - The ID of the document to update metadata for
 * @param {Object} updates - The metadata fields to update
 * @returns {Promise<Object>} - The updated metadata
 */
export const updateMetadata = async (documentId, updates) => {
  try {
    const response = await api.patch(`/metadata/${documentId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating metadata for document ${documentId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to update metadata');
  }
};

/**
 * Search for documents based on metadata fields
 * 
 * @param {Object} searchParams - Metadata fields to search by
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated search results
 */
export const searchByMetadata = async (searchParams = {}, page = 1, limit = 10) => {
  try {
    const params = { page, limit, ...searchParams };
    const response = await api.get('/metadata/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching by metadata:', error);
    throw new Error(error.response?.data?.message || 'Failed to search by metadata');
  }
};

/**
 * Get statistics and aggregated data from metadata
 * 
 * @param {Object} filters - Optional filters to apply
 * @returns {Promise<Object>} - Aggregated metadata statistics
 */
export const getMetadataStats = async (filters = {}) => {
  try {
    const response = await api.get('/metadata/stats', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching metadata statistics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch metadata statistics');
  }
};