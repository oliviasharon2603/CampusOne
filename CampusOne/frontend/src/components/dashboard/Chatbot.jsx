import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini (lazy to prevent crash on missing key at startup)
let genAI = null;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (e) {
  console.error("Failed to initialize Gemini:", e);
}

const SYSTEM_INSTRUCTION = `
You are CampusOne AI Assistant, a friendly and helpful companion for students at CampusOne college.
You must always address the user as a friend, by their first name if provided.
You are strictly limited to answering queries related to college life, CampusOne, events, clubs, departments, library, transportation, and general student doubts.
If the user asks something completely unrelated to college or their student life (e.g., asking for a recipe, code for a non-college project, or global politics), you must politely refuse and steer the conversation back to how you can help them at CampusOne.
Do not hallucinate features. Keep responses concise and very conversational, using emojis.
Key Information about CampusOne:
- Events: Freshers Welcome Party (Aug 17), TechNova Hackathon, Inter-College Basketball Final, Google Cloud Campus Connect, TCS Placement Drive, Web3 Builders Hackathon.
- Clubs: Robotics & Automation Society, Music Club, Dance, Photography, Drama.
- Modules: Dashboard, Library, Departments, Events, Clubs, Transport, Canteen, Lost & Found, Documents, Career Roadmap, Complaints.
- If a user asks to register for an event (like TechNova Hackathon), you must provide a clickable Markdown link to the events page and give step-by-step instructions. For example: "To register, go to the [Events Page](/events), find the event, and click the Register button!"
`;

const Chatbot = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState('Student');
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hey there! I'm your CampusOne AI Assistant. How can I help you today? ✨" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || 'Student');
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!genAI) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your environment.");
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest", 
        systemInstruction: SYSTEM_INSTRUCTION + "\nThe user's name is " + userName 
      });
      
      const chat = model.startChat({
        history: messages.slice(1).map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      });

      const result = await chat.sendMessage(userMessage);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (error) {
      console.error(error);
      let errorMsg = `Error connecting to Gemini API:\n${error.message}\n\nPlease ensure your VITE_GEMINI_API_KEY is valid and has access to Gemini models.`;
      if (error.message.includes('503')) {
        errorMsg = "Oops, my brain is experiencing extremely high demand right now! 🧠🔥 Give me a few seconds and try asking again!";
      }
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: errorMsg 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (content) => {
    const parts = content.split(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (parts.length === 1) return content;
    
    const nodes = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        nodes.push(<span key={i}>{parts[i]}</span>);
      } else if (i % 3 === 1) {
        nodes.push(
          <a 
            key={i} 
            href={parts[i+1]} 
            className="text-primary-600 underline font-bold hover:text-primary-700 transition-colors"
          >
            {parts[i]}
          </a>
        );
        i++;
      }
    }
    return nodes;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-600 to-secondary-600 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight flex items-center gap-1">
                CampusOne AI <Sparkles className="w-3 h-3 text-yellow-300" />
              </h2>
              <p className="text-xs text-primary-100 font-medium">Always here for you, {userName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div 
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {renderMessage(msg.content)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] gap-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-100 flex items-center gap-2 rounded-tl-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-secondary-500" />
                  <span className="text-xs text-gray-500 font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about CampusOne..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-sm flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
