const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.CEREBRAS_API_KEY,
    baseURL: 'https://api.cerebras.ai/v1',
});

/**
 * Generates an AI response based on the provided messages (history).
 * @param {Array} messages - The array of message objects {role, content}.
 * @returns {Promise<string>} - The AI's text response.
 */
async function generateAIResponse(messages) {
    try {
        const response = await client.chat.completions.create({
            messages: messages,
            model: 'llama3.1-8b', // Standard model for Cerebras
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Cerebras API Error:', error);
        throw new Error('Failed to generate AI response. Please try again later.');
    }
}

/**
 * Analyzes the interview transcript and returns a structured evaluation.
 * @param {Array} transcript - The full chat history.
 * @returns {Promise<Object>} - The evaluation report.
 */
async function analyzeInterview(transcript) {
    try {
        const systemPrompt = `You are a technical interview evaluator.

Evaluate the candidate based on:
1. Technical Depth
2. Clarity
3. Confidence

Return the evaluation in JSON format:
{
  "technicalDepth": 1-10,
  "clarity": 1-10,
  "confidence": 1-10,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestedImprovements": ["string"],
  "modelAnswers": [
    { "question": "string", "suggestedAnswer": "string" }
  ]
}

Transcript:
${JSON.stringify(transcript)}

Ensure the response is ONLY the raw JSON object.`;

        const response = await client.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }],
            model: 'llama3.1-8b',
            response_format: { type: 'json_object' }, // Cerebras supports JSON format if the model does
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('AI Analysis Error:', error);
        throw new Error('Failed to analyze interview.');
    }
}

module.exports = {
    generateAIResponse,
    analyzeInterview,
};
