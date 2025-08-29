import * as candidatesModel from "../models/services/CandidateServices.js";

/**
 * Controller function to retrieve all candidates from the database.
 * 
 * @async
 * @function getAllCandidatesController
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with all candidates array or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve all candidates.
 * It calls the candidatesModel.getAllCandidates() service function and returns
 * the results ordered by most recent first (candidate_id DESC).
 * 
 * @example
 * // Example request
 * GET /api/candidates
 * 
 * // Success response (200)
 * [
 *   {
 *     "candidate_id": 123,
 *     "name": "John Doe",
 *     "email": "john.doe@example.com",
 *     "occupation": "Software Engineer",
 *     "skills": "JavaScript, React, Node.js"
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching candidates"
 * }
 */
export const getAllCandidatesController = async (req, res) => {
  try {
    const allCandidates = await candidatesModel.getAllCandidates();
    return res.status(200).json(allCandidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return res.status(500).json({ error: "Error fetching candidates" });
  }
};

/**
 * Controller function to retrieve a specific candidate by their unique ID.
 * 
 * @async
 * @function getCandidateByIdController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The unique candidate ID to search for
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with candidate object or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve a candidate by their ID.
 * It extracts the ID from request parameters, calls the candidatesModel.getCandidateById() service,
 * and returns the candidate data if found, or a 404 error if not found.
 * 
 * @example
 * // Example request
 * GET /api/candidates/123
 * 
 * // Success response (200)
 * {
 *   "candidate_id": 123,
 *   "name": "John Doe",
 *   "email": "john.doe@example.com",
 *   "phone": "+1234567890",
 *   "occupation": "Software Engineer"
 * }
 * 
 * // Not found response (404)
 * {
 *   "error": "Candidate not found"
 * }
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching candidate by ID"
 * }
 */
export const getCandidateByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await candidatesModel.getCandidateById(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    return res.status(500).json({ error: "Error fetching candidate by ID" });
  }
};

/**
 * Controller function to retrieve a specific candidate by their email address.
 * 
 * @async
 * @function getCandidateByEmailController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.email - The email address to search for
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with candidate object or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve a candidate by their email.
 * It extracts the email from request parameters, calls the candidatesModel.getCandidateByEmail() service,
 * and returns the candidate data if found, or a 404 error if not found.
 * Email addresses should be unique in the system.
 * 
 * @example
 * // Example request
 * GET /api/candidates/email/john.doe@example.com
 * 
 * // Success response (200)
 * {
 *   "candidate_id": 123,
 *   "name": "John Doe",
 *   "email": "john.doe@example.com",
 *   "phone": "+1234567890",
 *   "occupation": "Software Engineer"
 * }
 * 
 * // Not found response (404)
 * {
 *   "error": "Candidate not found"
 * }
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching candidate by email"
 * }
 */
export const getCandidateByEmailController = async (req, res) => {
  const { email } = req.params;
  try {
    const candidate = await candidatesModel.getCandidateByEmail(email);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate by email:", error);
    return res.status(500).json({ error: "Error fetching candidate by email" });
  }
};

/**
 * Controller function to retrieve a specific candidate by their name.
 * 
 * @async
 * @function getCandidateByNameController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.name - The candidate's name to search for
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with candidate object or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve a candidate by their name.
 * It extracts the name from request parameters, calls the candidatesModel.getCandidateByName() service,
 * and returns the candidate data if found, or a 404 error if not found.
 * Note: If multiple candidates have the same name, this returns only the first match found.
 * For more comprehensive name searches, consider using the search functionality.
 * 
 * @example
 * // Example request
 * GET /api/candidates/name/John%20Doe
 * 
 * // Success response (200)
 * {
 *   "candidate_id": 123,
 *   "name": "John Doe",
 *   "email": "john.doe@example.com",
 *   "phone": "+1234567890",
 *   "occupation": "Software Engineer"
 * }
 * 
 * // Not found response (404)
 * {
 *   "error": "Candidate not found"
 * }
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching candidate by name"
 * }
 */
export const getCandidateByNameController = async (req, res) => {
  const { name } = req.params;
  try {
    const candidate = await candidatesModel.getCandidateByName(name);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate by name:", error);
    return res.status(500).json({ error: "Error fetching candidate by name" });
  }
};

