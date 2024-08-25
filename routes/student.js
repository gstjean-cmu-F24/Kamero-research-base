const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

/**
 * Route to view available research.
 * @name GET /student/research
 * @function
 * @memberof module:studentRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/research', studentController.viewAvailableResearch);

/**
 * Route to upload research.
 * @name POST /student/research
 * @function
 * @memberof module:studentRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/research', studentController.uploadResearch);

module.exports = router;
