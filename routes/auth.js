const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Route to login.
 * @name POST /auth/login
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/login', authController.login);

/**
 * Route to register.
 * @name POST /auth/register
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/register', authController.register);

/**
 * Route to request password reset.
 * @name POST /auth/forgot-password
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * Route to reset password.
 * @name POST /auth/reset-password
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/reset-password', authController.resetPassword);

module.exports = router;
