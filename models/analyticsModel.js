const pool = require('../db');

/**
 * Retrieves user activity statistics.
 *
 * @returns {Promise<Object>} The user activity statistics.
 */
const getUserActivityStats = async () => {
    const result = await pool.query('SELECT COUNT(*) AS user_count FROM users');
    return result.rows[0];
};

/**
 * Retrieves research access statistics.
 *
 * @returns {Promise<Object>} The research access statistics.
 */
const getResearchAccessStats = async () => {
    const result = await pool.query('SELECT COUNT(*) AS access_count FROM research_access_logs');
    return result.rows[0];
};

module.exports = {
    getUserActivityStats,
    getResearchAccessStats,
};
