const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    scores: {
        technicalDepth: {
            type: Number,
            default: 0,
        },
        clarity: {
            type: Number,
            default: 0,
        },
        confidence: {
            type: Number,
            default: 0,
        },
    },
    strengths: [String],
    weaknesses: [String],
    suggestedImprovements: [String],
    modelAnswers: [
        {
            question: String,
            suggestedAnswer: String
        }
    ],
    overallFeedback: {
        type: String
    },
}, {
    timestamps: true,
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

module.exports = InterviewSession;
