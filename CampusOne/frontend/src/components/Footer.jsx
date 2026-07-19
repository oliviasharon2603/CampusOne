import { Sparkles, Code, MessageCircle, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">CampusOne</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              An AI-powered Digital Campus Companion designed to simplify student life, centralize resources, and provide intelligent assistance.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <Code className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <MessageCircle className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Briefcase className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#features" className="text-base text-gray-500 hover:text-indigo-600">Features</a></li>
                  <li><a href="#departments" className="text-base text-gray-500 hover:text-indigo-600">Departments</a></li>
                  <li><a href="#events" className="text-base text-gray-500 hover:text-indigo-600">Events</a></li>
                  <li><a href="#library" className="text-base text-gray-500 hover:text-indigo-600">Library</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">Help Center</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">Privacy Policy</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">Terms of Service</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-indigo-600">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2026 CampusOne. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
