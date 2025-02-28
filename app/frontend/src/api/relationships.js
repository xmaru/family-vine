import api from './index';

/**
 * Save relationships (people) associated with a document
 * 
 * @param {Array} relationships - Array of relationship objects
 * @param {string} relationships[].documentId - The ID of the document
 * @param {string} relationships[].personName - Name of the person
 * @param {string} relationships[].role - Role of the person in relation to the document
 * @param {boolean} relationships[].isPrimary - Whether this person is the primary person
 * @returns {Promise<Object>} - The saved relationships data
 */
export const saveRelationships = async (relationships) => {
  try {
    const response = await api.post('/relationships/batch', { relationships });
    return response.data;
  } catch (error) {
    console.error('Error saving relationships:', error);
    throw new Error(error.response?.data?.message || 'Failed to save relationships');
  }
};

/**
 * Get all relationships for a document
 * 
 * @param {string} documentId - The ID of the document
 * @returns {Promise<Array>} - Array of relationship objects
 */
export const getDocumentRelationships = async (documentId) => {
  try {
    const response = await api.get(`/relationships/document/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching relationships for document ${documentId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to fetch relationships');
  }
};

/**
 * Add a new person relationship to a document
 * 
 * @param {string} documentId - The ID of the document
 * @param {Object} personData - Person data
 * @param {string} personData.name - Name of the person
 * @param {string} personData.role - Role of the person
 * @param {boolean} personData.isPrimary - Whether this person is primary
 * @returns {Promise<Object>} - The saved relationship
 */
export const addPersonToDocument = async (documentId, personData) => {
  try {
    const relationship = {
      documentId,
      personName: personData.name,
      role: personData.role,
      isPrimary: personData.isPrimary || false,
    };
    
    const response = await api.post('/relationships', relationship);
    return response.data;
  } catch (error) {
    console.error('Error adding person to document:', error);
    throw new Error(error.response?.data?.message || 'Failed to add person to document');
  }
};

/**
 * Update a person relationship
 * 
 * @param {string} relationshipId - The ID of the relationship to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} - The updated relationship
 */
export const updateRelationship = async (relationshipId, updates) => {
  try {
    const response = await api.patch(`/relationships/${relationshipId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating relationship ${relationshipId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to update relationship');
  }
};

/**
 * Remove a person relationship from a document
 * 
 * @param {string} relationshipId - The ID of the relationship to remove
 * @returns {Promise<Object>} - Response data
 */
export const removeRelationship = async (relationshipId) => {
  try {
    const response = await api.delete(`/relationships/${relationshipId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing relationship ${relationshipId}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to remove relationship');
  }
};

/**
 * Find documents by person
 * 
 * @param {string} personName - Name of the person to search for
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} - Paginated list of documents associated with the person
 */
export const findDocumentsByPerson = async (personName, page = 1, limit = 10) => {
  try {
    const params = { name: personName, page, limit };
    const response = await api.get('/relationships/person', { params });
    return response.data;
  } catch (error) {
    console.error(`Error finding documents for person ${personName}:`, error);
    throw new Error(error.response?.data?.message || 'Failed to find documents by person');
  }
};