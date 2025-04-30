import api from "./index";

/**
 * Fetches metadata for a specific document by its ID.
 * @param {number} documentId - The unique identifier of the document.
 * @returns {Promise<Object>} - Promise that resolves with the metadata object.
 */
export const getMetadata = (documentId) => {
  // Calls the backend API to get metadata for the given document
  return api.get(`/metadata/${documentId}`);
};

/**
 * Creates metadata for a specific document by its ID.
 * @param {number} documentId - The unique identifier of the document.
 * @param {Object} metadata - The metadata object containing what, when, where, who, why.
 * @returns {Promise<Object>} - Promise that resolves with the created metadata object.
 */
export const createMetadata = (documentId, metadata) => {
  // Calls the backend API to create metadata for the given document
  return api.post(`/metadata/${documentId}`, metadata);
};
