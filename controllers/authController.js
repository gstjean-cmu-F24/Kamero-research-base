const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const crypto = require('crypto');


/**
 * Handles the forgot password functionality.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.email - The email of the user who forgot their password.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = await bcrypt.hash(resetToken, 10);
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
            [resetTokenHash, resetTokenExpiry, user.rows[0].id]
        );

        // send email to the user
        res.status(200).json({ message: 'Password reset token generated', resetToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Handles the reset password functionality.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.resetToken - The password reset token.
 * @param {string} req.body.newPassword - The new password for the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE reset_password_token IS NOT NULL');

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        const validToken = await bcrypt.compare(resetToken, user.rows[0].reset_password_token);
        if (!validToken || user.rows[0].reset_password_expires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
            [hashedNewPassword, user.rows[0].id]

        );

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Handles user login functionality.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user.rows[0].id, role: user.rows[0].role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Handles user registration functionality.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.role - The role of the new user.
 * @param {string} req.body.institution_id - The institution ID of the new user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.register = async (req, res) => {
    const { username, password, role, institution_id } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, password, role, institution_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, hashedPassword, role, institution_id]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        // console.log('Error caught:', error);
        res.status(500).json({message: error.message});
    }
};
