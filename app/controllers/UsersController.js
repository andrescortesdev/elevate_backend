import * as usersModel from "../models/services/UserServices.js";

/**
 * Controller function to retrieve all users from the database
 * @async
 * @function getAllUsersController
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns a JSON response with all users or an error message
 * @throws {Error} Returns 500 status code with error message if database operation fails
 */
export const getAllUsersController = async (req, res) => {
    try {
        const allUsers = await usersModel.getAllUsers();
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Error fetching users" });
    }
};

/**
 * Creates or updates a user in the database
 * @async
 * @function createUserController
 * @param {Object} req - Express request object
 * @param {Object} req.body - User data to create or update
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with user_id and appropriate HTTP status
 * @description
 * - Returns 201 status if user is newly created
 * - Returns 200 status if user already exists and is updated
 * - Returns 500 status if an error occurs during the operation
 */
export const createUserController = async (req, res) => {
    const userData = req.body;
    try {
        const { user, created } = await usersModel.createUserUpsert(userData);
        if (created) {
            return res.status(201).json({ user_id: user.user_id });
        } else {
            return res.status(200).json({ user_id: user.user_id });
        }
    } catch (error) {
        console.error("Error creating or updating user:", error);
        return res.status(500).json({ error: "Error creating or updating user" });
    }
};

/**
 * Deletes a user by ID
 * @async
 * @function deleteUserController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - User ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns 204 status on success or 500 status with error message on failure
 * @throws {Error} Throws error if user deletion fails
 */
export const deleteUserController = async (req, res) => {
    const { id } = req.params;
    try {
        await usersModel.deleteUser(id);
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Error deleting user" });
    }
};
