var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/auth');
const db = require('../models');
const ParticipantService = require('../services/ParticipantService');
const participantService = new ParticipantService(db);

// Post Create new participant
router.post('/add', isAuth, async function(req, res, next) {
	try {
		const participant = await participantService.create(req.body);
		return res.status(201).json({ status: 'success', data: { statusCode: 201, result: participant } });
	} catch  (err) {
		next(err);
	}
});

// Get All participants
router.get('/', isAuth, async function (req, res, next) {
	try {
		const participants = await participantService.getAll();
		return res.status(200).json({ status: 'success', data: { statusCode: 200, result: participants } });
	} catch (err) {
		next(err);
	}
});

// Get All personal details of participants
router.get('/details', isAuth, async function(req, res, next) {
	try {
		const participants = await participantService.getAllDetails();
		return res.status(200).json({ status: 'success', data: { statusCode: 200, result: participants } });
	} catch  (err) {
		next(err);
	}
});

// Get details about one participant
router.get('/details/:email', isAuth, async function(req, res, next) {
	try {
		const participant = await participantService.getDetailsByEmail(req.params.email);
		return res.status(200).json({ status: 'success', data: { statusCode: 200, result: participant } });
	} catch  (err) {
		next(err);
	}
});

// Get work details of one participant
router.get('/work/:email', isAuth, async function(req, res, next) {
	try {
		const participant = await participantService.getWorkByEmail(req.params.email);
		return res.status(200).json({ status: 'success', data: { statusCode: 200, result: participant.Work } });
	} catch  (err) {
		next(err);
	}
});

// Get home details of one participant
router.get('/home/:email', isAuth, async function(req, res, next) {
	try {
		const participant = await participantService.getHomeByEmail(req.params.email);
		return res.status(200).json({ status: 'success', data: { statusCode: 200, result: participant.Home } });
	} catch  (err) {
		next(err);
	}
});

// Put update a participants info
router.put('/:email', isAuth, async function(req, res, next) {
	try {
		const participantUpdate = await participantService.updateByEmail(req.params.email, req.body);
		return res.status(200).json({ status: 'success', data: { statusCode: 200, result: participantUpdate } });
	} catch  (err) {
		next(err);
	}
});

// Delete a participant
router.delete('/:email', isAuth, async function(req, res, next) {
	try {
		const participantDelete = await participantService.deleteByEmail(req.params.email);
		return res.status(200).json({ status: 'success', data: { statusCode: 200, result: participantDelete } });
	} catch  (err) {
		next(err);
	}
});



module.exports = router;