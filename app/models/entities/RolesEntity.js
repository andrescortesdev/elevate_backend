import { DataTypes } from "sequelize";
import sequelize from "../../../config/db_conn.js";

/**
 * Role entity model representing the roles table in the database.
 * Defines user roles within the system for access control and permissions.
 * 
 * @typedef {Object} Role
 * @property {number} role_id - Primary key, auto-incrementing unique identifier for the role
 * @property {string} name - Unique role name, maximum 60 characters, cannot be null
 * 
 * @example
 * // Create a new role
 * const adminRole = await Role.create({
 *   name: 'admin'
 * });
 * 
 * @example
 * // Find a role by name
 * const userRole = await Role.findOne({
 *   where: { name: 'user' }
 * });
 */
const Role = sequelize.define("Role", {
    role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    }
}, {
    tableName: "roles",
    timestamps: false
});

export default Role;