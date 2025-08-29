import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';
import Candidate from './CandidateEntity.js';
import Vacancy from './VacanciesEntity.js';

/**
 * Application entity model representing job applications in the system.
 * Defines the relationship between candidates and job vacancies with application tracking.
 * 
 * @typedef {Object} Application
 * @property {number} application_id - Primary key, auto-incrementing unique identifier for the application
 * @property {Date} application_date - Date when the application was submitted, defaults to current timestamp
 * @property {('pending'|'interview'|'offered'|'accepted'|'rejected')} status - Current status of the application, defaults to 'rejected'
 * @property {string|null} ai_reason - AI-generated reason or feedback for the application status (optional)
 * @property {number|null} candidate_id - Foreign key reference to the candidate who submitted the application
 * @property {number|null} vacancy_id - Foreign key reference to the job vacancy being applied for
 * 
 * @description
 * - Table name: 'applications'
 * - Timestamps: disabled
 * - Unique constraint: combination of candidate_id and vacancy_id (prevents duplicate applications)
 * - Foreign key constraints: SET NULL on delete for both candidate and vacancy references
 * 
 * @example
 * // Creating a new application
 * const application = await Application.create({
 *   candidate_id: 123,
 *   vacancy_id: 456,
 *   status: 'pending'
 * });
 */
const Application = sequelize.define('Application', {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  application_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('pending', 'interview', 'offered', 'accepted', 'rejected'),
    defaultValue: 'rejected',
  },
  ai_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Candidate,
      key: 'candidate_id',
    },
    onDelete: 'SET NULL',
  },
  vacancy_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Vacancy,
      key: 'vacancy_id',
    },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'applications',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['candidate_id', 'vacancy_id'],
    },
  ],
});

Application.belongsTo(Candidate, { foreignKey: 'candidate_id' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancy_id' });

Candidate.hasMany(Application, { foreignKey: 'candidate_id' });
Vacancy.hasMany(Application, { foreignKey: 'vacancy_id' });

export default Application;
