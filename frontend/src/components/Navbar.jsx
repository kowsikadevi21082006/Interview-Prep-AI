import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-color)] text-white group-hover:rotate-12 transition-transform">
                        <Laptop size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                        AI <span className="text-[var(--accent-color)]">Interviewer</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="hidden h-8 w-[1px] bg-[var(--border-color)] sm:block"></div>
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Mode</span>
                        <span className="text-sm font-bold text-[var(--text-primary)]">{isDarkMode ? 'Dark' : 'Light'}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
