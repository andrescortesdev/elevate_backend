import * as applicationsModel from "../models/services/ApplicationServices.js";

/**
 * Controller function to retrieve all applications with related candidate and vacancy information.
 * 
 * @async
 * @function getAllApplications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with applications array including candidate and vacancy data, or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve all applications from the database.
 * It calls the applicationsModel.getApplications() service which returns applications with joined data:
 * - Application: application_id, status, ai_reason
 * - Candidate: name
 * - Vacancy: title
 * 
 * @example
 * // Example request
 * GET /api/applications
 * 
 * // Success response (200)
 * [
 *   {
 *     "application_id": 1,
 *     "status": "pending",
 *     "ai_reason": "Strong technical background matches requirements",
 *     "Candidate": {
 *       "name": "John Doe"
 *     },
 *     "Vacancy": {
 *       "title": "Software Engineer"
 *     }
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching applications"
 * }
 */
export const getAllApplications = async (req, res) => {
    try {
        const applications = await applicationsModel.getApplications();
        return res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ error: "Error fetching applications" });
    }
};

/**
 * Controller function to retrieve all applications with complete data from all columns.
 * 
 * @async
 * @function getAllApplicationsColumn
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with complete applications array or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve all applications with all database columns.
 * It calls the applicationsModel.getAllApplicationsColumn() service which returns raw application data
 * without any joins or related data. This is useful for getting complete application records
 * when you need all fields from the Application table.
 * 
 * @example
 * // Example request
 * GET /api/applications/columns
 * 
 * // Success response (200)
 * [
 *   {
 *     "application_id": 1,
 *     "candidate_id": 123,
 *     "vacancy_id": 456,
 *     "status": "pending",
 *     "ai_reason": "Strong technical background matches requirements",
 *     "created_at": "2024-01-15T10:30:00.000Z",
 *     "updated_at": "2024-01-15T10:30:00.000Z"
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching applications"
 * }
 */
export const getAllApplicationsColumn = async (req, res) => {
    try {
        const applications = await applicationsModel.getAllApplicationsColumn();
        return res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ error: "Error fetching applications" });
    }
};

/**
 * Controller function to retrieve all applications for a specific vacancy.
 * 
 * @async
 * @function getApplicationsForVacancyId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The vacancy ID to filter applications by
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with applications array for the specified vacancy or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve applications for a specific vacancy.
 * It extracts the vacancy ID from route parameters and calls the applicationsModel.getApplicationsForVacancyId() service.
 * Returns applications with joined data:
 * - Application: application_id, status, ai_reason
 * - Candidate: name
 * - Vacancy: vacancy_id, title (filtered by the provided vacancy_id)
 * 
 * @example
 * // Example request
 * GET /api/applications/vacancy/456
 * 
 * // Success response (200)
 * [
 *   {
 *     "application_id": 1,
 *     "status": "pending",
 *     "ai_reason": "Strong technical background matches requirements",
 *     "Candidate": {
 *       "name": "John Doe"
 *     },
 *     "Vacancy": {
 *       "vacancy_id": 456,
 *       "title": "Software Engineer"
 *     }
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching applications"
 * }
 */
export const getApplicationsForVacancyId = async (req, res) => {
    try {
        const id = req.params.id;
        const applicationsForVacancy = await applicationsModel.getApplicationsForVacancyId(id);
        
        return res.status(200).json(applicationsForVacancy);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ error: "Error fetching applications" });
    }
};


/**
 * Controller function to retrieve applications for a specific vacancy filtered by status.
 * 
 * @async
 * @function getApplicationsForVacancyIdAndStatus
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The vacancy ID to filter applications by
 * @param {string} req.params.status - The application status to filter by (e.g., 'pending', 'approved', 'rejected', 'interview')
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with filtered applications array or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve applications for a specific vacancy with a specific status.
 * It extracts both the vacancy ID and status from route parameters and calls the 
 * applicationsModel.getApplicationsForVacancyIdAndStatus() service.
 * Returns applications with joined data filtered by both vacancy ID and status:
 * - Application: application_id, status, ai_reason (filtered by status)
 * - Candidate: name
 * - Vacancy: vacancy_id, title (filtered by the provided vacancy_id)
 * 
 * @example
 * // Example request
 * GET /api/applications/vacancy/456/status/pending
 * 
 * // Success response (200)
 * [
 *   {
 *     "application_id": 1,
 *     "status": "pending",
 *     "ai_reason": "Strong technical background matches requirements",
 *     "Candidate": {
 *       "name": "John Doe"
 *     },
 *     "Vacancy": {
 *       "vacancy_id": 456,
 *       "title": "Software Engineer"
 *     }
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching applications"
 * }
 */
export const getApplicationsForVacancyIdAndStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        const applicationsForVacancy = await applicationsModel.getApplicationsForVacancyIdAndStatus(id, status);
        
        return res.status(200).json(applicationsForVacancy);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ error: "Error fetching applications" });
    }
};

/**
 * Controller function to update an existing application's information by application ID.
 * 
 * @async
 * @function updateApplicationController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The unique application ID to update
 * @param {Object} req.body - Request body containing updated application data
 * @param {number} [req.body.candidate_id] - Updated candidate ID
 * @param {number} [req.body.vacancy_id] - Updated vacancy ID
 * @param {string} [req.body.status] - Updated application status (e.g., 'pending', 'approved', 'rejected', 'interview')
 * @param {string} [req.body.ai_reason] - Updated AI-generated reason or evaluation
 * @param {Date} [req.body.updated_at] - Updated timestamp
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with success/failure message and status
 * @throws {Error} Returns 500 status with error message if database update operation fails
 * 
 * @description This controller handles PUT/PATCH requests to update an application's information.
 * It extracts the application ID from route parameters and updated data from the request body,
 * calls the applicationsModel.updateApplication() service, and returns a structured response.
 * Only the fields provided in the request body will be modified.
 * Returns 404 if no application is found with the given ID or no changes were applied.
 * 
 * @example
 * // Example request
 * PUT /api/applications/123
 * Content-Type: application/json
 * 
 * {
 *   "status": "interview",
 *   "ai_reason": "Candidate has excellent qualifications and relevant experience"
 * }
 * 
 * // Success response (200)
 * {
 *   "success": true,
 *   "message": "Application updated successfully"
 * }
 * 
 * // Not found response (404)
 * {
 *   "success": false,
 *   "message": "Application not found or no changes applied"
 * }
 * 
 * // Error response (500)
 * {
 *   "success": false,
 *   "message": "Error updating application",
 *   "error": "Detailed error message"
 * }
 */
export const updateApplicationController = async (req, res) => {
  try {
    const applicationId = req.params.id; // /applications/:id
    const updates = req.body; // { status: 'interview', ai_reason: '...' }

    const updated = await applicationsModel.updateApplication(applicationId, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Application not found or no changes applied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating application",
      error: error.message,
    });
  }
};