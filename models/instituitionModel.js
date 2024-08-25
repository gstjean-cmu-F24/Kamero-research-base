const pool = require('../db');

/**
 * Creates a new institution.
 *
 * @param {string} name - The name of the institution.
 * @param {string} address - The address of the institution.
 * @returns {Promise<Object>} The newly created institution.
 */
const createInstitution = async (name, address) => {
    const result = await pool.query(
        'INSERT INTO institutions (name, address) VALUES ($1, $2) RETURNING *',
        [name, address]
    );
    return result.rows[0];
};

/**
 * Retrieves an institution by its ID.
 *
 * @param {number} id - The ID of the institution.
 * @returns {Promise<Object>} The institution with the given ID.
 */
const getInstitutionById = async (id) => {
    const result = await pool.query('SELECT * FROM institutions WHERE id = $1', [id]);
    return result.rows[0];
};

/**
 * Updates an institution.
 *
 * @param {number} id - The ID of the institution.
 * @param {string} name - The new name of the institution.
 * @param {string} address - The new address of the institution.
 * @returns {Promise<Object>} The updated institution.
 */
const updateInstitution = async (id, name, address) => {
    const result = await pool.query(
        'UPDATE institutions SET name = $1, address = $2 WHERE id = $3 RETURNING *',
        [name, address, id]
    );
    return result.rows[0];
};

/**
 * Deletes an institution.
 *
 * @param {number} id - The ID of the institution to delete.
 * @returns {Promise<void>}
 */
const deleteInstitution = async (id) => {
    await pool.query('DELETE FROM institutions WHERE id = $1', [id]);
};

module.exports = {
    createInstitution,
    getInstitutionById,
    updateInstitution,
    deleteInstitution,
};
