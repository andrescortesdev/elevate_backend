import { where } from 'sequelize';
import Vacancy from '../entities/VacanciesEntity.js';
import Application from '../entities/ApplicationEntity.js';
import Candidate from '../entities/CandidateEntity.js';
import { Op } from 'sequelize';
import sequelize from '../../../config/db_conn.js';

/**
 * Retrieves all vacancies from the database ordered by most recent first.
 * 
 * @async
 * @function getAllVacancies
 * @returns {Promise<Array>} A promise that resolves to an array of all vacancy objects ordered by vacancy_id in descending order
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function fetches all vacancies from the database and orders them by vacancy_id in descending order,
 * showing the most recently created vacancies first.
 * 
 * @example
 * // Get all vacancies
 * const allVacancies = await getAllVacancies();
 * console.log(allVacancies); // Array of vacancy objects
 * allVacancies.forEach(vacancy => {
 *   console.log(`${vacancy.title} - ${vacancy.status}`);
 * });
 */
export const getAllVacancies = async () => {
    try {
        const vacancies = await Vacancy.findAll({
            order: [['vacancy_id', 'DESC']]
        });
        return vacancies;
    } catch (error) {
        console.error('Error fetching all vacancies:', error);
        throw error;
    };
};

/**
 * Searches for vacancies by title using case-insensitive partial matching.
 * 
 * @async
 * @function getVacanciesByName
 * @param {string} title - The title or partial title to search for
 * @returns {Promise<Array>} A promise that resolves to an array of vacancy objects matching the search criteria
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function performs a case-insensitive search for vacancies based on their title.
 * It uses the SQL LIKE operator with wildcards to find partial matches and converts both
 * the search term and database values to lowercase for comparison.
 * 
 * @example
 * // Search for vacancies with "engineer" in the title
 * const engineerJobs = await getVacanciesByName("engineer");
 * console.log(engineerJobs); // Returns vacancies with titles like "Software Engineer", "Senior Engineer", etc.
 * 
 * @example
 * // Search for vacancies with "developer" in the title
 * const devJobs = await getVacanciesByName("Developer");
 * console.log(devJobs); // Case-insensitive search
 */
export const getVacanciesByName = async (title) => {
    try {
        const vacancies = await Vacancy.findAll({
            where: sequelize.where(
                sequelize.fn('LOWER', sequelize.col('title')),
                { [Op.like]: `%${title.toLowerCase()}%`}
            )
        });
        return vacancies;
    } catch (error) {
        console.error('Error fetching vacancy:', error);
        throw error;
    };
};

/**
 * Creates a new vacancy or updates an existing one if vacancy_id already exists.
 * 
 * @async
 * @function upsertVacancy
 * @param {Object} vacancy - The vacancy object containing all vacancy information
 * @param {string} [vacancy.title] - The vacancy title/position name
 * @param {string} [vacancy.description] - Detailed description of the vacancy
 * @param {number|string} [vacancy.salary] - The salary or salary range for the position
 * @param {string} [vacancy.status] - The vacancy status (e.g., 'open', 'closed', 'draft')
 * @returns {Promise<Object>} A promise that resolves to an object containing the vacancy ID and creation status
 * @throws {Error} Throws an error if the database operation fails
 * 
 * @description This function uses Sequelize's upsert method to handle INSERT ... ON DUPLICATE KEY UPDATE.
 * If a vacancy with the same vacancy_id already exists, its information will be updated.
 * If the vacancy_id is unique or not provided, a new vacancy record will be created.
 * All fields are optional and will be set to null if not provided.
 * 
 * @example
 * // Create a new vacancy
 * const vacancyData = {
 *   title: 'Senior Software Engineer',
 *   description: 'Looking for an experienced software engineer...',
 *   salary: 80000,
 *   status: 'open'
 * };
 * const result = await upsertVacancy(vacancyData);
 * console.log(`Vacancy ${result.created ? 'created' : 'updated'} with ID: ${result.id}`);
 */
export const upsertVacancy = async (vacancy) => {
    const {
        title,
        description,
        salary,
        status
    } = vacancy;
    try {
        const [vacancyInstance, created] = await Vacancy.upsert({
            title: title || null,
            description: description || null,
            salary: salary || null,
            status: status || null
        }, {
            conflictFields: ['vacancy_id'],
            returning: true
        });

        return { id: vacancyInstance.vacancy_id, created }
    } catch (error) {
        console.error('Error inserting vacancy:', error);
        throw error;
    };
};

/**
 * Updates an existing vacancy's information by vacancy ID.
 * 
 * @async
 * @function updateVacancy
 * @param {Object} vacancy - The vacancy object containing the ID and fields to update
 * @param {number|string} vacancy.vacancy_id - The unique vacancy ID to update
 * @param {string} [vacancy.title] - Updated vacancy title
 * @param {string} [vacancy.description] - Updated vacancy description
 * @param {number|string} [vacancy.salary] - Updated salary information
 * @param {string} [vacancy.status] - Updated vacancy status
 * @returns {Promise<Object|null>} A promise that resolves to the updated vacancy object, or null if vacancy not found
 * @throws {Error} Throws an error if the database update operation fails
 * 
 * @description This function updates a vacancy's information based on the vacancy_id.
 * It first checks if the vacancy exists using findByPk, then updates only the provided fields.
 * The vacancy_id is extracted from the object and the remaining fields are used for the update.
 * Returns null if no vacancy is found with the given ID.
 * 
 * @example
 * // Update vacancy status and salary
 * const updateData = {
 *   vacancy_id: 123,
 *   status: 'closed',
 *   salary: 85000
 * };
 * const updatedVacancy = await updateVacancy(updateData);
 * if (updatedVacancy) {
 *   console.log('Vacancy updated successfully');
 * } else {
 *   console.log('Vacancy not found');
 * }
 */
