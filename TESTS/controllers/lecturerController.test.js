// lecturerController.test.js

const request = require('supertest');
const express = require('express');
const router = require('../../routes/lecturer');
const pool = require('../../db');

// Mock the authenticateToken middleware
jest.mock('../../middleware/auth', () => (req, res, next) => {
    req.user = { id: 1, institution_id: 600, role: 'lecturer' }; // Mocked user data
    next();
});

// Set up a test app using the lecturer routes
const app = express();
app.use(express.json());
app.use('/lecturer', router);

describe('Lecturer Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear any mocks after each test
    });

    describe('GET /lecturer/institutions', () => {
        it('should return assigned institutions for the lecturer', async () => {
            const mockData = [
                { id: 1, name: 'Institution A', permissions: {} },
            ];
            jest.spyOn(pool, 'query').mockResolvedValue({ rows: mockData });

            const res = await request(app).get('/lecturer/institutions');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData);
        });

        it('should handle errors when fetching institutions', async () => {
            jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/lecturer/institutions');
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Database error');
        });
    });

    describe('POST /lecturer/research', () => {
        it('should allow lecturer to upload research', async () => {
            const mockResearch = {
                id: 1,
                title: 'Research Title',
                abstract: 'Research abstract',
                file_url: 'files/research.pdf',
                tags: {},
                institution_id: 600,
                user_id: 1,
                status: 'pending',
            };

            jest.spyOn(pool, 'query').mockResolvedValue({ rows: [mockResearch] });

            const res = await request(app)
                .post('/lecturer/research')
                .send({
                    title: 'Research Title',
                    abstract: 'Research abstract',
                    file_url: 'http://example.com/file.pdf',
                    tags: {},
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(mockResearch);
        });

        it('should handle errors when uploading research', async () => {
            jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/lecturer/research').send({
                title: 'Research Title',
                abstract: 'Research abstract',
                file_url: 'http://example.com/file.pdf',
                tags: {},
            });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Database error');
        });
    });

    describe('GET /lecturer/student-uploads', () => {
        it('should return student uploads for review', async () => {
            const mockData = [
                {
                    id: 1,
                    title: 'Student Research',
                    abstract: 'Research abstract',
                    file_url: 'http://example.com/file.pdf',
                    tags: {},
                    status: 'submitted',
                    submitted_by: 'student1',
                },
            ];

            jest.spyOn(pool, 'query').mockResolvedValue({ rows: mockData });

            const res = await request(app).get('/lecturer/student-uploads');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData);
        });

        it('should handle errors when fetching student uploads', async () => {
            jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/lecturer/student-uploads');
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Database error');
        });
    });

    describe('GET /lecturer/research', () => {
        it('should return research related to the lecturer\'s institution', async () => {
            const mockData =
                    {
                    id: 1,
                    title: 'Institution Research',
                    abstract: 'Research abstract',
                    file_url: 'http://example.com/file.pdf',
                    tags: {},
                    status: 'approved',
                }

            ;

            jest.spyOn(pool, 'query').mockResolvedValue({ rows: [mockData] });

            const res = await request(app).post('/lecturer/research');
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(mockData);
        });

        it('should handle errors when fetching institution research', async () => {
            jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/lecturer/research');
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Database error');
        });
    });
});
