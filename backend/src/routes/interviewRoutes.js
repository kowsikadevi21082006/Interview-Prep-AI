const express = require('express');
const router = express.Router();
const { startInterview, answerQuestion, endInterview } = require('../controllers/interviewController');

router.post('/start', startInterview);
router.post('/answer', answerQuestion);
router.post('/end', endInterview);

module.exports = router;
