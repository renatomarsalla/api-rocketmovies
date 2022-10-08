const { Router } = require('express');

const { SessionsController } = require('../controllers/SessionsController');

const sessionsController = new SessionsController();

const useSessions = Router();

useSessions.post('/', sessionsController.create);

module.exports = { useSessions };

