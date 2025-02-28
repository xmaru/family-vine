import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/documents/FileUpload';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { uploadDocument } from '../api/documents';
import { saveMetadata } from '../api/metadata';
import { saveRelationships } from '../api/relationships';

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  // Metadata state
  const [metadata, setMetadata] = useState({
    what: '',
    why: '',
    when: new Date().toISOString().split('T')[0], // Default to today
    where: '',
  });
  
  // "Who" can have multiple values, but will always include the uploader
  const [whoList, setWhoList] = useState([
    { id: 1, name: user?.name || '', role: 'Uploader', isPrimary: true }
  ]);
  const [newWhoName, setNewWhoName] = useState('');
  const [newWhoRole, setNewWhoRole] = useState('');

  // Handle file upload
  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
    
    // Create preview for images
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      // For non-image files, just show the file name
      setFilePreview(null);
    }
  };

  // Handle metadata changes
  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata({
      ...metadata,
      [name]: value
    });
  };

  // Add a new "who" to the list
  const handleAddWho = () => {
    if (newWhoName.trim() && newWhoRole.trim()) {
      setWhoList([
        ...whoList,
        {
          id: Date.now(), // Use timestamp as temporary ID
          name: newWhoName,
          role: newWhoRole,
          isPrimary: false
        }
      ]);
      setNewWhoName('');
      setNewWhoRole('');
    }
  };

  // Remove a "who" from the list (except the primary uploader)
  const handleRemoveWho = (id) => {
    const whoToRemove = whoList.find(who => who.id === id);
    if (whoToRemove && !whoToRemove.isPrimary) {
      setWhoList(whoList.filter(who => who.id !== id));
    }
  };

  // Submit the upload form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Upload the document first
      const documentResponse = await uploadDocument(file);
      const documentId = documentResponse.id;
      
      // 2. Save the metadata with reference to the document
      const metadataPayload = {
        documentId,
        ...metadata,
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString()
      };
      await saveMetadata(metadataPayload);
      
      // 3. Save all the "who" relationships
      const relationshipsPayload = whoList.map(who => ({
        documentId,
        personName: who.name,
        role: who.role,
        isPrimary: who.isPrimary
      }));
      await saveRelationships(relationshipsPayload);
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to documents page after successful upload
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/documents');
  };

  return (
    <div className="upload-page">
      <h1>Upload Document</h1>
      <p>Upload a file (PNG, Video, PDF) and provide the 5W metadata.</p>
      
      <form onSubmit={handleSubmit}>
        {/* File Upload Section */}
        <section className="upload-section">
          <h2>Select File</h2>
          <FileUpload 
            onFileChange={handleFileChange} 
            acceptedFileTypes="image/png,video/*,.pdf"
          />
          
          {filePreview && (
            <div className="file-preview">
              <img src={filePreview} alt="Preview" />
            </div>
          )}
          
          {file && !filePreview && (
            <div className="file-info">
              <p>File: {file.name} ({Math.round(file.size / 1024)} KB)</p>
              <p>Type: {file.type}</p>
            </div>
          )}
        </section>
        
        {/* Metadata Section */}
        <section className="metadata-section">
          <h2>Document Metadata</h2>
          
          {/* What */}
          <div className="form-group">
            <label>What</label>
            <Input
              type="text"
              name="what"
              placeholder="What is this document about?"
              value={metadata.what}
              onChange={handleMetadataChange}
              required
            />
          </div>
          
          {/* Why */}
          <div className="form-group">
            <label>Why</label>
            <Input
              type="text"
              name="why"
              placeholder="Why was this document created?"
              value={metadata.why}
              onChange={handleMetadataChange}
              required
            />
          </div>
          
          {/* When */}
          <div className="form-group">
            <label>When</label>
            <Input
              type="date"
              name="when"
              value={metadata.when}
              onChange={handleMetadataChange}
              required
            />
          </div>
          
          {/* Where */}
          <div className="form-group">
            <label>Where</label>
            <Input
              type="text"
              name="where"
              placeholder="Where was this document created?"
              value={metadata.where}
              onChange={handleMetadataChange}
              required
            />
          </div>
          
          {/* Who Section */}
          <div className="who-section">
            <h3>Who</h3>
            <p>Add all people associated with this document. The uploader is automatically included.</p>
            
            {/* List of existing "who" entries */}
            <ul className="who-list">
              {whoList.map(who => (
                <li key={who.id} className={who.isPrimary ? 'primary' : ''}>
                  <span>{who.name} ({who.role})</span>
                  {!who.isPrimary && (
                    <button 
                      type="button" 
                      className="remove-button"
                      onClick={() => handleRemoveWho(who.id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Add new "who" form */}
            <div className="add-who-form">
              <Input
                type="text"
                placeholder="Name"
                value={newWhoName}
                onChange={(e) => setNewWhoName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Role"
                value={newWhoRole}
                onChange={(e) => setNewWhoRole(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={handleAddWho}
                disabled={!newWhoName.trim() || !newWhoRole.trim()}
              >
                Add Person
              </Button>
            </div>
          </div>
        </section>
        
        {/* Submit Button */}
        <div className="actions">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </form>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <Modal onClose={handleSuccessModalClose}>
          <h2>Upload Successful</h2>
          <p>Your document has been uploaded successfully.</p>
          <Button onClick={handleSuccessModalClose}>
            View Documents
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default UploadPage;