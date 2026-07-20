import { Link } from 'react-router-dom';
import { ArrowRight, Bot } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="pt-[150px] pb-[100px] bg-gray-50  min-h-[60vh] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 text-center">
        
        {/* Simple Pill */}
        <div className="inline-flex items-center bg-indigo-100  px-4 py-2 rounded-full mb-8">
          <Bot className="w-5 h-5 text-indigo-700  mr-2" />
          <span className="text-sm font-semibold text-indigo-900 ">Powered by Google Gemini AI</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900  mb-6 leading-tight">
          One Campus. One Platform. <br />
          <span className="text-indigo-600 ">Infinite Possibilities.</span>
        </h1>
        
        {/* Paragraph */}
        <p className="text-xl text-gray-600  max-w-3xl mx-auto mb-10 leading-relaxed">
          CampusOne is your AI-powered Digital Campus Companion. We centralize every campus service into one intelligent platform to simplify your student journey.
        </p>
        
        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/login" className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700   transition-colors shadow-sm">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a href="#features" className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-indigo-700  bg-indigo-100 hover:bg-indigo-200   transition-colors">
            Explore Features
          </a>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
