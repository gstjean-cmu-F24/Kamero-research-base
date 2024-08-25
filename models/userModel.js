const pool = require('../db');

/**
 * Creates a new user.
 *
 * @param {string} username - The username of the new user.
 * @param {string} password - The hashed password of the new user.
 * @param {string} role - The role of the new user.
 * @param {number} institutionId - The ID of the institution the user belongs to.
 * @returns {Promise<Object>} The newly created user.
 */
const createUser = async (username, password, role, institutionId) => {
    const result = await pool.query(
        'INSERT INTO users (username, password, role, institution_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, password, role, institutionId]
    );
    return result.rows[0];
};

/**
 * Retrieves a user by their ID.
 *
 * @param {number} id - The ID of the user.
 * @returns {Promise<Object>} The user with the given ID.
 */
const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

/**
 * Updates a user.
 *
 * @param {number} id - The ID of the user.
 * @param {string} username - The new username of the user.
 * @param {string} password - The new hashed password of the user.
 * @param {string} role - The new role of the user.
 * @param {number} institutionId - The new institution ID of the user.
 * @returns {Promise<Object>} The updated user.
 */
const updateUser = async (id, username, password, role, institutionId) => {
    const result = await pool.query(
        'UPDATE users SET username = $1, password = $2, role = $3, institution_id = $4 WHERE id = $5 RETURNING *',
        [username, password, role, institutionId, id]
    );
    return result.rows[0];
};

/**
 * Deletes a user.
 *
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<void>}
 */
const deleteUser = async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};
