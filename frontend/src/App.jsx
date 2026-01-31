import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Evaluation from './pages/Evaluation';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--accent-color)] selection:text-white">
          <Navbar />
          <main className="mx-auto max-w-7xl pt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/interview/:interviewId" element={<Interview />} />
              <Route path="/evaluation/:interviewId" element={<Evaluation />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
