import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Evaluation from './pages/Evaluation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview/:interviewId" element={<Interview />} />
          <Route path="/evaluation/:interviewId" element={<Evaluation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
