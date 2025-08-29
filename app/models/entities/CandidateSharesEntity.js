import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';
import Candidate from './CandidateEntity.js';
import User from './UserEntity.js'
import Application from './ApplicationEntity.js';

/**
 * CandidateShares Entity - Sequelize model for managing candidate sharing between users
 * 
 * This model represents the sharing of candidate profiles between users in the application.
 * It tracks who shared a candidate, who received the share, and the status of that share.
 * 
 * @typedef {Object} CandidateShares
 * @property {number} share_id - Primary key, auto-incrementing unique identifier for the share
 * @property {number|null} candidate_id - Foreign key reference to the candidate being shared
 * @property {number|null} sender_id - Foreign key reference to the user who initiated the share
 * @property {number|null} receiver_id - Foreign key reference to the user who received the share
 * @property {number|null} application_id - Foreign key reference to the related job application
 * @property {('pending'|'accepted'|'rejected')} status - Current status of the share request, defaults to 'pending'
 * @property {Date} created_at - Timestamp when the share was created
 * @property {Date} updated_at - Timestamp when the share was last updated
 * 
 * @description
 * - All foreign key relationships use SET NULL on delete to maintain data integrity
 * - Unique composite index on candidate_id, sender_id, receiver_id, and application_id prevents duplicate shares
 * - Table name: 'candidate_shares'
 * - Includes automatic timestamp management
 */
const CandidateShares = sequelize.define('CandidateShare', {
    share_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    candidate_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Candidate,
            key: 'candidate_id',
        },
        onDelete: 'SET NULL',
    },
    sender_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'SET NULL',
    },
    receiver_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'SET NULL',
    },
    application_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Application,
            key: 'application_id'
        },
        onDelete: 'SET NULL',
    },
    status : {
        type : DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue : 'pending'
    },
}, {
    tableName: 'candidate_shares',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['candidate_id', 'sender_id', 'receiver_id', 'application_id']
        }
    ]
});

CandidateShares.belongsTo(Candidate, { foreignKey: 'candidate_id' });
CandidateShares.belongsTo(User, { foreignKey: 'sender_id' });
CandidateShares.belongsTo(User, { foreignKey: 'receiver_id' });
CandidateShares.belongsTo(Application, { foreignKey: 'application_id' });

Candidate.hasMany(CandidateShares, { foreignKey: 'candidate_id' });
User.hasMany(CandidateShares, { foreignKey: 'sender_id' });
User.hasMany(CandidateShares, { foreignKey: 'receiver_id' });
Application.hasMany(CandidateShares, { foreignKey: 'application_id' });

export default CandidateShares;
