import { Bot, Send, Sparkles } from 'lucide-react';

const AiPreviewSection = () => {
  return (
    <section id="ai" className="py-24 bg-white dark:bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full mb-6 border border-purple-100">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Your Intelligent Companion</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
              Ask CampusOne AI. <br/> Get instant answers.
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 leading-relaxed">
              Powered by Google Gemini, the AI Assistant understands your context and helps you navigate campus life seamlessly. From finding labs to generating career roadmaps, it's always there to help.
            </p>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span>"Where is Lab 301?"</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span>"Show today's events."</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <span>"Recommend AI workshops."</span>
              </div>
            </div>
          </div>

          {/* AI Chat Preview Mockup */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center space-x-3 bg-gray-50 dark:bg-slate-900/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">CampusOne AI</h4>
                  <p className="text-xs text-green-500 font-medium">Online • Powered by Gemini</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6 h-80 overflow-y-auto bg-gray-50 dark:bg-slate-900/30">
                <div className="flex items-start justify-end space-x-3">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-[80%]">
                    <p className="text-sm">How do I apply for OD?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 text-gray-800 dark:text-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%]">
                    <p className="text-sm">To apply for On Duty (OD), navigate to the <strong>Smart Document Center</strong> from your dashboard, select the 'OD Request' template, fill in the reason and dates, and download the generated PDF. Let me know if you want me to take you there!</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-50">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask CampusOne AI..." 
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-full focus:ring-indigo-500 focus:border-indigo-500 block px-4 py-3 pr-12"
                    readOnly
                  />
                  <button className="absolute inset-y-0 right-1 flex items-center px-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:text-indigo-300">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiPreviewSection;
