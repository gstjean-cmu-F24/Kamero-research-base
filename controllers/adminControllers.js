const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const institutionModel = require('../models/instituitionModel');
const researchTopicModel = require('../models/researchTopicModel');
const analyticsModel = require('../models/analyticsModel');


/**
 * Manage users by performing CRUD operations.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.action - The action to perform: 'create', 'read', 'update', 'delete'.
 * @param {string} [req.body.id] - The ID of the user (required for 'read', 'update', and 'delete').
 * @param {string} [req.body.username] - The username of the user (required for 'create' and 'update').
 * @param {string} [req.body.password] - The password of the user (required for 'create' and 'update').
 * @param {string} [req.body.role] - The role of the user (required for 'create' and 'update').
 * @param {string} [req.body.institutionId] - The institution ID of the user (required for 'create' and 'update').
 * @param {Object} res - The response object.
 * @returns {void}
 */

exports.manageUsers = async (req, res) => {
    const { action, id, username, password, role, institutionId } = req.body;

    try {
        let result;
        switch(action) {
            case 'create':
                const hashedPassword = await bcrypt.hash(password, 10);
                result = await userModel.createUser(username, hashedPassword, role, institutionId);
                res.status(201).json(result);
                break;
            case 'read':
                result = await userModel.getUserById(id);
                if (!result) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json(result);
                break;
            case 'update':
                const hashedPasswordUpdate = await bcrypt.hash(password, 10);
                result = await userModel.updateUser(id, username, hashedPasswordUpdate, role, institutionId);
                res.status(200).json(result);
                break;
            case 'delete':
                await userModel.deleteUser(id);
                res.status(204).send();
                break;
            default:
                res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error in manageUsers:', error.message);
        res.status(500).json({ message: error.message});
    }
};


/**
 * Manage institutions by performing CRUD operations.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.action - The action to perform: 'create', 'read', 'update', 'delete'.
 * @param {string} [req.body.id] - The ID of the institution (required for 'read', 'update', and 'delete').
 * @param {string} [req.body.name] - The name of the institution (required for 'create' and 'update').
 * @param {string} [req.body.address] - The address of the institution (required for 'create' and 'update').
 * @param {Object} res - The response object.
 * @returns {void}
 */

exports.manageInstitutions = async (req, res) => {
    const { action, id, name, address } = req.body;

    try {
        let result;
        switch(action) {
            case 'create':
                result = await institutionModel.createInstitution(name, address);
                res.status(201).json(result);
                break;
            case 'read':
                result = await institutionModel.getInstitutionById(id);
                if (!result) {
                    return res.status(404).json({ message: 'Institution not found' });
                }
                res.status(200).json(result);
                break;
            case 'update':
                result = await institutionModel.updateInstitution(id, name, address);
                res.status(200).json(result);
                break;
            case 'delete':
                await institutionModel.deleteInstitution(id);
                res.status(204).send();
                break;
            default:
                res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};


/**
 * Manage research topics by performing CRUD operations.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.action - The action to perform: 'create', 'read', 'update', 'delete'.
 * @param {string} [req.body.id] - The ID of the research topic (required for 'read', 'update', and 'delete').
 * @param {string} [req.body.title] - The title of the research topic (required for 'create' and 'update').
 * @param {string} [req.body.description] - The description of the research topic (required for 'create' and 'update').
 * @param {string[]} [req.body.tags] - The tags associated with the research topic (required for 'create' and 'update').
 * @param {Object} res - The response object.
 * @returns {void}
 */

exports.manageResearchTopics = async (req, res) => {
    const { action, id, title, description, tags } = req.body;

    try {
        let result;
        switch(action) {
            case 'create':
                result = await researchTopicModel.createResearchTopic(title, description, tags);
                res.status(201).json(result);
                break;
            case 'read':
                result = await researchTopicModel.getResearchTopicById(id);
                if (!result) {
                    return res.status(404).json({ message: 'Research topic not found' });
                }
                res.status(200).json(result);
                break;
            case 'update':
                result = await researchTopicModel.updateResearchTopic(id, title, description, tags);
                res.status(200).json(result);
                break;
            case 'delete':
                await researchTopicModel.deleteResearchTopic(id);
                res.status(204).send();
                break;
            default:
                res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * View system analytics including user activity and research access stats.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */

exports.viewSystemAnalytics = async (req, res) => {
    try {
        const userActivityStats = await analyticsModel.getUserActivityStats();
        const researchAccessStats = await analyticsModel.getResearchAccessStats();

        res.status(200).json({
            userActivityStats,
            researchAccessStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};
