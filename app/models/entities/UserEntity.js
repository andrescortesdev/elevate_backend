import { DataTypes } from "sequelize";
import sequelize from "../../../config/db_conn.js";
import argon2 from "argon2";

/**
 * User entity model representing a user in the system.
 * 
 * @typedef {Object} User
 * @property {number} user_id - Auto-incrementing primary key for the user
 * @property {string} name - User's full name (max 150 characters)
 * @property {string} email - User's unique email address (max 255 characters)
 * @property {string} password - User's encrypted password (max 255 characters)
 * @property {number} role_id - Foreign key reference to the user's role
 * 
 * @description Sequelize model for the 'users' table with timestamps disabled.
 * The email field has a unique constraint to prevent duplicate registrations.
 */
const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "users",
    timestamps: false
});

/**
 * Static method to hash a password using Argon2id
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
User.hashPassword = async function(password) {
    try {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, // 64 MB
            timeCost: 3,
            parallelism: 1,
        });
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
};

/**
 * Static method to verify a password against a hash
 * @param {string} hashedPassword - The stored hashed password
 * @param {string} plainPassword - The plain text password to verify
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
User.verifyPassword = async function(hashedPassword, plainPassword) {
    try {
        return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
        throw new Error('Error verifying password: ' + error.message);
    }
};

export default User;
