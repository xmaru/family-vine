import { useState, useEffect, useCallback } from "react";
import {
  getPeople,
  createPerson,
  updatePerson,
  deletePerson,
  getPerson,
} from "../api/person";

const usePersons = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch persons
  const fetchPersons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPeople();
      setPersons(response.data);
    } catch (err) {
      console.error("Error fetching persons:", err);
      setError(err.response?.data?.detail || "Failed to fetch persons");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new person
  const addPerson = async (personData) => {
    try {
      setError(null);
      const response = await createPerson(personData);
      setPersons((prevPersons) => [...prevPersons, response]);
      return response;
    } catch (err) {
      console.error("Error adding person:", err);
      setError(err.response?.data?.detail || "Failed to add person");
      throw err;
    }
  };

  // Update an existing person
  const editPerson = async (personId, personData) => {
    try {
      setError(null);
      const response = await updatePerson(personId, personData);
      setPersons((prevPersons) =>
        prevPersons.map((person) =>
          person.id === personId ? { ...person, ...response } : person
        )
      );
      return response;
    } catch (err) {
      console.error("Error updating person:", err);
      setError(err.response?.data?.detail || "Failed to update person");
      throw err;
    }
  };

  // Delete a person
  const removePerson = async (personId) => {
    try {
      setError(null);
      await deletePerson(personId);
      setPersons((prevPersons) =>
        prevPersons.filter((person) => person.id !== personId)
      );
      return true;
    } catch (err) {
      console.error("Error deleting person:", err);
      setError(err.response?.data?.detail || "Failed to delete person");
      throw err;
    }
  };

  // Fetch a specific person by ID
  const fetchPersonById = async (personId) => {
    try {
      setError(null);
      const response = await getPerson(personId);
      return response;
    } catch (err) {
      console.error("Error fetching person:", err);
      setError(err.response?.data?.detail || "Failed to fetch person");
      throw err;
    }
  };

  // Fetch persons on component mount
  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  return {
    persons,
    loading,
    error,
    fetchPersons,
    addPerson,
    editPerson,
    removePerson,
    fetchPersonById,
  };
};

export default usePersons;