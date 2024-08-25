const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploaded files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Only accept PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
}).single('researchFile');

exports.viewAvailableResearch = async (req, res) => {
    try {
        const research = await pool.query('SELECT * FROM research_materials');
        res.status(200).json(research.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadResearch = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { title, abstract, tags, institution_id, user_id } = req.body;
        const file_url = req.file.path;

        try {
            const newResearch = await pool.query(
                'INSERT INTO research_materials (title, abstract, file_url, tags, institution_id, user_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [title, abstract, file_url, tags, institution_id, user_id, 'pending']
            );
            res.status(201).json(newResearch.rows[0]);
        } catch (error) {
            // If there's an error, delete the uploaded file
            fs.unlinkSync(file_url);
            res.status(500).json({ message: error.message });
        }
    });
};