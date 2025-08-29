import * as vacanciesModel from '../models/services/VacanciesServices.js';

/**
 * Controller function to retrieve all vacancies from the database.
 * 
 * @async
 * @function getAllVacanciesController
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with all vacancies array or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve all vacancies.
 * It calls the vacanciesModel.getAllVacancies() service function and returns
 * the results ordered by most recent first (vacancy_id DESC).
 * 
 * @example
 * // Example request
 * GET /api/vacancies
 * 
 * // Success response (200)
 * [
 *   {
 *     "vacancy_id": 123,
 *     "title": "Senior Software Engineer",
 *     "description": "Looking for an experienced software engineer...",
 *     "salary": 80000,
 *     "status": "open"
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "error": "Error fetching vacancies:"
 * }
 */
export const getAllVacanciesController = async (req, res) => {
    try {
        const allVacancies = await vacanciesModel.getAllVacancies();
        return res.status(200).json(allVacancies);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        return res.status(500).json({ error: 'Error fetching vacancies:', error });
    }
}

/**
 * Controller function to search for vacancies by title using case-insensitive partial matching.
 * 
 * @async
 * @function getAllVacanciesByNameController
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.title - The title or partial title to search for (required)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with matching vacancies array or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to search for vacancies by title.
 * It validates that the 'title' query parameter is provided, then calls the
 * vacanciesModel.getVacanciesByName() service which performs a case-insensitive search.
 * Returns 400 if title parameter is missing, 404 if no vacancies found, or 200 with results.
 * 
 * @example
 * // Example request
 * GET /api/vacancies/search?title=engineer
 * 
 * // Success response (200)
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "vacancy_id": 123,
 *       "title": "Senior Software Engineer",
 *       "description": "Looking for an experienced software engineer...",
 *       "salary": 80000,
 *       "status": "open"
 *     }
 *   ]
 * }
 * 
 * // Missing parameter response (400)
 * {
 *   "success": false,
 *   "message": "You must provide a name query parameter"
 * }
 * 
 * // Not found response (404)
 * {
 *   "success": false,
 *   "message": "There is no vacancy with that name"
 * }
 * 
 * // Error response (500)
 * {
 *   "success": false,
 *   "message": "Internal server error",
 *   "error": "Detailed error message"
 * }
 */
export const getAllVacanciesByNameController = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "You must provide a name query parameter"
            });
        }

        const vacancies = await vacanciesModel.getVacanciesByName(title);

        if (!vacancies || vacancies.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'There is no vacancy with that name',
            });
        };

        return res.status(200).json({
            success: true,
            data: vacancies
        });
    } catch (error) {
        console.error('Error fetching vacancy:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Controller function to create a new vacancy or update an existing one.
 * 
 * @async
 * @function upsertVacancyController
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing vacancy data
 * @param {string} [req.body.title] - The vacancy title/position name
 * @param {string} [req.body.description] - Detailed description of the vacancy
 * @param {number|string} [req.body.salary] - The salary or salary range for the position
 * @param {string} [req.body.status] - The vacancy status (e.g., 'open', 'closed', 'draft')
 * @param {number} [req.body.vacancy_id] - The vacancy ID (for updates)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with operation result and vacancy ID
 * @throws {Error} Returns 500 status with error message if database operation fails
 * 
 * @description This controller handles POST/PUT requests to create or update vacancies.
 * It uses the vacanciesModel.upsertVacancy() service which implements upsert functionality:
 * - If vacancy_id is provided and exists, the vacancy will be updated
 * - If vacancy_id is not provided or doesn't exist, a new vacancy will be created
 * The response indicates whether the operation was a creation or update.
 * 
 * @example
 * // Example request (create new vacancy)
 * POST /api/vacancies
 * Content-Type: application/json
 * 
 * {
 *   "title": "Senior Software Engineer",
 *   "description": "Looking for an experienced software engineer...",
 *   "salary": 80000,
 *   "status": "open"
 * }
 * 
 * // Success response (200) - Creation
 * {
 *   "success": true,
 *   "message": "vacancy successfully created",
 *   "vacancyId": 124,
 *   "action": "created"
 * }
 * 
 * // Success response (200) - Update
 * {
 *   "success": true,
 *   "message": "vacancy successfully updated",
 *   "vacancyId": 123,
 *   "action": "updated"
 * }
 * 
 * // Error response (500)
 * {
 *   "success": false,
 *   "message": "Something went wrong while creating/updating vacancy",
 *   "error": "Detailed error message"
 * }
 */
export const upsertVacancyController = async (req, res) => {
    try {
        const vacancy = req.body;
        const { id, created } = await vacanciesModel.upsertVacancy(vacancy);

        //response depending on creation or updating
        const message = created ? 'vacancy successfully created' : 'vacancy successfully updated';

        return res.status(200).json({
            success: true,
            message,
            vacancyId: id,
            action: created ? 'created' : 'updated'
        });
    } catch (error) {
        console.error('Error creating/updating vacancy', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating/updating vacancy',
            error: error.message
        });
    }
}

/**
 * Controller function to retrieve all vacancies with their application count.
 * 
 * @async
 * @function getAllVacanciesWithCount
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with vacancies array including application counts or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve all vacancies with application statistics.
 * It calls the vacanciesModel.getAllVacanciesWithCount() service which performs a JOIN query
 * with the Application table to count applications per vacancy. Each vacancy object includes
 * an 'applicationsCount' field with the total number of applications received.
 * The results are ordered by vacancy_id in descending order.
 * 
 * @example
 * // Example request
 * GET /api/vacancies/with-count
 * 
 * // Success response (200)
 * [
 *   {
 *     "vacancy_id": 123,
 *     "title": "Senior Software Engineer",
 *     "description": "Looking for an experienced software engineer...",
 *     "salary": 80000,
 *     "status": "open",
 *     "applicationsCount": "5"
 *   },
 *   {
 *     "vacancy_id": 122,
 *     "title": "Junior Developer",
 *     "description": "Entry level position...",
 *     "salary": 50000,
 *     "status": "open",
 *     "applicationsCount": "12"
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "success": false,
 *   "message": "Error fetching vacancies",
 *   "error": "Detailed error message"
 * }
 */
export const getAllVacanciesWithCount = async (req, res) => {
    try {
        const allVacancies = await vacanciesModel.getAllVacanciesWithCount();
        return res.status(200).json(allVacancies);
    } catch (error) {
        console.error("Error fetching vacancies with count:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching vacancies",
            error: error.message
        });
    }
};

