jest.mock('bcryptjs');
jest.mock('../../models/userModel');
jest.mock('../../models/instituitionModel');
jest.mock('../../models/researchTopicModel');
jest.mock('../../models/analyticsModel');

const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const institutionModel = require('../../models/instituitionModel');
const researchTopicModel = require('../../models/researchTopicModel');
const analyticsModel = require('../../models/analyticsModel');
const { manageUsers, manageInstitutions, manageResearchTopics, viewSystemAnalytics } = require('../../controllers/adminControllers');

describe('manageUsers', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    it('should create a user', async () => {
        req.body = {
            action: 'create',
            username: 'TestUser',
            password: 'password',
            role: 'admin',
            institutionId: 600
        };
        bcrypt.hash.mockResolvedValue('hashedPassword');
        userModel.createUser.mockResolvedValue({ id: 1, username: 'TestUser' });

        await manageUsers(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
        expect(userModel.createUser).toHaveBeenCalledWith('TestUser', 'hashedPassword', 'admin', 600);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'TestUser' });
    });

    it('should read a user', async () => {
        req.body = {
            action: 'read',
            id: 1
        };
        userModel.getUserById.mockResolvedValue({ id: 1, username: 'TestUser' });

        await manageUsers(req, res);

        expect(userModel.getUserById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'TestUser' });
    });

    it('should return 404 if user not found', async () => {
        req.body = {
            action: 'read',
            id: 1
        };
        userModel.getUserById.mockResolvedValue(null);

        await manageUsers(req, res);

        expect(userModel.getUserById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should update a user', async () => {
        req.body = {
            action: 'update',
            id: 1,
            username: 'UpdatedUser',
            password: 'newPassword',
            role: 'user',
            institutionId: 600
        };
        bcrypt.hash.mockResolvedValue('newHashedPassword');
        userModel.updateUser.mockResolvedValue({ id: 1, username: 'UpdatedUser' });

        await manageUsers(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
        expect(userModel.updateUser).toHaveBeenCalledWith(1, 'UpdatedUser', 'newHashedPassword', 'user', 600);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'UpdatedUser' });
    });

    it('should delete a user', async () => {
        req.body = {
            action: 'delete',
            id: 1
        };

        await manageUsers(req, res);

        expect(userModel.deleteUser).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 for invalid action', async () => {
        req.body = {
            action: 'invalid'
        };

        await manageUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid action' });
    });

    it('should handle errors', async () => {
        req.body = {
            action: 'create',
            username: 'TestUser',
            password: 'password',
            role: 'admin',
            institutionId: 600
        };
        const error = new Error('Something went wrong');
        bcrypt.hash.mockRejectedValue(error);

        await manageUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
});