/**
 * Controller function to create a new candidate in the database.
 * 
 * @async
 * @function createCandidateController
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing candidate data
 * @param {string} [req.body.name] - The candidate's full name
 * @param {string} [req.body.email] - The candidate's email address (used for conflict resolution)
 * @param {string} [req.body.phone] - The candidate's phone number
 * @param {string|Date} [req.body.date_of_birth] - The candidate's date of birth
 * @param {string} [req.body.occupation] - The candidate's current occupation
 * @param {string} [req.body.summary] - A brief summary about the candidate
 * @param {string} [req.body.experience] - The candidate's work experience details
 * @param {string} [req.body.skills] - The candidate's skills (comma-separated or formatted string)
 * @param {string} [req.body.languages] - Languages the candidate speaks
 * @param {string} [req.body.education] - The candidate's educational background
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with created candidate ID or error message
 * @throws {Error} Returns 500 status with error message if database operation fails
 * 
 * @description This controller handles POST requests to create a new candidate.
 * It uses the candidatesModel.createCandidate() service which implements upsert functionality:
 * - If a candidate with the same email exists, their information will be updated
 * - If the email is unique, a new candidate record will be created
 * All fields are optional and will be set to null if not provided.
 * 
 * @example
 * // Example request
 * POST /api/candidates
 * Content-Type: application/json
 * 
 * {
 *   "name": "Jane Smith",
 *   "email": "jane.smith@example.com",
 *   "phone": "+1234567890",
 *   "occupation": "Software Engineer",
 *   "skills": "JavaScript, React, Node.js"
 * }
 * 
 * // Success response (201)
 * {
 *   "candidate_id": 124
 * }
 * 
 * // Error response (500)
 * {
 *   "error": "Error creating candidate"
 * }
 */
export const createCandidateController = async (req, res) => {
  const candidateData = req.body;
  try {
    const candidateId = await candidatesModel.createCandidate(candidateData);
    return res.status(201).json({ candidate_id: candidateId });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return res.status(500).json({ error: "Error creating candidate" });
  }
};

/**
 * Controller function to update an existing candidate's information by their ID.
 * 
 * @async
 * @function updateCandidateController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The unique candidate ID to update
 * @param {Object} req.body - Request body containing updated candidate data
 * @param {string} [req.body.name] - Updated candidate name
 * @param {string} [req.body.email] - Updated candidate email
 * @param {string} [req.body.phone] - Updated candidate phone
 * @param {string|Date} [req.body.date_of_birth] - Updated date of birth
 * @param {string} [req.body.occupation] - Updated occupation
 * @param {string} [req.body.summary] - Updated candidate summary
 * @param {string} [req.body.experience] - Updated experience details
 * @param {string} [req.body.skills] - Updated skills
 * @param {string} [req.body.languages] - Updated languages
 * @param {string} [req.body.education] - Updated education information
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with update result or error message
 * @throws {Error} Returns 500 status with error message if database update operation fails
 * 
 * @description This controller handles PUT/PATCH requests to update a candidate's information.
 * It extracts the candidate ID from route parameters and updated data from the request body,
 * calls the candidatesModel.updateCandidateById() service, and returns the update result.
 * Only the fields provided in the request body will be modified.
 * Returns 404 if no candidate is found with the given ID.
 * 
 * @example
 * // Example request
 * PUT /api/candidates/123
 * Content-Type: application/json
 * 
 * {
 *   "occupation": "Senior Software Engineer",
 *   "skills": "JavaScript, React, Node.js, Python, AWS"
 * }
 * 
 * // Success response (200)
 * {
 *   "candidate_id": 123,
 *   "name": "John Doe",
 *   "occupation": "Senior Software Engineer",
 *   "skills": "JavaScript, React, Node.js, Python, AWS"
 * }
 * 
 * // Not found response (404)
 * {
 *   "error": "Candidate not found"
 * }
 * 
 * // Error response (500)
 * {
 *   "error": "Error updating candidate"
 * }
 */
export const updateCandidateController = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedCandidate = await candidatesModel.updateCandidateById(id, updatedData);
    if (!updatedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return res.status(500).json({ error: "Error updating candidate" });
  }
};

