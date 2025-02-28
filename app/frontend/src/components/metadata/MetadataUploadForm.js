import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * A component for capturing the 5W metadata (Who, What, Why, When, Where)
 * during document upload.
 */
const MetadataUploadForm = ({ initialData, onMetadataChange }) => {
  const [metadata, setMetadata] = useState({
    what: initialData?.what || '',
    why: initialData?.why || '',
    when: initialData?.when || new Date().toISOString().split('T')[0],
    where: initialData?.where || '',
  });
  
  // "Who" can have multiple values, with the uploader always included
  const [whoList, setWhoList] = useState(
    initialData?.whoList || [{ id: 1, name: initialData?.uploaderName || '', role: 'Uploader', isPrimary: true }]
  );
  const [newWhoName, setNewWhoName] = useState('');
  const [newWhoRole, setNewWhoRole] = useState('');

  // Handle metadata field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedMetadata = {
      ...metadata,
      [name]: value
    };
    
    setMetadata(updatedMetadata);
    
    // Notify parent component of changes
    onMetadataChange({
      ...updatedMetadata,
      whoList
    });
  };

  // Add a new "who" to the list
  const handleAddWho = () => {
    if (newWhoName.trim() && newWhoRole.trim()) {
      const updatedWhoList = [
        ...whoList,
        {
          id: Date.now(), // Use timestamp as temporary ID
          name: newWhoName,
          role: newWhoRole,
          isPrimary: false
        }
      ];
      
      setWhoList(updatedWhoList);
      setNewWhoName('');
      setNewWhoRole('');
      
      // Notify parent component of changes
      onMetadataChange({
        ...metadata,
        whoList: updatedWhoList
      });
    }
  };

  // Remove a "who" from the list (except the primary uploader)
  const handleRemoveWho = (id) => {
    const whoToRemove = whoList.find(who => who.id === id);
    if (whoToRemove && !whoToRemove.isPrimary) {
      const updatedWhoList = whoList.filter(who => who.id !== id);
      
      setWhoList(updatedWhoList);
      
      // Notify parent component of changes
      onMetadataChange({
        ...metadata,
        whoList: updatedWhoList
      });
    }
  };

  return (
    <div className="metadata-form">
      {/* What */}
      <div className="form-group">
        <label htmlFor="what">What</label>
        <Input
          id="what"
          type="text"
          name="what"
          placeholder="What is this document about?"
          value={metadata.what}
          onChange={handleInputChange}
          required
        />
      </div>
      
      {/* Why */}
      <div className="form-group">
        <label htmlFor="why">Why</label>
        <Input
          id="why"
          type="text"
          name="why"
          placeholder="Why was this document created?"
          value={metadata.why}
          onChange={handleInputChange}
          required
        />
      </div>
      
      {/* When */}
      <div className="form-group">
        <label htmlFor="when">When</label>
        <Input
          id="when"
          type="date"
          name="when"
          value={metadata.when}
          onChange={handleInputChange}
          required
        />
      </div>
      
      {/* Where */}
      <div className="form-group">
        <label htmlFor="where">Where</label>
        <Input
          id="where"
          type="text"
          name="where"
          placeholder="Where was this document created?"
          value={metadata.where}
          onChange={handleInputChange}
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
                  aria-label={`Remove ${who.name}`}
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
            aria-label="Person name"
          />
          <Input
            type="text"
            placeholder="Role"
            value={newWhoRole}
            onChange={(e) => setNewWhoRole(e.target.value)}
            aria-label="Person role"
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
    </div>
  );
};

export default MetadataUploadForm;