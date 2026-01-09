const express = require('express');
const router = express.Router();
const { startInterview, answerQuestion, endInterview, getEvaluationReport } = require('../controllers/interviewController');

router.post('/start', startInterview);
router.post('/answer', answerQuestion);
router.post('/end', endInterview);
router.get('/:interviewId/report', getEvaluationReport);

module.exports = router;
