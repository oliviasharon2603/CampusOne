import { useState, useEffect } from 'react';
import { Sparkles, Target, Code, Briefcase, GraduationCap, Compass, CheckCircle2, ChevronRight, Zap, Award, Star, Lock, BookOpen, Clock, PlaySquare, ExternalLink, Trophy, Info } from 'lucide-react';
import Button from '../components/ui/Button';

// Configuration for Onboarding Questions
const QUESTIONS = [
  {
    id: 'goal',
    title: "What is your primary career goal?",
    options: [
      { id: 'job', label: "Corporate Job", icon: Briefcase, color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100" },
      { id: 'higher_studies', label: "Higher Studies", icon: GraduationCap, color: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100" },
      { id: 'startup', label: "Startup / Founder", icon: Zap, color: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100" }
    ]
  },
  {
    id: 'interest',
    title: "Which field excites you the most?",
    options: [
      { id: 'ai', label: "Artificial Intelligence", icon: Sparkles, color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/40" },
      { id: 'web', label: "Web / App Development", icon: Code, color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" },
      { id: 'design', label: "UI/UX Design", icon: Target, color: "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100" }
    ]
  },
  {
    id: 'hobby',
    title: "What is your primary hobby?",
    options: [
      { id: 'gaming', label: "Gaming & Esports", icon: Zap, color: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" },
      { id: 'reading', label: "Reading & Research", icon: BookOpen, color: "bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100" },
      { id: 'art', label: "Art & Creativity", icon: Target, color: "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100" }
    ]
  },
  {
    id: 'commitment',
    title: "Weekly time commitment?",
    options: [
      { id: 'casual', label: "2-5 Hours", icon: Compass, color: "bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-100" },
      { id: 'steady', label: "5-10 Hours", icon: Target, color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100" },
      { id: 'intense', label: "10+ Hours", icon: Sparkles, color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/40" }
    ]
  }
];

// Mock AI Logic to generate roadmaps based on interest
const generateRoadmapData = (interest) => {
  if (interest === 'ai') {
    return [
      { id: 1, title: "Master Python Basics", description: "Get comfortable with Python syntax, loops, and basic data structures. This is the foundation for all your AI work.", duration: "4 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=python+for+beginners+full+course", website: "freeCodeCamp", hackathon: null, deadline: "Before Sep 30", status: 'active', type: 'learn', color: 'bg-emerald-500' },
      { id: 2, title: "Complete Andrew Ng ML Course", description: "Dive deep into Machine Learning concepts. Learn about linear regression, logistic regression, and neural networks conceptually.", duration: "6 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=andrew+ng+machine+learning", website: "Coursera", hackathon: null, deadline: "Before Oct 15", status: 'locked', type: 'course', color: 'bg-indigo-500' },
      { id: 3, title: "Build a Neural Network from Scratch", description: "Implement backpropagation and forward pass in numpy without using frameworks like PyTorch or TensorFlow.", duration: "3 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=build+neural+network+from+scratch+python", website: "Kaggle", hackathon: null, deadline: "Before Nov 01", status: 'locked', type: 'project', color: 'bg-gray-300' },
      { id: 4, title: "Participate in Kaggle Competition", description: "Join a beginner-friendly Kaggle competition like Titanic or House Prices. Work on feature engineering and model tuning.", duration: "1 Month", youtubeLink: "https://www.youtube.com/results?search_query=how+to+start+with+kaggle", website: "Kaggle", hackathon: "Kaggle Getting Started", deadline: "Before Dec 20", status: 'locked', type: 'event', color: 'bg-gray-300' },
      { id: 5, title: "Secure AI Research Internship", description: "Apply to 20+ internships focusing on AI/ML roles. Prepare your resume with your Kaggle projects and Neural Net project.", duration: "3 Months", youtubeLink: "https://www.youtube.com/results?search_query=how+to+get+an+ai+internship", website: "LinkedIn", hackathon: "Smart India Hackathon 2026", deadline: "Before May 2027", status: 'locked', type: 'milestone', color: 'bg-gray-300' },
    ];
  } else if (interest === 'web') {
    return [
      { id: 1, title: "HTML, CSS & JS Mastery", description: "Learn the core trio of the web. Build static sites and learn DOM manipulation.", duration: "4 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=html+css+js+crash+course", website: "MDN Web Docs", hackathon: null, deadline: "Before Sep 30", status: 'active', type: 'learn', color: 'bg-emerald-500' },
      { id: 2, title: "Build 3 Frontend Projects", description: "Create a calculator, a weather app fetching API data, and a responsive landing page to solidify your skills.", duration: "3 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=javascript+projects+for+beginners", website: "Frontend Mentor", hackathon: null, deadline: "Before Oct 15", status: 'locked', type: 'project', color: 'bg-blue-500' },
      { id: 3, title: "Learn React & Tailwind", description: "Transition to component-based architecture and utility-first CSS styling.", duration: "4 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=react+tailwind+crash+course", website: "React Docs", hackathon: null, deadline: "Before Nov 01", status: 'locked', type: 'learn', color: 'bg-gray-300' },
      { id: 4, title: "Win TechNova Hackathon", description: "Form a team and build a full-stack MERN application over 48 hours.", duration: "Weekend", youtubeLink: "https://www.youtube.com/results?search_query=how+to+win+a+hackathon", website: "Devpost", hackathon: "TechNova Campus Hackathon", deadline: "Before Dec 10", status: 'locked', type: 'event', color: 'bg-gray-300' },
      { id: 5, title: "Full-Stack Dev Internship", description: "Target early-stage startups and apply for SDE Intern roles using your React projects.", duration: "3 Months", youtubeLink: "https://www.youtube.com/results?search_query=software+engineer+internship+tips", website: "Wellfound", hackathon: null, deadline: "Before May 2027", status: 'locked', type: 'milestone', color: 'bg-gray-300' },
    ];
  } else {
    return [
      { id: 1, title: "Learn Figma Fundamentals", description: "Understand vectors, frames, auto-layout, and components in Figma.", duration: "2 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=figma+tutorial+for+beginners", website: "Figma Community", hackathon: null, deadline: "Before Sep 30", status: 'active', type: 'learn', color: 'bg-emerald-500' },
      { id: 2, title: "Complete 100 Days of UI", description: "Design a new UI component every day. This builds consistency and exposes you to different design patterns.", duration: "100 Days", youtubeLink: "https://www.youtube.com/results?search_query=daily+ui+challenge", website: "Daily UI", hackathon: null, deadline: "Before Oct 30", status: 'locked', type: 'project', color: 'bg-pink-500' },
      { id: 3, title: "Build Portfolio Website", description: "Showcase your case studies and UI designs on a personal website using Framer or Webflow.", duration: "4 Weeks", youtubeLink: "https://www.youtube.com/results?search_query=framer+portfolio+tutorial", website: "Framer", hackathon: null, deadline: "Before Nov 15", status: 'locked', type: 'project', color: 'bg-gray-300' },
      { id: 4, title: "Attend DesignX Conference", description: "Network with senior designers, attend workshops, and get your portfolio reviewed.", duration: "1 Weekend", youtubeLink: "https://www.youtube.com/results?search_query=ux+design+conference+vlog", website: "DesignX", hackathon: "Design-a-thon 2026", deadline: "Before Dec 05", status: 'locked', type: 'event', color: 'bg-gray-300' },
      { id: 5, title: "Product Design Internship", description: "Apply to tech companies with a focus on user-centric design. Highlight your case studies.", duration: "3 Months", youtubeLink: "https://www.youtube.com/results?search_query=how+to+get+product+design+internship", website: "LinkedIn", hackathon: null, deadline: "Before May 2027", status: 'locked', type: 'milestone', color: 'bg-gray-300' },
    ];
  }
};

const RoadmapPage = () => {
  const [stage, setStage] = useState('onboarding'); // 'onboarding', 'generating', 'roadmap'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({ goal: null, interest: null, hobby: null, commitment: null });
  
  const [roadmap, setRoadmap] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Handle answering onboarding questions
  const handleAnswer = (questionId, optionId) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestionIdx(currentQuestionIdx + 1), 300);
    } else {
      // Finished onboarding, start generation
      setStage('generating');
      setTimeout(() => {
        setRoadmap(generateRoadmapData(newAnswers.interest));
        setStage('roadmap');
      }, 2500); // 2.5s mock AI generation
    }
  };

  // Complete a milestone
  const completeMilestone = (nodeId) => {
    setRoadmap(prev => {
      let foundActive = false;
      return prev.map(node => {
        if (node.id === nodeId) {
          return { ...node, status: 'completed', color: 'bg-emerald-500' };
        }
        // Unlock the very next node
        if (node.status === 'locked' && !foundActive) {
          foundActive = true;
          // Assign vibrant color based on type
          const color = node.type === 'project' ? 'bg-blue-500' : node.type === 'event' ? 'bg-orange-500' : node.type === 'milestone' ? 'bg-purple-500' : 'bg-indigo-500';
          return { ...node, status: 'active', color };
        }
        return node;
      });
    });
    setSelectedNode(null);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col pb-10">
      
      {/* ---------------- STATE 1: ONBOARDING ---------------- */}
      {stage === 'onboarding' && (
        <div className="flex-1 flex flex-col justify-center items-center animate-in zoom-in-95 duration-500">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 mb-4 animate-bounce shadow-sm">
              <Compass className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Let's build your path.</h1>
            <p className="text-gray-500 dark:text-slate-300 mt-2 text-lg">Answer a few questions to generate your personalized AI roadmap.</p>
          </div>

          <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700/50 overflow-hidden relative">
            
            {/* Header Image for the Questionnaire */}
            <div className="w-full h-48 sm:h-56 relative bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                alt="Students collaborating" 
                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-primary-400 font-bold text-sm tracking-wider uppercase mb-1">
                  Question {currentQuestionIdx + 1} of {QUESTIONS.length}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {QUESTIONS[currentQuestionIdx].title}
                </h2>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5">
              <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${((currentQuestionIdx) / QUESTIONS.length) * 100}%` }}></div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {QUESTIONS[currentQuestionIdx].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(QUESTIONS[currentQuestionIdx].id, option.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg ${option.color}`}
                  >
                    <option.icon className="w-12 h-12 mb-4" />
                    <span className="font-bold text-center">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- STATE 2: GENERATING ---------------- */}
      {stage === 'generating' && (
        <div className="flex-1 flex flex-col justify-center items-center animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-full shadow-2xl border-4 border-primary-100 dark:border-primary-800">
              <Sparkles className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-2">Analyzing your profile...</h2>
          <p className="text-gray-500 dark:text-slate-300 animate-pulse">Our AI is forging your personalized career route.</p>
        </div>
      )}

      {/* ---------------- STATE 3: GAMIFIED ROADMAP ---------------- */}
      {stage === 'roadmap' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Dashboard */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl border border-gray-700 p-8 mb-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center text-primary-400 font-bold tracking-wider text-sm mb-2 uppercase">
                  <Star className="w-4 h-4 mr-2" /> Level 2 Explorer
                </div>
                <h1 className="text-3xl font-extrabold mb-2">Your Personal Career Map</h1>
                <p className="text-gray-400 dark:text-slate-300 max-w-lg">Follow these milestones to achieve your goal in {answers.interest === 'ai' ? 'Artificial Intelligence' : answers.interest === 'web' ? 'Web Development' : 'UI/UX Design'}.</p>
              </div>
              
              <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[200px] flex flex-col gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Overall Progress</span>
                    <span className="font-bold text-white">
                      {Math.round((roadmap.filter(n => n.status === 'completed').length / roadmap.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-primary-400 to-primary-600 h-2.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${(roadmap.filter(n => n.status === 'completed').length / roadmap.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setStage('onboarding');
                    setCurrentQuestionIdx(0);
                    setAnswers({ goal: null, interest: null, hobby: null, commitment: null });
                  }}
                  className="flex items-center justify-center text-sm font-semibold bg-white/10 dark:bg-slate-800/10 hover:bg-white/20 dark:bg-slate-800/20 transition-colors py-2 rounded-lg border border-white/20 text-white w-full"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>

          {/* The Timeline / Route */}
          <div className="relative max-w-4xl mx-auto py-10">
            {/* The central line */}
            <div className="absolute left-[39px] md:left-1/2 md:-ml-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-gray-200 to-gray-100 rounded-full"></div>

            <div className="space-y-12 relative">
              {roadmap.map((node, idx) => {
                const isEven = idx % 2 === 0;
                return (
                <div 
                  key={node.id} 
                  className={`relative flex items-center md:justify-between group ${node.status === 'locked' ? 'opacity-50' : 'cursor-pointer hover:-translate-y-1 transition-transform'} ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
                  onClick={() => node.status === 'active' && setSelectedNode(node)}
                >
                  
                  {/* Invisible spacer for desktop layout to push the card to one side */}
                  <div className="hidden md:block w-[45%]"></div>
                  
                  {/* Node Icon - Positioned exactly on the line */}
                  <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white transition-colors duration-500 ${node.color}`}>
                    {node.status === 'completed' ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : node.status === 'locked' ? (
                      <Lock className="w-8 h-8 text-gray-500 dark:text-slate-300" />
                    ) : (
                      <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full animate-ping"></div>
                    )}
                    
                    {/* Active Ping Effect */}
                    {node.status === 'active' && (
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${node.color}`}></div>
                    )}
                  </div>
                  
                  {/* Node Content Card */}
                  <div className={`w-[calc(100%-6rem)] ml-24 md:ml-0 md:w-[45%] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border p-6 transition-all relative ${
                    node.status === 'active' ? 'border-primary-300 shadow-md ring-2 ring-primary-50' : 'border-gray-100 dark:border-slate-700/50'
                  }`}>
                    {/* Little arrow pointing to the central line (desktop) */}
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-t border-r border-gray-100 dark:border-slate-700/50 transform ${isEven ? '-left-2 rotate-45 border-l-0 border-b-0' : '-right-2 rotate-45 border-t-0 border-r-0 border-l border-b'}`}></div>

                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        node.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        node.status === 'active' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300'
                      }`}>
                        {node.type}
                      </span>
                      {node.status === 'active' && <span className="flex items-center text-xs font-bold text-danger-500"><Zap className="w-3 h-3 mr-1" /> Action Required</span>}
                    </div>
                    
                    <h3 className={`text-xl font-bold ${node.status === 'locked' ? 'text-gray-400 dark:text-slate-300' : 'text-gray-900 dark:text-white'}`}>{node.title}</h3>
                    
                    {/* Show duration/short desc in card */}
                    {node.duration && (
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                         <span className="flex items-center text-xs font-bold text-gray-500 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                           <Clock className="w-3 h-3 mr-1" /> {node.duration}
                         </span>
                      </div>
                    )}

                    <p className={`text-sm mt-3 font-medium flex items-center ${node.status === 'completed' ? 'text-success-600 dark:text-success-400' : 'text-gray-500 dark:text-slate-300'}`}>
                      {node.status === 'completed' ? 'Completed successfully!' : `Target: ${node.deadline}`}
                    </p>
                  </div>
                </div>
              )})}
            </div>
            
            {/* End of Route */}
            <div className="mt-16 flex flex-col items-center opacity-50 relative z-10">
              <Award className="w-12 h-12 text-gray-300 mb-2" />
              <p className="font-bold text-gray-400 dark:text-slate-300 uppercase tracking-widest text-sm">Destination Reached</p>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Action Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedNode(null)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className={`p-6 sm:p-8 text-white ${selectedNode.color} relative`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/20 dark:bg-slate-800/20 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                {selectedNode.duration && (
                  <div className="bg-white/20 dark:bg-slate-800/20 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center text-sm font-bold border border-white/20">
                    <Clock className="w-4 h-4 mr-1.5" /> {selectedNode.duration}
                  </div>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{selectedNode.title}</h2>
              <p className="opacity-90 text-sm sm:text-base leading-relaxed">{selectedNode.description || "Ready to conquer this milestone and level up?"}</p>
            </div>
            
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
              {/* Learning Resources */}
              <h4 className="text-xs font-bold text-gray-400 dark:text-slate-300 uppercase tracking-wider mb-3">Suggested Resources</h4>
              <div className="flex flex-col gap-3 mb-6">
                {selectedNode.youtubeLink && (
                  <a href={selectedNode.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-slate-700/50 hover:border-red-200 hover:bg-red-50 group transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mr-3">
                        <PlaySquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">YouTube Tutorials</div>
                        <div className="text-xs text-gray-500 dark:text-slate-300">Search related videos</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-slate-300 group-hover:text-red-500" />
                  </a>
                )}
                
                {selectedNode.website && (
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedNode.website)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-slate-700/50 hover:border-blue-200 hover:bg-blue-50 group transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">Learn on {selectedNode.website}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-300">Find courses & articles</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-slate-300 group-hover:text-blue-500" />
                  </a>
                )}
              </div>

              {/* Hackathon Spotlight */}
              {selectedNode.hackathon && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-slate-300 uppercase tracking-wider mb-3">Apply Your Skills</h4>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-orange-900 mb-1">{selectedNode.hackathon}</div>
                      <p className="text-xs text-orange-700">Participate in this competition to build your resume and apply what you've learned.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                <Button variant="outline" className="flex-1 justify-center py-2.5" onClick={() => setSelectedNode(null)}>Maybe Later</Button>
                <Button variant="primary" className="flex-1 justify-center py-2.5 shadow-md" onClick={() => completeMilestone(selectedNode.id)}>Mark Completed</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoadmapPage;
