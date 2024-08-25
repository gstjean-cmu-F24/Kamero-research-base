const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

/**
 * Route to view assigned institutions.
 * @name GET /lecturer/institutions
 * @function
 * @memberof module:lecturerRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/institutions', lecturerController.viewAssignedInstitutions);

/**
 * Route to upload research.
 * @name POST /lecturer/research
 * @function
 * @memberof module:lecturerRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/research', lecturerController.uploadResearch);

/**
 * Route to review student uploads.
 * @name GET /lecturer/student-uploads
 * @function
 * @memberof module:lecturerRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/student-uploads', lecturerController.reviewStudentUploads);

module.exports = router;