export const updateVacancy = async (vacancy) => {
    const {vacancy_id, ...fieldsToUpdate} = vacancy;

    try {
        const originalVacancy = await Vacancy.findByPk(vacancy_id);

        if(!originalVacancy) {
            return null;
        }

        const updatedVacancy = await originalVacancy.update(fieldsToUpdate);
        
        return updatedVacancy;
    } catch (error) {
        console.error('Error updating vacancy:', error);
        throw error;
    }
};

/**
 * Deletes a vacancy from the database by vacancy ID.
 * 
 * @async
 * @function deleteVacancy
 * @param {Object} vacancy - The vacancy object containing the ID to delete
 * @param {number|string} vacancy.vacancy_id - The unique vacancy ID to delete
 * @returns {Promise<Object|null>} A promise that resolves to the deleted vacancy object, or null if vacancy not found
 * @throws {Error} Throws an error if the database delete operation fails
 * 
 * @description This function permanently removes a vacancy from the database based on the vacancy_id.
 * It first checks if the vacancy exists using findByPk, then deletes it using the destroy method.
 * Returns the deleted vacancy object if successful, or null if no vacancy was found with the given ID.
 * This operation is irreversible, so use with caution.
 * 
 * @example
 * // Delete vacancy with ID 123
 * const vacancyToDelete = { vacancy_id: 123 };
 * const deletedVacancy = await deleteVacancy(vacancyToDelete);
 * if (deletedVacancy) {
 *   console.log('Vacancy deleted successfully');
 * } else {
 *   console.log('Vacancy not found');
 * }
 */
export const deleteVacancy = async (vacancy) => {
    const { vacancy_id } = vacancy;
    
    try {
        const vacancyToDelete = await Vacancy.findByPk(vacancy_id);

        if(!vacancyToDelete) {
            return null;
        }

        const deletedVacancy = await vacancyToDelete.destroy();

        return deletedVacancy;
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        throw error;
    }
};

/**
 * Retrieves all vacancies with their application count.
 * 
 * @async
 * @function getAllVacanciesWithCount
 * @returns {Promise<Array>} A promise that resolves to an array of vacancy objects with application count
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function fetches all vacancies from the database and includes a count of applications
 * for each vacancy. It uses a LEFT JOIN with the Application table and groups by vacancy_id to
 * calculate the number of applications per vacancy. The results are ordered by vacancy_id in descending order.
 * Each vacancy object includes an 'applicationsCount' field with the total number of applications.
 * 
 * @example
 * // Get all vacancies with application counts
 * const vacanciesWithCounts = await getAllVacanciesWithCount();
 * vacanciesWithCounts.forEach(vacancy => {
 *   console.log(`${vacancy.title}: ${vacancy.dataValues.applicationsCount} applications`);
 * });
 * 
 * @example
 * // Find vacancies with no applications
 * const vacancies = await getAllVacanciesWithCount();
 * const emptyVacancies = vacancies.filter(v => v.dataValues.applicationsCount === '0');
 */
export const getAllVacanciesWithCount = async () => {
  try {
    const vacancies = await Vacancy.findAll({
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('Applications.application_id')),
            'applicationsCount'
          ]
        ]
      },
      include: [
        {
          model: Application,
          attributes: [] // no necesitamos traer todos los datos de la aplicación
        }
      ],
      group: ['Vacancy.vacancy_id'],
      order: [['vacancy_id', 'DESC']]
    });

    return vacancies;
  } catch (error) {
    console.error('Error fetching all vacancies with count:', error);
    throw error;
  }
};


/**
 * Retrieves all applications for a specific vacancy with related candidate and vacancy information.
 * 
 * @async
 * @function getApplicationsByVacancyId
 * @param {number|string} vacancyId - The vacancy ID to retrieve applications for
 * @returns {Promise<Array>} A promise that resolves to an array of application objects with included candidate and vacancy data
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function fetches all applications for a specific vacancy and includes related data from
 * the Candidate and Vacancy tables. It uses Sequelize associations to join the tables and return
 * comprehensive application data including:
 * - All Application fields
 * - Related Candidate information
 * - Related Vacancy information
 * 
 * @example
 * // Get all applications for vacancy ID 456
 * const applications = await getApplicationsByVacancyId(456);
 * applications.forEach(app => {
 *   console.log(`Application ${app.application_id}:`);
 *   console.log(`  Candidate: ${app.Candidate.name}`);
 *   console.log(`  Vacancy: ${app.Vacancy.title}`);
 *   console.log(`  Status: ${app.status}`);
 * });
 * 
 * @example
 * // Check if a vacancy has any applications
 * const applications = await getApplicationsByVacancyId(123);
 * if (applications.length === 0) {
 *   console.log('No applications found for this vacancy');
 * }
 */
export const getApplicationsByVacancyId = async (vacancyId) => {
  try {
    const applications = await Application.findAll({
      where: { vacancy_id: vacancyId },
      include: [
        { model: Candidate },
        { model: Vacancy }
      ]
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications by vacancy:', error);
    throw error;
  }
};





