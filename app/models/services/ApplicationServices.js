import Application from '../entities/ApplicationEntity.js';
import Candidate from '../entities/CandidateEntity.js';
import Vacancy from '../entities/VacanciesEntity.js';

/**
 * Creates a new application in the database.
 * 
 * @async
 * @function createApplication
 * @param {Object} applicationData - The application data object containing all application information
 * @param {number} [applicationData.candidate_id] - The ID of the candidate applying
 * @param {number} [applicationData.vacancy_id] - The ID of the vacancy being applied to
 * @param {string} [applicationData.status] - The status of the application (e.g., 'pending', 'approved', 'rejected')
 * @param {string} [applicationData.ai_reason] - AI-generated reason or evaluation for the application
 * @param {Date} [applicationData.created_at] - The creation timestamp
 * @param {Date} [applicationData.updated_at] - The last update timestamp
 * @returns {Promise<Object>} A promise that resolves to the newly created application object
 * @throws {Error} Throws an error if the database operation fails
 * 
 * @description This function creates a new application record in the database with the provided application data.
 * All fields are optional and will be handled according to the database schema defaults.
 * 
 * @example
 * // Create a new application
 * const applicationData = {
 *   candidate_id: 123,
 *   vacancy_id: 456,
 *   status: 'pending',
 *   ai_reason: 'Strong technical background matches requirements'
 * };
 * const newApplication = await createApplication(applicationData);
 * console.log(`Application created with ID: ${newApplication.application_id}`);
 */
