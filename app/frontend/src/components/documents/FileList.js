import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocuments from '../../hooks/useDocuments';
import '../../styles/components/FileList.css';

const FileList = () => {
  const { documents, loading, error, deleteDocument, getDownloadUrl, fetchDocuments } = useDocuments();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (id, documentName) => {
    if (window.confirm(`Are you sure you want to delete "${documentName}"?`)) {
      try {
        setDeleteInProgress(true);
        setDeleteError('');
        await deleteDocument(id);
      } catch (err) {
        setDeleteError('Failed to delete document. Please try again.');
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType.startsWith('video/')) {
      return '🎬';
    } else if (fileType.startsWith('audio/')) {
      return '🎵';
    } else if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝';
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return '📊';
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return '📑';
    } else {
      return '📁';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="loading-indicator">Loading documents...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={fetchDocuments}>
          Try Again
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <h3>No documents yet</h3>
        <p>Upload your first document to get started</p>
        <Link to="/upload" className="btn btn-primary">
          Upload Document
        </Link>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      {deleteError && <div className="error-message">{deleteError}</div>}
      
      <div className="file-list-header">
        <div className="file-name">Name</div>
        <div className="file-size">Size</div>
        <div className="file-date">Date</div>
        <div className="file-actions">Actions</div>
      </div>
      
      <ul className="file-list">
        {documents.map((document) => (
          <li key={document.id} className="file-item">
            <div className="file-name">
              <span className="file-icon">{getFileIcon(document.file_type)}</span>
              <span className="file-title">{document.title}</span>
            </div>
            <div className="file-size">{formatFileSize(document.file_size)}</div>
            <div className="file-date">{formatDate(document.created_at)}</div>
            <div className="file-actions">
              <a 
                href={getDownloadUrl(document.id)} 
                className="btn btn-sm btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(document.id, document.title)}
                disabled={deleteInProgress}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;