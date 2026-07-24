import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-800/80  backdrop-blur-md border-b border-gray-100 dark:border-slate-700/50  transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600  p-1.5 rounded-lg shadow-sm shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white ">CampusOne</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#explore" className="text-gray-600 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  font-medium transition-colors">Explore</a>
            <a href="#departments" className="text-gray-600 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  font-medium transition-colors">Departments</a>
            <a href="#ai" className="text-gray-600 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  font-medium transition-colors">AI Assistant</a>
            <a href="#about" className="text-gray-600 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  font-medium transition-colors">About</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-warning-500" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-slate-300" />}
            </button>
            <Link to="/login" className="bg-indigo-600  hover:bg-indigo-700  text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm shadow-indigo-200 ">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-warning-500" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-slate-300" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800  border-t border-gray-100 dark:border-slate-700/50  px-4 pt-2 pb-4 space-y-1">
          <a href="#explore" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  hover:bg-indigo-50 dark:bg-indigo-900/30 ">Explore</a>
          <a href="#departments" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  hover:bg-indigo-50 dark:bg-indigo-900/30 ">Departments</a>
          <a href="#ai" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  hover:bg-indigo-50 dark:bg-indigo-900/30 ">AI Assistant</a>
          <a href="#about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-300  hover:text-indigo-600 dark:text-indigo-400  hover:bg-indigo-50 dark:bg-indigo-900/30 ">About</a>
          <div className="pt-4 flex flex-col space-y-2">
            <Link to="/login" className="block w-full text-center px-4 py-2 bg-indigo-600  text-white font-medium rounded-md">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
