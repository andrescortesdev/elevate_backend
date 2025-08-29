import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';

/**
 * Candidate Entity Model
 * 
 * Represents a job candidate in the system with their personal information,
 * professional background, and qualifications.
 * 
 * @class Candidate
 * @description Sequelize model for managing candidate data including personal details,
 * work experience, skills, education, and other relevant information for recruitment purposes.
 * 
 * @property {number} candidate_id - Primary key, auto-incrementing unique identifier
 * @property {string} name - Candidate's full name (max 150 characters)
 * @property {string} email - Candidate's email address (max 255 characters, unique)
 * @property {string} phone - Candidate's phone number (max 30 characters)
 * @property {Date} date_of_birth - Candidate's date of birth (date only, no time)
 * @property {string} occupation - Current or desired occupation (max 100 characters)
 * @property {string} summary - Professional summary or bio (text field)
 * @property {Object} experience - Work experience data stored as JSON
 * @property {Object} skills - Technical and soft skills stored as JSON
 * @property {Object} languages - Language proficiencies stored as JSON
 * @property {Object} education - Educational background stored as JSON
 * @property {string} notes - Additional notes or comments (text field)
 * 
 * @example
 * // Create a new candidate
 * const candidate = await Candidate.create({
 *   name: "John Doe",
 *   email: "john.doe@example.com",
 *   phone: "+1234567890",
 *   occupation: "Software Developer",
 *   skills: ["JavaScript", "React", "Node.js"]
 * });
 * 
 * @since 1.0.0
 */
const Candidate = sequelize.define('Candidate', {
    candidate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    occupation: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    experience: {
        type: DataTypes.JSON,
        allowNull: true
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: true
    },
    languages: {
        type: DataTypes.JSON,
        allowNull: true
    },
    education: {
        type: DataTypes.JSON,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'candidates',
    timestamps: false // Since the schema doesn't have created_at/updated_at
});

export default Candidate;
