import api from "./index";

/**
 * Uploads a new document to the server
 * @param {FormData} formData - Form data containing the file and metadata
 * @returns {Promise} - Promise that resolves with the uploaded document data
 */
export const uploadDocument = (formData) => {
  // return api.post('/documents/', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });
  console.log("[FAKE UPLOAD] Simulating document upload...");

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: Math.floor(Math.random() * 1000), // Random ID
          title: formData.get("title"),
          description: formData.get("description"),
          file_path: "godfather.jpeg", // Simulated file path
          file_type: "image/jpeg", // Simulated file type
          file_size: formData.get("file").size, // Simulated file size
          created_at: new Date().toISOString(), // Current date and time
          updated_at: new Date().toISOString(), // Current date and time
        },
      });
    }, 1500); // Simulate a 2-second upload time
  });
};

/**
 * Retrieves a list of documents for the current user
 * @param {Object} params - Query parameters for filtering and pagination
 * @param {number} [params.skip] - Number of records to skip (for pagination)
 * @param {number} [params.limit] - Maximum number of records to return
 * @returns {Promise} - Promise that resolves with the list of documents
 */
export const getDocuments = (params = {}) => {
  return api.get("/documents/", { params });
};

/**
 * Retrieves a specific document by its ID
 * @param {number} id - The unique identifier of the document
 * @returns {Promise} - Promise that resolves with the document data
 */
export const getDocument = (id) => {
  return api.get(`/documents/${id}`);
};

/**
 * Updates an existing document
 * @param {number} id - The unique identifier of the document to update
 * @param {Object} data - The updated document data
 * @returns {Promise} - Promise that resolves with the updated document data
 */
export const updateDocument = (id, data) => {
  return api.put(`/documents/${id}`, data);
};

/**
 * Deletes a document by its ID
 * @param {number} id - The unique identifier of the document to delete
 * @returns {Promise} - Promise that resolves when the document is deleted
 */
export const deleteDocument = (id) => {
  return api.delete(`/documents/${id}`);
};

/**
 * Generates a download URL for a specific document
 * @param {number} id - The unique identifier of the document
 * @returns {string} - The URL that can be used to download the document
 */
export const getDocumentDownloadUrl = (id) => {
  return `${api.defaults.baseURL}/documents/${id}/download`;
};
