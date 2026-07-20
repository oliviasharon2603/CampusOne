import React from 'react';
import { Bot, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import aiMockup from '../assets/ai_mockup.png';

const AIFeatureSection = () => {
  return (
    <section id="ai" className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
          
          {/* AI Image / Mockup */}
          <div className="lg:w-1/2 relative w-full">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-900/50">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 z-10"></div>
              <img 
                src={aiMockup} 
                alt="AI Chatbot Visualization" 
                className="w-full h-auto object-cover opacity-90 transform hover:scale-105 transition-transform duration-1000"
              />
              
              {/* Floating Chat Bubble Simulation */}
              <div className="absolute bottom-10 right-10 z-20 bg-gray-900/80 backdrop-blur-md p-5 rounded-2xl rounded-tr-none border border-indigo-500/30 max-w-[280px] shadow-xl animate-bounce" style={{animationDuration: '3s'}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-indigo-500 p-2 rounded-full"><Bot className="w-4 h-4 text-white" /></div>
                  <span className="font-bold text-sm">CampusOne AI</span>
                </div>
                <p className="text-gray-300 text-sm">"Hey! I found 3 coding workshops happening this week. Want me to register you?"</p>
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center bg-gray-800 border border-gray-700 px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
              <span className="text-sm font-semibold text-gray-300">Google Gemini Integration</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Your Personal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Campus Assistant.</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Meet the CampusOne AI. Need to find a library book? Want to know when the next bus leaves? Just ask. Our intelligent companion is available 24/7 to guide you through campus life.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-3 rounded-xl text-indigo-400 shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Conversational UI</h4>
                  <p className="text-gray-400">Chat naturally just like you would with a friend.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-3 rounded-xl text-purple-400 shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Instant Actions</h4>
                  <p className="text-gray-400">The AI can fetch real-time data, navigate modules, and assist you instantly.</p>
                </div>
              </div>
            </div>
            
            <Link to="/login" className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-full text-gray-900 bg-white hover:bg-gray-100 transition-colors shadow-lg hover:shadow-white/20">
              Try the AI Assistant
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AIFeatureSection;
