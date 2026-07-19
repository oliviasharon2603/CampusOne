import { Link } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CampusOne</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#departments" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Departments</a>
            <a href="#ai" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">AI Assistant</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Login
            </Link>
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm shadow-indigo-200">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1">
          <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">Features</a>
          <a href="#departments" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">Departments</a>
          <a href="#ai" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">AI Assistant</a>
          <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">About</a>
          <div className="pt-4 flex flex-col space-y-2">
            <Link to="/login" className="block w-full text-center px-4 py-2 text-gray-600 font-medium border border-gray-200 rounded-md">Login</Link>
            <Link to="/login" className="block w-full text-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
