import User from '../entities/UserEntity.js';

// GET methods
/**
 * Retrieves all users from the database
 * @async
 * @function getAllUsers
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects ordered by user_id in descending order (most recent first)
 * @throws {Error} Throws an error if the database operation fails
 * @example
 * // Get all users
 * try {
 *   const users = await getAllUsers();
 *   console.log(`Found ${users.length} users`);
 *   users.forEach(user => {
 *     console.log(`User: ${user.name} (${user.email})`);
 *   });
 * } catch (error) {
 *   console.error('Failed to fetch users:', error);
 * }
 */
export const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            order: [['user_id', 'DESC']] // Order by most recent first
        });
        return users;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};

/**
 * Retrieves a user by their email address
 * @async
 * @function getUserByEmail
 * @param {string} email - The email address to search for
 * @returns {Promise<Object|null>} A promise that resolves to the user object or null if not found
 * @throws {Error} Throws an error if the database operation fails
 */
export const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: { email }
        });
        return user;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

/**
 * Retrieves a user by their ID
 * @async
 * @function getUserById
 * @param {number} userId - The user ID to search for
 * @returns {Promise<Object|null>} A promise that resolves to the user object or null if not found
 * @throws {Error} Throws an error if the database operation fails
 */
export const getUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

// CREATE methods
/**
 * Creates a new user or updates an existing user based on unique constraints
 * @async
 * @function createUserUpsert
 * @param {Object} userData - The user data object
 * @param {string|null} userData.name - The user's name
 * @param {string|null} userData.email - The user's email address
 * @param {string|null} userData.password - The user's password
 * @param {number|null} userData.role_id - The user's role identifier
 * @returns {Promise<Object>} A promise that resolves to an object containing the user instance and creation status
 * @returns {Object} returns.user - The user instance (created or updated)
 * @returns {boolean} returns.created - True if a new user was created, false if an existing user was updated
 * @throws {Error} Throws an error if the database operation fails
 * @example
 * // Create or update a user
 * const userData = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'hashedPassword123',
 *   role_id: 1
 * };
 * const { user, created } = await createUserUpsert(userData);
 * if (created) {
 *   console.log('New user created:', user.name);
 * } else {
 *   console.log('Existing user updated:', user.name);
 * }
 */
export const createUserUpsert = async (userData) => {
    const {
        name,
        email,
        password,
        role_id
    } = userData;
    try {
        const [userInstance, created] = await User.upsert({
            name: name || null,
            email: email || null,
            password: password || null,
            role_id: role_id || null
        }, { returning: true });

        return { user: userInstance, created };
    } catch (error) {
        console.error('Error creating or updating user:', error);
        throw error;
    }
};

// DELETE method
/**
 * Deletes a user from the database by their user ID
 * @async
 * @function deleteUser
 * @param {number|string} userId - The unique identifier of the user to delete
 * @returns {Promise<number>} A promise that resolves to the number of deleted records (0 or 1)
 * @throws {Error} Throws an error if the database operation fails
 * @example
 * // Delete a user with ID 123
 * const deletedCount = await deleteUser(123);
 * if (deletedCount > 0) {
 *   console.log('User deleted successfully');
 * }
 */
export const deleteUser = async (userId) => {
    try {
        const result = await User.destroy({
            where: {
                user_id: userId
            }
        });
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};