export const createApplication = async (applicationData) => {
  try {
    const newApplication = await Application.create(applicationData);
    return newApplication;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

/**
 * Retrieves all applications with related candidate and vacancy information.
 * 
 * @async
 * @function getApplications
 * @returns {Promise<Array>} A promise that resolves to an array of application objects with included candidate and vacancy data
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function fetches all applications from the database and includes related data:
 * - Application: application_id, status, ai_reason
 * - Candidate: name
 * - Vacancy: title
 * 
 * The function uses Sequelize associations to join the tables and return comprehensive application data.
 * 
 * @example
 * // Get all applications with related data
 * const applications = await getApplications();
 * applications.forEach(app => {
 *   console.log(`Application ${app.application_id}: ${app.Candidate.name} applied for ${app.Vacancy.title}`);
 * });
 */
export const getApplications = async () => {
  try {
    const applications = await Application.findAll({
      attributes: ['application_id', 'status', 'ai_reason'], 
      include: [
        {
          model: Candidate,
          attributes: ['name'], 
        },
        {
          model: Vacancy,
          attributes: ['title'],
        },
      ],
    });
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
}

/**
 * Retrieves all applications with all columns from the Application table.
 * 
 * @async
 * @function getAllApplicationsColumn
 * @returns {Promise<Array>} A promise that resolves to an array of complete application objects with all database columns
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function fetches all applications from the database without any filters or joins,
 * returning all columns from the Application table. Unlike getApplications(), this function
 * does not include related candidate or vacancy information.
 * 
 * @example
 * // Get all applications with complete data
 * const allApplications = await getAllApplicationsColumn();
 * console.log(`Total applications: ${allApplications.length}`);
 * allApplications.forEach(app => {
 *   console.log(`Application ${app.application_id} - Status: ${app.status}`);
 * });
 */
export const getAllApplicationsColumn = async () => {
  try {
    const applications = await Application.findAll();
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
}

/**
 * Retrieves all applications for a specific vacancy with related candidate and vacancy information.
 * 
 * @async
 * @function getApplicationsForVacancyId
 * @param {number|string} reqVacancy_id - The vacancy ID to filter applications by
 * @returns {Promise<Array>} A promise that resolves to an array of application objects for the specified vacancy, or empty array if error occurs
 * @throws {Error} Logs error to console but returns empty array instead of throwing
 * 
 * @description This function fetches all applications for a specific vacancy and includes related data:
 * - Application: application_id, status, ai_reason
 * - Candidate: name
 * - Vacancy: vacancy_id, title (filtered by the provided vacancy_id)
 * 
 * The function uses Sequelize associations with a WHERE clause to filter by vacancy ID.
 * If an error occurs, it logs the error and returns an empty array instead of throwing.
 * 
 * @example
 * // Get all applications for vacancy ID 456
 * const vacancyApplications = await getApplicationsForVacancyId(456);
 * console.log(`Found ${vacancyApplications.length} applications for this vacancy`);
 * vacancyApplications.forEach(app => {
 *   console.log(`${app.Candidate.name} - Status: ${app.status}`);
 * });
 */
export const getApplicationsForVacancyId = async (reqVacancy_id) => {
  try {
    const applications = await Application.findAll({
      attributes: ['application_id', 'status', 'ai_reason'],
      include: [
        {
          model: Candidate,
          attributes: ['name'],
        },
        {
          model: Vacancy,
          attributes: ['vacancy_id', 'title'],
          where: { vacancy_id: reqVacancy_id },
        },
      ],
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

/**
 * Retrieves applications for a specific vacancy filtered by status with related candidate and vacancy information.
 * 
 * @async
 * @function getApplicationsForVacancyIdAndStatus
 * @param {number|string} reqVacancy_id - The vacancy ID to filter applications by
 * @param {string} status - The application status to filter by (e.g., 'pending', 'approved', 'rejected')
 * @returns {Promise<Array>} A promise that resolves to an array of application objects matching the vacancy ID and status, or empty array if error occurs
 * @throws {Error} Logs error to console but returns empty array instead of throwing
 * 
 * @description This function fetches applications for a specific vacancy with a specific status and includes related data:
 * - Application: application_id, status, ai_reason (filtered by status)
 * - Candidate: name
 * - Vacancy: vacancy_id, title (filtered by the provided vacancy_id)
 * 
 * The function uses Sequelize associations with WHERE clauses to filter by both vacancy ID and application status.
 * If an error occurs, it logs the error and returns an empty array instead of throwing.
 * 
 * @example
 * // Get all pending applications for vacancy ID 456
 * const pendingApplications = await getApplicationsForVacancyIdAndStatus(456, 'pending');
 * console.log(`Found ${pendingApplications.length} pending applications`);
 * 
 * @example
 * // Get all approved applications for a specific vacancy
 * const approvedApplications = await getApplicationsForVacancyIdAndStatus(789, 'approved');
 * approvedApplications.forEach(app => {
 *   console.log(`Approved: ${app.Candidate.name} for ${app.Vacancy.title}`);
 * });
 */
export const getApplicationsForVacancyIdAndStatus = async (reqVacancy_id, status) => {
  try {
    const applications = await Application.findAll({
      attributes: ['application_id', 'status', 'ai_reason'],
      where: { status },
      include: [
        {
          model: Candidate,
          attributes: ['name'],
        },
        {
          model: Vacancy,
          attributes: ['vacancy_id', 'title'],
          where: { vacancy_id: reqVacancy_id },
        },
      ],
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};


/**
 * Updates an existing application's information by application ID.
 * 
 * @async
 * @function updateApplication
 * @param {number|string} applicationId - The unique application ID to update
 * @param {Object} updates - An object containing the fields to update
 * @param {number} [updates.candidate_id] - Updated candidate ID
 * @param {number} [updates.vacancy_id] - Updated vacancy ID
 * @param {string} [updates.status] - Updated application status (e.g., 'pending', 'approved', 'rejected')
 * @param {string} [updates.ai_reason] - Updated AI-generated reason or evaluation
 * @param {Date} [updates.updated_at] - Updated timestamp
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful, false if no rows were affected
 * @throws {Error} Throws an error if the database update operation fails
 * 
 * @description This function updates an application's information based on the application_id.
 * Only the fields provided in the updates object will be modified.
 * Returns true if at least one row was updated, false if no application was found with the given ID.
 * 
 * @example
 * // Update application status and AI reason
 * const updateData = {
 *   status: 'approved',
 *   ai_reason: 'Candidate meets all technical requirements and has relevant experience'
 * };
 * const wasUpdated = await updateApplication(123, updateData);
 * if (wasUpdated) {
 *   console.log('Application updated successfully');
 * } else {
 *   console.log('Application not found or no changes made');
 * }
 * 
 * @example
 * // Update only the status
 * const success = await updateApplication(456, { status: 'rejected' });
 */
export const updateApplication = async (applicationId, updates) => {
  try {
    const [updatedRowsCount] = await Application.update(updates, {
      where: { application_id: applicationId },
    });

    return updatedRowsCount > 0;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};