/**
 * Controller function to delete a candidate from the database by their unique ID.
 * 
 * @async
 * @function deleteCandidateController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The unique candidate ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with no content (204) on success or error message
 * @throws {Error} Returns 500 status with error message if database delete operation fails
 * 
 * @description This controller handles DELETE requests to permanently remove a candidate.
 * It extracts the candidate ID from route parameters, calls the candidatesModel.deleteCandidateById() service,
 * and returns a 204 No Content status on successful deletion.
 * Returns 404 if no candidate is found with the given ID.
 * This operation is irreversible, so use with caution.
 * 
 * @example
 * // Example request
 * DELETE /api/candidates/123
 * 
 * // Success response (204)
 * // No content returned
 * 
 * // Not found response (404)
 * {
 *   "error": "Candidate not found"
 * }
 * 
 * // Error response (500)
 * {
 *   "error": "Error deleting candidate"
 * }
 */
export const deleteCandidateController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await candidatesModel.deleteCandidateById(id);
    if (!result) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return res.status(500).json({ error: "Error deleting candidate" });
  }
};

/**
 * Controller function to get candidates filtered by skill, location, and experience
 * @async
 * @function getCandidatesByFilterController
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.skill] - Skill to filter candidates by
 * @param {string} [req.query.location] - Location to filter candidates by
 * @param {string} [req.query.experience] - Experience level to filter candidates by
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns filtered candidates array or error message
 * @throws {Error} Returns 500 status with error message if filtering fails
 * @example
 * // Example request
 * GET /candidates?skill=JavaScript&location=Remote&experience=Senior
 *
 * @example
 * const filter = {
 *    [Op.or]: [
 *        { occupation: "Software Developer" },
 *        { occupation: "Data Scientist" }
 *    ]
 * };
 * const techCandidates = await getCandidatesByFilter(filter);
 */
export const getCandidatesByFilterController = async (req, res) => {
  const { skill, location, experience } = req.query;
  try {
    const filteredCandidates = await candidatesModel.getCandidatesByFilter({
      skill,
      location,
      experience,
    });
    return res.status(200).json(filteredCandidates);
  } catch (error) {
    console.error("Error fetching candidates by filter:", error);
    return res.status(500).json({ error: "Error fetching candidates by filter" });
  }
};

/**
 * Controller function to get notes for a specific candidate.
 * 
 * @async
 * @function getCandidateNotesController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The unique candidate ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with notes or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve notes for a specific candidate.
 * Returns only the notes field to optimize data transfer.
 * 
 * @example
 * // Example request
 * GET /api/candidates/123/notes
 * 
 * // Success response (200)
 * {
 *   "notes": "This candidate has excellent communication skills..."
 * }
 * 
 * // Not found response (404)
 * {
 *   "error": "Candidate not found"
 * }
 */
export const getCandidateNotesController = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await candidatesModel.getCandidateById(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json({ notes: candidate.notes || "" });
  } catch (error) {
    console.error("Error fetching candidate notes:", error);
    return res.status(500).json({ error: "Error fetching candidate notes" });
  }
};

/**
 * Controller function to update notes for a specific candidate.
 * 
 * @async
 * @function updateCandidateNotesController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The unique candidate ID
 * @param {Object} req.body - Request body containing notes data
 * @param {string} req.body.notes - The notes content to save
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with success message or error
 * @throws {Error} Returns 500 status with error message if database update fails
 * 
 * @description This controller handles PUT requests to update only the notes field
 * for a specific candidate. This is more efficient than updating the entire candidate record.
 * 
 * @example
 * // Example request
 * PUT /api/candidates/123/notes
 * Content-Type: application/json
 * 
 * {
 *   "notes": "Updated notes about this candidate..."
 * }
 * 
 * // Success response (200)
 * {
 *   "message": "Notes updated successfully",
 *   "notes": "Updated notes about this candidate..."
 * }
 * 
 * // Not found response (404)
 * {
 *   "error": "Candidate not found"
 * }
 */
export const updateCandidateNotesController = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  
  try {
    const updatedRows = await candidatesModel.updateCandidateById(id, { notes });
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json({ 
      message: "Notes updated successfully",
      notes: notes || ""
    });
  } catch (error) {
    console.error("Error updating candidate notes:", error);
    return res.status(500).json({ error: "Error updating candidate notes" });
  }
};

