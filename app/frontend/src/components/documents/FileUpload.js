import React, { useRef, useState } from 'react';
import Button from '../common/Button';

/**
 * Component for handling file uploads with drag-and-drop and preview capabilities
 */
const FileUpload = ({ onFileChange, acceptedFileTypes = '*', maxSizeMB = 50 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Convert acceptedFileTypes string to array for validation
  const acceptedTypes = acceptedFileTypes.split(',');
  
  // Calculate max file size in bytes
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const validateFile = (file) => {
    // Check file type
    const fileType = file.type;
    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    
    const isTypeValid = acceptedTypes.some(type => {
      if (type === '*') return true;
      if (type.startsWith('.')) return fileExtension === type;
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(`${category}/`);
      }
      return fileType === type;
    });
    
    if (!isTypeValid) {
      setError(`Invalid file type. Accepted types: ${acceptedFileTypes}`);
      return false;
    }
    
    // Check file size
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      onFileChange(file);
    }
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (validateFile(file)) {
        onFileChange(file);
      }
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="file-upload">
      <div 
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedFileTypes}
          className="file-input"
          style={{ display: 'none' }}
        />
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <p>Drag & drop a file here, or click to select</p>
        <p className="file-types">Accepted types: {acceptedFileTypes}</p>
        <p className="file-size">Max size: {maxSizeMB}MB</p>
      </div>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="upload-actions">
        <Button type="button" onClick={handleButtonClick}>
          Select File
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;