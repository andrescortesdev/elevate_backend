import Candidate from '../entities/CandidateEntity.js';
import { Op } from 'sequelize';

// GET methods
/**
 * Retrieves all candidates from the database ordered by most recent first.
 *  
 * @async
 * @function getAllCandidates
 * @returns {Promise<Array>} A promise that resolves to an array of all candidate objects ordered by candidate_id in descending order
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function fetches all candidates from the database and orders them by candidate_id in descending order,
 * showing the most recently created candidates first.
 * 
 * @example
 * // Get all candidates
 * const allCandidates = await getAllCandidates();
 * console.log(allCandidates); // Array of candidate objects
 */
export const getAllCandidates = async () => {
    try {
        const candidates = await Candidate.findAll({
            order: [['candidate_id', 'DESC']] // Order by most recent first
        });
        return candidates;
    } catch (error) {
        console.error('Error fetching all candidates:', error);
        throw error;
    }
};

/**
 * Retrieves a single candidate from the database by their unique ID.
 * 
 * @async
 * @function getCandidateById
 * @param {number|string} id - The unique candidate ID to search for
 * @returns {Promise<Object|null>} A promise that resolves to the candidate object if found, or null if not found
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function searches for a candidate using their unique candidate_id.
 * Returns null if no candidate is found with the specified ID.
 * 
 * @example
 * // Get candidate with ID 123
 * const candidate = await getCandidateById(123);
 * if (candidate) {
 *   console.log(candidate.name);
 * } else {
 *   console.log('Candidate not found');
 * }
 */
export const getCandidateById = async (id) => {
    try {
        const candidate = await Candidate.findOne({
            where: { candidate_id: id }
        });
        return candidate;
    } catch (error) {
        console.error('Error fetching candidate by ID:', error);
        throw error;
    }
};

/**
 * Retrieves a single candidate from the database by their email address.
 * 
 * @async
 * @function getCandidateByEmail
 * @param {string} email - The email address to search for
 * @returns {Promise<Object|null>} A promise that resolves to the candidate object if found, or null if not found
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function searches for a candidate using their email address.
 * Email addresses should be unique in the system, so this returns a single candidate or null.
 * 
 * @example
 * // Get candidate by email
 * const candidate = await getCandidateByEmail('john.doe@example.com');
 * if (candidate) {
 *   console.log(`Found candidate: ${candidate.name}`);
 * }
 */
export const getCandidateByEmail = async (email) => {
    try {
        const candidate = await Candidate.findOne({
            where: { email: email }
        });
        return candidate;
    } catch (error) {
        console.error('Error finding candidate by email:', error);
        throw error;
    }
};

/**
 * Retrieves a single candidate from the database by their name.
 * 
 * @async
 * @function getCandidateByName
 * @param {string} name - The candidate's name to search for
 * @returns {Promise<Object|null>} A promise that resolves to the candidate object if found, or null if not found
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function searches for a candidate using their name.
 * Note that if multiple candidates have the same name, this will return only the first match found.
 * For more comprehensive name searches, consider using the searchCandidates function.
 * 
 * @example
 * // Get candidate by exact name match
 * const candidate = await getCandidateByName('John Doe');
 * if (candidate) {
 *   console.log(`Found candidate: ${candidate.email}`);
 * }
 */
export const getCandidateByName = async (name) => {
    try {
        const candidate = await Candidate.findOne({
            where: { name: name }
        });
        return candidate;
    } catch (error) {
        console.error('Error finding candidate by name:', error);
        throw error;
    }
};

/**
 * Searches for candidates based on a query string across multiple fields.
 * The search is case-insensitive in MySQL by default.
 * 
 * @async
 * @function searchCandidates
 * @param {string} query - The search query to match against candidate fields
 * @returns {Promise<Array>} A promise that resolves to an array of candidate objects matching the search criteria
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function performs a case-insensitive search across candidate fields including:
 * - name
 * - email
 * - occupation
 * - skills
 * - languages
 * 
 * The search uses the SQL LIKE operator with wildcards to find partial matches.
 * 
 * @example
 * // Search for candidates with "Python" in skills or occupation
 * const results2 = await searchCandidates("Python");
 */
