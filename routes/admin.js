const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

/**
 * Route to manage users.
 * @name GET /admin/users
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/users', adminController.manageUsers);

/**
 * Route to manage institutions.
 * @name GET /admin/institutions
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/institutions', adminController.manageInstitutions);

/**
 * Route to manage users (create, update, delete).
 * @name POST /admin/users
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/users', adminController.manageUsers);

/**
 * Route to manage research topics.
 * @name GET /admin/research-topics
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/research-topics', adminController.manageResearchTopics);

/**
 * Route to view system analytics.
 * @name GET /admin/analytics
 * @function
 * @memberof module:adminRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/analytics', adminController.viewSystemAnalytics);

module.exports = router;
