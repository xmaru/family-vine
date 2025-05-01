import React, { useState } from "react";
import usePersons from "../../hooks/usePersons";
import "../../styles/components/PeopleList.css";

const PeopleList = () => {
  const { persons, loading, error, removePerson, editPerson, fetchPersons } = usePersons();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [editingPerson, setEditingPerson] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", birthday: "" });
  const [editError, setEditError] = useState("");

  const handleDelete = async (id, personName) => {
    if (window.confirm(`Are you sure you want to delete "${personName}"?`)) {
      try {
        setDeleteInProgress(true);
        setDeleteError("");
        await removePerson(id);
      } catch (err) {
        setDeleteError("Failed to delete person. Please try again.");
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  const handleEditClick = (person) => {
    setEditingPerson(person.id);
    setEditFormData({ name: person.name, birthday: person.birthday });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditError("");
      await editPerson(editingPerson, editFormData);
      setEditingPerson(null); // Exit edit mode
    } catch (err) {
      setEditError("Failed to update person. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setEditFormData({ name: "", birthday: "" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading-indicator">Loading people...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={fetchPersons}>
          Try Again
        </button>
      </div>
    );
  }

  if (persons.length === 0) {
    return (
      <div className="empty-state">
        <h3>No people added yet</h3>
        <p>Add someone to your family tree to get started</p>
      </div>
    );
  }

  return (
    <div className="people-list-container">
      {deleteError && <div className="error-message">{deleteError}</div>}
      {editError && <div className="error-message">{editError}</div>}

      <div className="people-list-header">
        <div className="person-name">Name</div>
        <div className="person-birthday">Birthday</div>
        <div className="person-actions">Actions</div>
      </div>

      <ul className="people-list">
        {persons.map((person) => (
          <li key={person.id} className="person-item">
            {editingPerson === person.id ? (
              <form className="edit-form" onSubmit={handleEditSubmit}>
                <div className="person-name">
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="person-birthday">
                  <input
                    type="date"
                    name="birthday"
                    value={editFormData.birthday}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="person-actions">
                  <button type="submit" className="btn btn-sm btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="person-name">{person.name}</div>
                <div className="person-birthday">
                  {person.birthday ? formatDate(person.birthday) : "N/A"}
                </div>
                <div className="person-actions">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEditClick(person)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(person.id, person.name)}
                    disabled={deleteInProgress}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;