/**
 * Controller function to retrieve all applications for a specific vacancy with related data.
 * 
 * @async
 * @function getApplicationsByVacancyIdController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string|number} req.params.id - The vacancy ID to retrieve applications for
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns HTTP response with applications array including candidate and vacancy data or error message
 * @throws {Error} Returns 500 status with error message if database query fails
 * 
 * @description This controller handles GET requests to retrieve all applications for a specific vacancy.
 * It extracts the vacancy ID from route parameters and calls the vacanciesModel.getApplicationsByVacancyId() service.
 * The response includes complete application data with related candidate and vacancy information
 * through Sequelize associations.
 * 
 * @example
 * // Example request
 * GET /api/vacancies/123/applications
 * 
 * // Success response (200)
 * [
 *   {
 *     "application_id": 1,
 *     "candidate_id": 456,
 *     "vacancy_id": 123,
 *     "status": "pending",
 *     "ai_reason": "Strong technical background matches requirements",
 *     "created_at": "2024-01-15T10:30:00.000Z",
 *     "updated_at": "2024-01-15T10:30:00.000Z",
 *     "Candidate": {
 *       "candidate_id": 456,
 *       "name": "John Doe",
 *       "email": "john.doe@example.com",
 *       "occupation": "Software Engineer"
 *     },
 *     "Vacancy": {
 *       "vacancy_id": 123,
 *       "title": "Senior Software Engineer",
 *       "description": "Looking for an experienced software engineer...",
 *       "salary": 80000,
 *       "status": "open"
 *     }
 *   }
 * ]
 * 
 * // Error response (500)
 * {
 *   "success": false,
 *   "message": "Error fetching applications by vacancy",
 *   "error": "Detailed error message"
 * }
 */
export const getApplicationsByVacancyIdController = async (req, res) => {
    try {
        const vacancyId = req.params.id;
        const applications = await vacanciesModel.getApplicationsByVacancyId(vacancyId);
        return res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications by vacancy:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching applications by vacancy",
            error: error.message
        });
    }
};

export const deleteVacancyController = async (req, res) => {
    try {
        const vacancyId = req.params.id;
        const deletedVacancy = await vacanciesModel.deleteVacancy({ vacancy_id: vacancyId });

        if (!deletedVacancy) {
            return res.status(404).json({
                success: false,
                message: 'Vacancy not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Vacancy deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting vacancy',
            error: error.message
        });
    }
};

export const updateVacancyController = async (req, res) => {
    const vacancy = req.body;

    if (!vacancy?.vacancy_id) {
        return res.status(400).json({ message: 'vacancy_id is required' });
    }

    try {
        const updatedVacancy = await vacanciesModel.updateVacancy(vacancy);

        if (!updatedVacancy) {
            return res.status(404).json({ message: 'Vacancy not found' });
        }

        return res.status(200).json({
            message: 'Vacancy updated successfully',
            data: updatedVacancy
        });
    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};