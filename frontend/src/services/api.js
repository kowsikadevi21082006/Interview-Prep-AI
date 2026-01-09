import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const interviewAPI = {
    start: (role, level) => API.post('/interview/start', { role, level }),
    answer: (interviewId, userAnswer) => API.post('/interview/answer', { interviewId, userAnswer }),
    end: (interviewId) => API.post('/interview/end', { interviewId }),
    getReport: (interviewId) => API.get(`/interview/${interviewId}/report`),
};

export default API;