export const searchCandidates = async (query) => {
    try {
        const candidates = await Candidate.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { occupation: { [Op.like]: `%${query}%` } },
                    { skills: { [Op.like]: `%${query}%` } },
                    { languages: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        return candidates;
    } catch (error) {
        console.error('Error searching candidates:', error);
        throw error;
    }
};

/**
 * Retrieves candidates from the database based on the provided filter criteria.
 * 
 * @async
 * @function getCandidatesByFilter
 * @param {Object} filter - The filter object containing criteria to search candidates
 * @returns {Promise<Array>} A promise that resolves to an array of candidate objects matching the filter
 * @throws {Error} Throws an error if the database query fails
 * 
 * @example
 * // Get candidates by status
 * const activeCandidates = await getCandidatesByFilter({ status: 'active' });
 * 
 * @example
 * // Get candidates by multiple criteria
 * const filteredCandidates = await getCandidatesByFilter({ 
 *   status: 'active', 
 *   department: 'IT' 
 * });
 */
export const getCandidatesByFilter = async (filter) => {
    try {
        const candidates = await Candidate.findAll({
            where: filter
        });
        return candidates;
    } catch (error) {   
        console.error('Error fetching candidates by filter:', error);
        throw error;
    }
};

// CREATE methods
/**
 * Creates a new candidate in the database or updates an existing one if email already exists.
 * 
 * @async
 * @function createCandidate
 * @param {Object} candidate - The candidate object containing all candidate information
 * @param {string} [candidate.name] - The candidate's full name
 * @param {string} [candidate.email] - The candidate's email address (used for conflict resolution)
 * @param {string} [candidate.phone] - The candidate's phone number
 * @param {string|Date} [candidate.date_of_birth] - The candidate's date of birth
 * @param {string} [candidate.occupation] - The candidate's current occupation
 * @param {string} [candidate.summary] - A brief summary about the candidate
 * @param {string} [candidate.experience] - The candidate's work experience details
 * @param {string} [candidate.skills] - The candidate's skills (comma-separated or formatted string)
 * @param {string} [candidate.languages] - Languages the candidate speaks
 * @param {string} [candidate.education] - The candidate's educational background
 * @returns {Promise<number>} A promise that resolves to the candidate_id of the created or updated candidate
 * @throws {Error} Throws an error if the database operation fails
 * 
 * @description This function uses Sequelize's upsert method to handle INSERT ... ON DUPLICATE KEY UPDATE.
 * If a candidate with the same email already exists, their information will be updated.
 * If the email is unique, a new candidate record will be created.
 * All fields are optional and will be set to null if not provided.
 * 
 * @example
 * // Create a new candidate
 * const candidateData = {
 *   name: 'Jane Smith',
 *   email: 'jane.smith@example.com',
 *   phone: '+1234567890',
 *   occupation: 'Software Engineer',
 *   skills: 'JavaScript, React, Node.js'
 * };
 * const candidateId = await createCandidate(candidateData);
 * console.log(`Candidate created with ID: ${candidateId}`);
 */
export const createCandidate = async (candidate) => {
    const {
        name,
        email,
        phone,
        date_of_birth,
        occupation,
        summary,
        experience,
        skills,
        languages,
        education
    } = candidate;

    try {
        // Use Sequelize's upsert method to handle INSERT ... ON DUPLICATE KEY UPDATE
        const [candidateInstance, created] = await Candidate.upsert({
            name: name || null,
            email: email || null,
            phone: phone || null,
            date_of_birth: date_of_birth || null,
            occupation: occupation || null,
            summary: summary || null,
            experience: experience || null,
            skills: skills || null,
            languages: languages || null,
            education: education || null
        }, {
            conflictFields: ['email'], // Specify the unique field for conflict resolution
            returning: true // Return the instance
        });

        return candidateInstance.candidate_id;
    } catch (error) {
        console.error('Error inserting candidate:', error);
        throw error;
    }
};

// UPDATE methods
/**
 * Updates an existing candidate's information by their ID.
 * 
 * @async
 * @function updateCandidateById
 * @param {number|string} id - The unique candidate ID to update
 * @param {Object} updatedData - An object containing the fields to update
 * @param {string} [updatedData.name] - Updated candidate name
 * @param {string} [updatedData.email] - Updated candidate email
 * @param {string} [updatedData.phone] - Updated candidate phone
 * @param {string|Date} [updatedData.date_of_birth] - Updated date of birth
 * @param {string} [updatedData.occupation] - Updated occupation
 * @param {string} [updatedData.summary] - Updated candidate summary
 * @param {string} [updatedData.experience] - Updated experience details
 * @param {string} [updatedData.skills] - Updated skills
 * @param {string} [updatedData.languages] - Updated languages
 * @param {string} [updatedData.education] - Updated education information
 * @returns {Promise<number>} A promise that resolves to the number of affected rows (1 if successful, 0 if candidate not found)
 * @throws {Error} Throws an error if the database update operation fails
 * 
 * @description This function updates a candidate's information based on their candidate_id.
 * Only the fields provided in updatedData will be modified.
 * Returns the number of affected rows, which will be 1 if the update was successful or 0 if no candidate was found with the given ID.
 * 
 * @example
 * // Update candidate's occupation and skills
 * const updateData = {
 *   occupation: 'Senior Software Engineer',
 *   skills: 'JavaScript, React, Node.js, Python'
 * };
 * const affectedRows = await updateCandidateById(123, updateData);
 * if (affectedRows > 0) {
 *   console.log('Candidate updated successfully');
 * } else {
 *   console.log('Candidate not found');
 * }
 */
export const updateCandidateById = async (id, updatedData) => {
    try {
        const [updatedCandidate] = await Candidate.update(updatedData, {
            where: { candidate_id: id },
            returning: true
        });
        return updatedCandidate;
    } catch (error) {
        console.error('Error updating candidate by ID:', error);
        throw error;
    }
};

/**
 * Updates an existing candidate's information by their email address.
 * 
 * @async
 * @function updateCandidateByEmail
 * @param {string} email - The email address of the candidate to update
 * @param {Object} updatedData - An object containing the fields to update
 * @param {string} [updatedData.name] - Updated candidate name
 * @param {string} [updatedData.email] - Updated candidate email
 * @param {string} [updatedData.phone] - Updated candidate phone
 * @param {string|Date} [updatedData.date_of_birth] - Updated date of birth
 * @param {string} [updatedData.occupation] - Updated occupation
 * @param {string} [updatedData.summary] - Updated candidate summary
 * @param {string} [updatedData.experience] - Updated experience details
 * @param {string} [updatedData.skills] - Updated skills
 * @param {string} [updatedData.languages] - Updated languages
 * @param {string} [updatedData.education] - Updated education information
 * @returns {Promise<number>} A promise that resolves to the number of affected rows (1 if successful, 0 if candidate not found)
 * @throws {Error} Throws an error if the database update operation fails
 * 
 * @description This function updates a candidate's information based on their email address.
 * Only the fields provided in updatedData will be modified.
 * Returns the number of affected rows, which will be 1 if the update was successful or 0 if no candidate was found with the given email.
 * 
 * @example
 * // Update candidate's phone and summary by email
 * const updateData = {
 *   phone: '+1987654321',
 *   summary: 'Experienced full-stack developer with 5+ years of experience'
 * };
 * const affectedRows = await updateCandidateByEmail('john.doe@example.com', updateData);
 * if (affectedRows > 0) {
 *   console.log('Candidate updated successfully');
 * }
 */
export const updateCandidateByEmail = async (email, updatedData) => {
    try {
        const [updatedCandidate] = await Candidate.update(updatedData, {
            where: { email: email },
            returning: true
        });
        return updatedCandidate;
    } catch (error) {
        console.error('Error updating candidate by email:', error);
        throw error;
    }
};

// DELETE methods
/**
 * Deletes a candidate from the database by their unique ID.
 * 
 * @async
 * @function deleteCandidateById
 * @param {number|string} id - The unique candidate ID to delete
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 if successful, 0 if candidate not found)
 * @throws {Error} Throws an error if the database delete operation fails
 * 
 * @description This function permanently removes a candidate from the database based on their candidate_id.
 * Returns the number of affected rows, which will be 1 if the deletion was successful or 0 if no candidate was found with the given ID.
 * This operation is irreversible, so use with caution.
 * 
 * @example
 * // Delete candidate with ID 123
 * const deletedRows = await deleteCandidateById(123);
 * if (deletedRows > 0) {
 *   console.log('Candidate deleted successfully');
 * } else {
 *   console.log('Candidate not found');
 * }
 */
export const deleteCandidateById = async (id) => {
    try {
        const result = await Candidate.destroy({
            where: { candidate_id: id }
        });
        return result;
    } catch (error) {
        console.error('Error deleting candidate by ID:', error);
        throw error;
    }
};

/**
 * Deletes a candidate from the database by their email address.
 * 
 * @async
 * @function deleteCandidateByEmail
 * @param {string} email - The email address of the candidate to delete
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 if successful, 0 if candidate not found)
 * @throws {Error} Throws an error if the database delete operation fails
 * 
 * @description This function permanently removes a candidate from the database based on their email address.
 * Returns the number of affected rows, which will be 1 if the deletion was successful or 0 if no candidate was found with the given email.
 * This operation is irreversible, so use with caution.
 * 
 * @example
 * // Delete candidate by email
 * const deletedRows = await deleteCandidateByEmail('john.doe@example.com');
 * if (deletedRows > 0) {
 *   console.log('Candidate deleted successfully');
 * } else {
 *   console.log('Candidate not found with that email');
 * }
 */
export const deleteCandidateByEmail = async (email) => {
    try {
        const result = await Candidate.destroy({
            where: { email: email }
        });
        return result;
    } catch (error) {
        console.error('Error deleting candidate by email:', error);
        throw error;
    }
};
