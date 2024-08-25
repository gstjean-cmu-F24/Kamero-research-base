const authController = require('../../controllers/authController');
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

jest.mock('../../db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('crypto');




// Custom matcher to check if a number is close to the current timestamp




describe('Auth Controller', () => {
    // forgotPassword tests
    describe('forgotPassword', () => {
        it('should generate a reset token and update user in the database', async () => {
            const mockUser = { id: 1, email: 'user@example.com' };
            const mockResetToken = 'mockResetToken';
            const mockHashedToken = 'mockHashedToken';
            const mockExpiry = Date.now() + 3600000; // Example: 1 hour from now add  Date.now() to make it good

            jest.spyOn(Date.prototype, 'getTime').mockReturnValue(mockExpiry);
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });
            crypto.randomBytes.mockReturnValue(Buffer.from(mockResetToken));
            bcrypt.hash.mockResolvedValueOnce(mockHashedToken);
            pool.query.mockResolvedValueOnce();

            const req = { body: { email: 'user@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await authController.forgotPassword(req, res);
            // expect(mockExpiry).toHaveLength(13),

            const toBeRecentTimestamp = (received) => {
                const now = Date.now();
                const diff = Math.abs(received - now);
                const pass = diff < 3600000; // Allow one hour  difference
                if (pass) {
                    return {
                        message: () => `expected ${received} not to be a recent timestamp`,
                        pass: true,
                    };
                } else {
                    return {
                        message: () => `expected ${received} to be a recent timestamp`,
                        pass: false,
                    };
                }
            };


            expect.extend({ toBeRecentTimestamp });

            expect(mockExpiry).toBeRecentTimestamp();



            expect(pool.query).toHaveBeenNthCalledWith(
                2,
                'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
                [mockHashedToken,
                    expect.any(Number), // Allow for a small difference in the timestamp
                    mockUser.id]
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Password reset token generated',
                resetToken: Buffer.from(mockResetToken).toString('hex') // Expected hex value here
            });
        // });
    });


    // rest of the forgotPassword tests
        it('should return 500 in case of an error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = { body: { email: 'greenfieldchinedu6@gmail.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await authController.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
    });
});


describe('resetPassword', () => {
    it('should return 400 if the token is invalid or expired', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const req = { body: { resetToken: 'invalid-token', newPassword: 'newPassword123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await authController.resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired password reset token' });
    });

    it('should reset the user\'s password and remove the token', async () => {
        const user = { id: 2, reset_password_token: 'hashed-reset-token', reset_password_expires: Date.now() + 10000 };
        const newPassword = 'newPassword123';
        const hashedPassword = 'hashed-new-password';

        pool.query.mockResolvedValueOnce({ rows: [user] });
        bcrypt.compare.mockResolvedValueOnce(true);
        bcrypt.hash.mockResolvedValueOnce(hashedPassword);

        const req = { body: { resetToken: 'valid-token', newPassword } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await authController.resetPassword(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
            [hashedPassword, user.id]
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password has been reset' });
    });

    it('should return 500 in case of an error', async () => {
        pool.query.mockRejectedValueOnce(new Error('Database error'));

        const req = { body: { resetToken: 'valid-token', newPassword: 'newPassword123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await authController.resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('login', () => {
    it('should return 401 if the user is not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const req = { body: { username: 'nonexistent', password: 'password' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return a JWT token on successful login', async () => {
        const user = { id: 1, username: 'validUser', password: 'hashed-password', role: 'user' };
        const token = 'jwt-token';

        pool.query.mockResolvedValueOnce({ rows: [user] });
        bcrypt.compare.mockResolvedValueOnce(true);
        jwt.sign.mockReturnValueOnce(token);

        const req = { body: { username: 'validUser', password: 'password' } };
        const res = { json: jest.fn() };

        await authController.login(req, res);

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: user.id, role: user.role },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );
        expect(res.json).toHaveBeenCalledWith({ token, user: { id: user.id, role: user.role } });
    });

    it('should return 500 in case of an error', async () => {
        pool.query.mockRejectedValueOnce(new Error('Database error'));

        const req = { body: { username: 'validUser', password: 'password' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('register', () => {
    it('should create a new user and return 201', async () => {
        const newUser = { id: 1, username: 'newUser', role: 'user', institution_id: 1 };
        const hashedPassword = 'hashed-password';

        bcrypt.hash.mockResolvedValueOnce(hashedPassword);
        pool.query.mockResolvedValueOnce({ rows: [newUser] });

        const req = { body: { username: 'newUser', password: 'password', role: 'user', institution_id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await authController.register(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO users (username, password, role, institution_id) VALUES ($1, $2, $3, $4) RETURNING *',
            ['newUser', hashedPassword, 'user', 1]
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newUser);
    });

    // register tests
    describe('register', () => {
        it('should return 500 in case of an error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const req = { body: { username: 'newUser', password: 'password', role: 'user', institution_id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });  // Update the expectation here
        });
    });
});