describe('manageInstitutions', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    it('should create an institution', async () => {
        req.body = {
            action: 'create',
            name: 'New Institution',
            address: '123 Institution Street'
        };
        institutionModel.createInstitution.mockResolvedValue({ id: 1, name: 'New Institution' });

        await manageInstitutions(req, res);

        expect(institutionModel.createInstitution).toHaveBeenCalledWith('New Institution', '123 Institution Street');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'New Institution' });
    });

    it('should read an institution', async () => {
        req.body = {
            action: 'read',
            id: 1
        };
        institutionModel.getInstitutionById.mockResolvedValue({ id: 1, name: 'Existing Institution' });

        await manageInstitutions(req, res);

        expect(institutionModel.getInstitutionById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Existing Institution' });
    });

    it('should return 404 if institution not found', async () => {
        req.body = {
            action: 'read',
            id: 1
        };
        institutionModel.getInstitutionById.mockResolvedValue(null);

        await manageInstitutions(req, res);

        expect(institutionModel.getInstitutionById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Institution not found' });
    });

    it('should update an institution', async () => {
        req.body = {
            action: 'update',
            id: 1,
            name: 'Updated Institution',
            address: '456 Updated Street'
        };
        institutionModel.updateInstitution.mockResolvedValue({ id: 1, name: 'Updated Institution' });

        await manageInstitutions(req, res);

        expect(institutionModel.updateInstitution).toHaveBeenCalledWith(1, 'Updated Institution', '456 Updated Street');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Updated Institution' });
    });

    it('should delete an institution', async () => {
        req.body = {
            action: 'delete',
            id: 1
        };

        await manageInstitutions(req, res);

        expect(institutionModel.deleteInstitution).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 for invalid action', async () => {
        req.body = {
            action: 'invalid'
        };

        await manageInstitutions(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid action' });
    });

    it('should handle errors', async () => {
        req.body = {
            action: 'create',
            name: 'New Institution',
            address: '123 Institution Street'
        };
        const error = new Error('Something went wrong');
        institutionModel.createInstitution.mockRejectedValue(error);

        await manageInstitutions(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
});


// manage Research Topics
describe('manageResearchTopics', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    it('should create a research topic', async () => {
        req.body = {
            action: 'create',
            title: 'New Research Topic',
            description: 'Description of the new research topic',
            tags: ['science', 'technology']
        };
        researchTopicModel.createResearchTopic.mockResolvedValue({
            id: 1,
            title: 'New Research Topic',
            description: 'Description of the new research topic',
            tags: ['science', 'technology']
        });

        await manageResearchTopics(req, res);

        expect(researchTopicModel.createResearchTopic).toHaveBeenCalledWith('New Research Topic', 'Description of the new research topic', ['science', 'technology']);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            title: 'New Research Topic',
            description: 'Description of the new research topic',
            tags: ['science', 'technology']
        });
    });

    it('should read a research topic', async () => {
        req.body = {
            action: 'read',
            id: 1
        };
        researchTopicModel.getResearchTopicById.mockResolvedValue({
            id: 1,
            title: 'Existing Research Topic',
            description: 'Description of the existing research topic',
            tags: ['science', 'math']
        });

        await manageResearchTopics(req, res);

        expect(researchTopicModel.getResearchTopicById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            title: 'Existing Research Topic',
            description: 'Description of the existing research topic',
            tags: ['science', 'math']
        });
    });

    it('should return 404 if research topic is not found', async () => {
        req.body = {
            action: 'read',
            id: 1
        };
        researchTopicModel.getResearchTopicById.mockResolvedValue(null);

        await manageResearchTopics(req, res);

        expect(researchTopicModel.getResearchTopicById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Research topic not found' });
    });

    it('should update a research topic', async () => {
        req.body = {
            action: 'update',
            id: 1,
            title: 'Updated Research Topic',
            description: 'Updated description',
            tags: ['biology', 'chemistry']
        };
        researchTopicModel.updateResearchTopic.mockResolvedValue({
            id: 1,
            title: 'Updated Research Topic',
            description: 'Updated description',
            tags: ['biology', 'chemistry']
        });

        await manageResearchTopics(req, res);

        expect(researchTopicModel.updateResearchTopic).toHaveBeenCalledWith(1, 'Updated Research Topic', 'Updated description', ['biology', 'chemistry']);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            title: 'Updated Research Topic',
            description: 'Updated description',
            tags: ['biology', 'chemistry']
        });
    });

    it('should delete a research topic', async () => {
        req.body = {
            action: 'delete',
            id: 1
        };

        await manageResearchTopics(req, res);

        expect(researchTopicModel.deleteResearchTopic).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 for invalid action', async () => {
        req.body = {
            action: 'invalid'
        };

        await manageResearchTopics(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid action' });
    });

    it('should handle errors', async () => {
        req.body = {
            action: 'create',
            title: 'New Research Topic',
            description: 'Description of the new research topic',
            tags: ['science', 'technology']
        };
        const error = new Error('Something went wrong');
        researchTopicModel.createResearchTopic.mockRejectedValue(error);

        await manageResearchTopics(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
});


describe('viewSystemAnalytics', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return system analytics', async () => {
        const userActivityStats = { usersActive: 100 };
        const researchAccessStats = { topicsAccessed: 50 };

        analyticsModel.getUserActivityStats.mockResolvedValue(userActivityStats);
        analyticsModel.getResearchAccessStats.mockResolvedValue(researchAccessStats);

        await viewSystemAnalytics(req, res);

        expect(analyticsModel.getUserActivityStats).toHaveBeenCalled();
        expect(analyticsModel.getResearchAccessStats).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            userActivityStats,
            researchAccessStats
        });
    });

    it('should handle errors', async () => {
        const error = new Error('Something went wrong');
        analyticsModel.getUserActivityStats.mockRejectedValue(error);

        await viewSystemAnalytics(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
});
