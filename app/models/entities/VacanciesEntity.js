import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';


/**
 * Vacancy model representing job postings in the system
 * @typedef {Object} Vacancy
 * @property {number} vacancy_id - Primary key, auto-incrementing unique identifier for the vacancy
 * @property {string} title - Required title of the job vacancy
 * @property {string} description - Detailed description of the job vacancy
 * @property {number} salary - Salary offered for the position (decimal with 2 decimal places)
 * @property {('open'|'closed'|'paused')} status - Current status of the vacancy, defaults to 'closed'
 * @property {Date} creation_date - Date when the vacancy was created
 */
const Vacancy = sequelize.define('Vacancy', {
    vacancy_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    title : {
        type : DataTypes.STRING,
        allowNull :  false
    },
    description : {
        type : DataTypes.TEXT
    },
    salary : {
        type : DataTypes.DECIMAL(10,2)
    },
    status : {
        type : DataTypes.ENUM('open', 'closed', 'paused'),
        defaultValue : 'closed'
    },
    creation_date : {
        type : DataTypes.DATE
    }
}, {
    tableName: 'vacancies',
    timestamps: false
});

export default Vacancy;