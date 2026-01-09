const InterviewSession = require('../models/InterviewSession');
const ChatHistory = require('../models/ChatHistory');
const { generateAIResponse, analyzeInterview } = require('../services/aiService');

/**
 * Clean Logic: Prompt Template
 */
const getSystemPrompt = (role, level) => `You are a Senior Technical Interviewer.

Rules:
- Ask one question at a time
- Adapt based on the candidate's previous answers
- If answer lacks depth, ask a follow-up
- If answer is good, go deeper
- Do NOT give feedback
- Maintain professional tone

Role: ${role}
Level: ${level}

Ask the next interview question.`;

/**
 * Starts a new interview session.
 * POST /api/interview/start
 */
const startInterview = async (req, res) => {
    try {
        const { role, level } = req.body || {};

        if (!role || !level) {
            return res.status(400).json({ message: 'Role and level are required.' });
        }

        // 1. Create Interview Session
        const session = new InterviewSession({ role, level });
        await session.save();

        // 2. Initialize Chat History (Empty messages, prompt is dynamic)
        const chatHistory = new ChatHistory({
            interviewId: session._id,
            messages: []
        });

        // 3. Generate First Question
        const systemPrompt = getSystemPrompt(role, level);
        const aiResponse = await generateAIResponse([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Please start the interview.' }
        ]);

        // 4. Save AI Response to Chat History
        chatHistory.messages.push({ role: 'ai', content: aiResponse });
        await chatHistory.save();

        res.status(201).json({
            interviewId: session._id,
            question: aiResponse
        });

    } catch (error) {
        console.error('Start Interview Error:', error);
        res.status(500).json({ message: 'Failed to start interview.' });
    }
};

/**
 * Handles user's answer and generates next question.
 * POST /api/interview/answer
 */
const answerQuestion = async (req, res) => {
    try {
        const { interviewId, userAnswer } = req.body || {};

        if (!interviewId || !userAnswer) {
            return res.status(400).json({ message: 'Interview ID and user answer are required.' });
        }

        // 1. Fetch Session and Chat History
        const session = await InterviewSession.findById(interviewId);
        if (!session) {
            return res.status(404).json({ message: 'Interview session not found.' });
        }

        const chatHistory = await ChatHistory.findOne({ interviewId });
        if (!chatHistory) {
            return res.status(404).json({ message: 'Chat history not found for this session.' });
        }

        // 2. Prepare dynamic system prompt
        const systemPrompt = getSystemPrompt(session.role, session.level);

        // 3. Build messages array for AI
        const apiMessages = [{ role: 'system', content: systemPrompt }];

        // Add history
        chatHistory.messages.forEach(msg => {
            apiMessages.push({
                role: msg.role === 'ai' ? 'assistant' : 'user',
                content: msg.content
            });
        });

        // Add latest user answer
        apiMessages.push({ role: 'user', content: userAnswer });

        // 4. Call AI
        const aiResponse = await generateAIResponse(apiMessages);

        // 5. Update History
        chatHistory.messages.push({ role: 'user', content: userAnswer });
        chatHistory.messages.push({ role: 'ai', content: aiResponse });
        await chatHistory.save();

        res.status(200).json({
            question: aiResponse
        });

    } catch (error) {
        console.error('Answer Question Error:', error);
        res.status(500).json({ message: 'Failed to process answer.' });
    }
};

/**
 * Ends the interview and generates an evaluation report.
 * POST /api/interview/end
 */
const endInterview = async (req, res) => {
    try {
        const { interviewId } = req.body || {};

        if (!interviewId) {
            return res.status(400).json({ message: 'Interview ID is required.' });
        }

        // 1. Fetch Session and Chat History
        const session = await InterviewSession.findById(interviewId);
        if (!session) {
            return res.status(404).json({ message: 'Interview session not found.' });
        }

        if (session.endTime) {
            return res.status(400).json({ message: 'Interview has already ended.' });
        }

        const chatHistory = await ChatHistory.findOne({ interviewId });
        if (!chatHistory) {
            return res.status(404).json({ message: 'Chat history not found.' });
        }

        // 2. Analyze with AI
        const evaluation = await analyzeInterview(chatHistory.messages);

        // 3. Update Session
        session.endTime = new Date();
        session.scores = {
            technicalDepth: evaluation.technicalDepth,
            clarity: evaluation.clarity,
            confidence: evaluation.confidence
        };
        session.strengths = evaluation.strengths;
        session.weaknesses = evaluation.weaknesses;
        session.suggestedImprovements = evaluation.suggestedImprovements;
        session.modelAnswers = evaluation.modelAnswers;

        await session.save();

        res.status(200).json({
            message: 'Interview ended and evaluated successfully.',
            report: evaluation
        });

    } catch (error) {
        console.error('End Interview Error:', error);
        res.status(500).json({ message: 'Failed to end and evaluate interview.' });
    }
};

module.exports = {
    startInterview,
    answerQuestion,
    endInterview
};
