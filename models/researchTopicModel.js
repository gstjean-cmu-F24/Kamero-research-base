const pool = require('../db');

/**
 * Creates a new research topic.
 *
 * @param {string} title - The title of the research topic.
 * @param {string} description - The description of the research topic.
 * @param {string[]} tags - The tags associated with the research topic.
 * @returns {Promise<Object>} The newly created research topic.
 */
const createResearchTopic = async (title, description, tags) => {
    const result = await pool.query(
        'INSERT INTO research_topics (title, description, tags) VALUES ($1, $2, $3) RETURNING *',
        [title, description, tags]
    );
    return result.rows[0];
};

/**
 * Retrieves a research topic by its ID.
 *
 * @param {number} id - The ID of the research topic.
 * @returns {Promise<Object>} The research topic with the given ID.
 */
const getResearchTopicById = async (id) => {
    const result = await pool.query('SELECT * FROM research_topics WHERE id = $1', [id]);
    return result.rows[0];
};

/**
 * Updates a research topic.
 *
 * @param {number} id - The ID of the research topic.
 * @param {string} title - The new title of the research topic.
 * @param {string} description - The new description of the research topic.
 * @param {string[]} tags - The new tags associated with the research topic.
 * @returns {Promise<Object>} The updated research topic.
 */
const updateResearchTopic = async (id, title, description, tags) => {
    const result = await pool.query(
        'UPDATE research_topics SET title = $1, description = $2, tags = $3 WHERE id = $4 RETURNING *',
        [title, description, tags, id]
    );
    return result.rows[0];
};

/**
 * Deletes a research topic.
 *
 * @param {number} id - The ID of the research topic to delete.
 * @returns {Promise<void>}
 */
const deleteResearchTopic = async (id) => {
    await pool.query('DELETE FROM research_topics WHERE id = $1', [id]);
};

module.exports = {
    createResearchTopic,
    getResearchTopicById,
    updateResearchTopic,
    deleteResearchTopic,
};
