import { useState, useEffect, useCallback } from 'react';
import { getDocuments, uploadDocument, deleteDocument, getDocumentDownloadUrl } from '../api/documents';

const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.detail || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload document
  const uploadNewDocument = async (formData, onProgress) => {
    try {
      setError(null);
      
      const response = await uploadDocument(formData, {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      
      // Add the new document to the list
      setDocuments((prevDocuments) => [...prevDocuments, response.data]);
      
      return response.data;
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.response?.data?.detail || 'Failed to upload document');
      throw err;
    }
  };

  // Delete document
  const removeDocument = async (documentId) => {
    try {
      setError(null);
      await deleteDocument(documentId);
      
      // Remove the document from the list
      setDocuments((prevDocuments) => 
        prevDocuments.filter((doc) => doc.id !== documentId)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.response?.data?.detail || 'Failed to delete document');
      throw err;
    }
  };

  // Get download URL for a document
  const getDownloadUrl = (documentId) => {
    return getDocumentDownloadUrl(documentId);
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument: uploadNewDocument,
    deleteDocument: removeDocument,
    getDownloadUrl,
  };
};

export default useDocuments;