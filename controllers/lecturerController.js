// lecturerController.js
const pool = require('../db');

// For viewing the institutions assigned to the lecturer
exports.viewAssignedInstitutions = async (req, res) => {
    try {
        const lecturerId = req.user.id; // Assuming the lecturer's ID is stored in req.user
        const query = `
            SELECT i.id, i.name, i.permissions
            FROM institutions i
            JOIN users u ON i.id = u.institution_id
            WHERE u.id = $1;
        `;
        const result = await pool.query(query, [lecturerId]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// For uploading research by the lecturer
exports.uploadResearch = async (req, res) => {
    try {
        const { title, abstract, file_url, tags } = req.body;
        const institutionId = req.user.institution_id;
        const userId = req.user.id;

        const query = `
            INSERT INTO research_materials (title, abstract, file_url, tags, institution_id, user_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING *;
        `;
        const result = await pool.query(query, [title, abstract, file_url, tags, institutionId, userId]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// For reviewing student uploads
exports.reviewStudentUploads = async (req, res) => {
    try {
        const institutionId = req.user.institution_id;

        const query = `
            SELECT rm.id, rm.title, rm.abstract, rm.file_url, rm.tags, rm.status, u.username as submitted_by
            FROM research_materials rm
            JOIN users u ON rm.user_id = u.id
            WHERE rm.institution_id = $1 AND u.role = 'student';
        `;
        const result = await pool.query(query, [institutionId]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// For viewing all research related to the lecturer's institution
exports.viewInstitutionResearch = async (req, res) => {
    try {
        const institutionId = req.user.institution_id;

        const query = `
            SELECT rm.id, rm.title, rm.abstract, rm.file_url, rm.tags, rm.status
            FROM research_materials rm
            WHERE rm.institution_id = $1;
        `;
        const result = await pool.query(query, [institutionId]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
