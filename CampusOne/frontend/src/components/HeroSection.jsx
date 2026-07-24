import { Link } from 'react-router-dom';
import { ArrowRight, Bot } from 'lucide-react';
import campusMain from '../assets/campus_main.png';

const HeroSection = () => {
  return (
    <div className="pt-[120px] pb-[80px] bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-5 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">

            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              One Campus. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Infinite Possibilities.</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Experience the future of education at our premium campus in Trichy, Tamil Nadu. CampusOne centralizes every essential service into one intelligent, AI-powered platform to simplify your student journey.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#explore" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all">
                Explore Campus
              </a>
            </div>
          </div>
          
          {/* Right Image Content */}
          <div className="lg:w-1/2 relative w-full max-w-lg mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-[2.5rem] transform rotate-3 scale-105 opacity-50 blur-xl blur-2xl animate-pulse"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
              <img 
                src={campusMain} 
                alt="Modern College Campus in Trichy" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
