const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../../db');
const studentController = require('../../controllers/studentController');

const app = express();
app.use(express.json());
app.get('/api/research', studentController.viewAvailableResearch);
app.post('/api/research', studentController.uploadResearch);

jest.mock('../../db');

afterAll(() => {
    jest.restoreAllMocks();
});

describe('GET /api/research', () => {
    it('should return a list of available research', async () => {
        const mockResearch = [
            { id: 1, title: 'Research 1', abstract: 'Abstract 1', file_url: '../uploads/file1.pdf', tags: '{}', institution_id: 600, user_id: 1, status: 'pending' },
            { id: 2, title: 'Research 2', abstract: 'Abstract 2', file_url: '../uploads/file1.pdf', tags: '{}', institution_id: 600, user_id: 1, status: 'pending' }
        ];
        pool.query.mockResolvedValue({ rows: mockResearch });

        const response = await request(app).get('/api/research');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockResearch);
    });

    it('should return 500 if there is a server error', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/research');
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Database error' });
    });
});

describe('POST /api/research', () => {
    it('should upload a PDF file and save the research details', async () => {
        const mockResearch = {
            id: 1,
            title: 'Test Research',
            abstract: 'Test Abstract',
            file_url: '../uploads/file1.pdf',
            tags: '{}',
            institution_id: 600,
            user_id: 1,
            status: 'pending'
        };
        pool.query.mockResolvedValue({ rows: [mockResearch] });

        const response = await request(app)
            .post('/api/research')
            .field('title', 'Test Research')
            .field('abstract', 'Test Abstract')
            .field('tags', '{}')
            .field('institution_id', '600')
            .field('user_id', '1')
            .attach('researchFile', path.resolve(__dirname, 'files', 'test.pdf'));

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(mockResearch);
    });

    it('should return 400 if file type is not PDF', async () => {
        const response = await request(app)
            .post('/api/research')
            .field('title', 'Test Research')
            .field('abstract', 'Test Abstract')
            .field('tags', '{}')
            .field('institution_id', '600')
            .field('user_id', '1')
            .attach('researchFile', path.resolve(__dirname, 'files', 'test.txt')); // Non-PDF file

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Only PDF files are allowed!' });
    });

    it('should return 500 if there is a database error', async () => {
        pool.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/api/research')
            .field('title', 'Test Research')
            .field('abstract', 'Test Abstract')
            .field('tags', '{}')
            .field('institution_id', '600')
            .field('user_id', '1')
            .attach('researchFile', path.resolve(__dirname, 'files', 'test.pdf'));

        // Expect file to be deleted after error
        const filePath = path.resolve(__dirname, '../uploads', 'test.pdf');
        expect(fs.existsSync(filePath)).toBe(false);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Database error' });
    });
});