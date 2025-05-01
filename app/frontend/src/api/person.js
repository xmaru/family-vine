import api from "./index";

/**
 * Creates a new person.
 * @param {Object} personData - The data for the new person (e.g., name, birthday, description).
 * @returns {Promise<Object>} - The created person object.
 */
export const createPerson = (personData) => {
  return api.post("/person/", personData);
};

/**
 * Retrieves a list of people for the current user.
 * @param {Object} params - Query parameters for filtering and pagination.
 * @param {number} [params.skip] - Number of records to skip (for pagination).
 * @param {number} [params.limit] - Maximum number of records to return.
 * @returns {Promise<Array>} - List of people.
 */
export const getPeople = (params = {}) => {
  return api.get("/person/", { params });
};

/**
 * Retrieves a specific person by their ID.
 * @param {number} id - The unique identifier of the person.
 * @returns {Promise<Object>} - The person object.
 */
export const getPerson = (id) => {
  return api.get(`/person/${id}`);
};

/**
 * Updates an existing person's details.
 * @param {number} id - The unique identifier of the person to update.
 * @param {Object} personData - The updated data for the person.
 * @returns {Promise<Object>} - The updated person object.
 */
export const updatePerson = (id, personData) => {
  return api.put(`/person/${id}`, personData);
};

/**
 * Deletes a person by their ID.
 * @param {number} id - The unique identifier of the person to delete.
 * @returns {Promise<void>} - Resolves when the person is deleted.
 */
export const deletePerson = (id) => {
  return api.delete(`/person/${id}`);
};