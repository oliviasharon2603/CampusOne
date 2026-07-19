import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import chatbotLogo from '../../assets/chatbot-logo.jpg';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
let genAI = null;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (e) {
  console.error("Failed to initialize Gemini SDK", e);
}

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I am Freshie AI. How can I help you with your campus needs today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Keep track of the model and chat session
  const [model, setModel] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!genAI) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let userContext = "The user is currently anonymous or not logged in.";
      let userName = "";

      if (user) {
        userName = user.email.split('@')[0]; // Extract name from email as fallback
        userContext = `The user's email is ${user.email}. You can call them ${userName}.`;
        
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            userContext += ` They are studying in the ${data.department} department, batch ${data.batchNumber}.`;
          }
        } catch (e) {
          console.error("Failed to fetch user details for chatbot", e);
        }
      }

      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });

      const initializedModel = genAI.getGenerativeModel({ 
        model: "gemini-3.5-flash",
        systemInstruction: `You are Freshie AI, an intelligent, friendly student assistant for the CampusOne platform. 
Your primary goal is to help students navigate their campus life, answer questions about courses, departments, and general university activities.
Always introduce yourself as Freshie AI. Do NOT mention that you are a large language model, Gemini, or built by Google.
The current date is ${currentDate}.
${userContext}
Keep your answers concise, friendly, and helpful.`
      });
      
      setModel(initializedModel);
      chatRef.current = initializedModel.startChat({ history: [] });
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    if (!model || !chatRef.current) {
      setMessages(prev => [...prev, { text: "Error: AI Model is not properly configured.", isBot: true }]);
      setIsLoading(false);
      return;
    }

    try {
      // Use sendMessage to automatically maintain conversation history
      const result = await chatRef.current.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { text: text, isBot: true }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages(prev => [...prev, { text: `Sorry, I encountered an error: ${error.message || 'Please try again later.'}`, isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[350px] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center space-x-3">
          <img src={chatbotLogo} alt="Freshie AI" className="w-10 h-10 rounded-full border-2 border-white/30 bg-white p-0.5 object-cover" />
          <div>
            <h3 className="font-bold text-lg leading-tight">Freshie AI</h3>
            <p className="text-xs text-primary-100">Ask. Discover. Grow.</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none' : 'bg-primary-600 text-white shadow-md rounded-tr-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
              <span className="text-xs text-gray-500">Freshie is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
