import { useState, useEffect } from 'react';
import { Sparkles, Target, Code, Briefcase, GraduationCap, Compass, CheckCircle2, ChevronRight, Zap, Award, Star, Lock, BookOpen } from 'lucide-react';
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
      { id: 'ai', label: "Artificial Intelligence", icon: Sparkles, color: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100" },
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
      { id: 'intense', label: "10+ Hours", icon: Sparkles, color: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100" }
    ]
  }
];

// Mock AI Logic to generate roadmaps based on interest
const generateRoadmapData = (interest) => {
  if (interest === 'ai') {
    return [
      { id: 1, title: "Master Python Basics", deadline: "Before Sep 30", status: 'completed', type: 'learn', color: 'bg-emerald-500' },
      { id: 2, title: "Complete Andrew Ng ML Course", deadline: "Before Oct 15", status: 'active', type: 'course', color: 'bg-indigo-500' },
      { id: 3, title: "Build a Neural Network from Scratch", deadline: "Before Nov 01", status: 'locked', type: 'project', color: 'bg-gray-300' },
      { id: 4, title: "Participate in Kaggle Competition", deadline: "Before Dec 20", status: 'locked', type: 'event', color: 'bg-gray-300' },
      { id: 5, title: "Secure AI Research Internship", deadline: "Before May 2027", status: 'locked', type: 'milestone', color: 'bg-gray-300' },
    ];
  } else if (interest === 'web') {
    return [
      { id: 1, title: "HTML, CSS & JS Mastery", deadline: "Before Sep 30", status: 'completed', type: 'learn', color: 'bg-emerald-500' },
      { id: 2, title: "Build 3 Frontend Projects", deadline: "Before Oct 15", status: 'active', type: 'project', color: 'bg-blue-500' },
      { id: 3, title: "Learn React & Tailwind", deadline: "Before Nov 01", status: 'locked', type: 'learn', color: 'bg-gray-300' },
      { id: 4, title: "Win TechNova Hackathon", deadline: "Before Dec 10", status: 'locked', type: 'event', color: 'bg-gray-300' },
      { id: 5, title: "Full-Stack Dev Internship", deadline: "Before May 2027", status: 'locked', type: 'milestone', color: 'bg-gray-300' },
    ];
  } else {
    return [
      { id: 1, title: "Learn Figma Fundamentals", deadline: "Before Sep 30", status: 'completed', type: 'learn', color: 'bg-emerald-500' },
      { id: 2, title: "Complete 100 Days of UI", deadline: "Before Oct 30", status: 'active', type: 'project', color: 'bg-pink-500' },
      { id: 3, title: "Build Portfolio Website", deadline: "Before Nov 15", status: 'locked', type: 'project', color: 'bg-gray-300' },
      { id: 4, title: "Attend DesignX Conference", deadline: "Before Dec 05", status: 'locked', type: 'event', color: 'bg-gray-300' },
      { id: 5, title: "Product Design Internship", deadline: "Before May 2027", status: 'locked', type: 'milestone', color: 'bg-gray-300' },
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4 animate-bounce shadow-sm">
              <Compass className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Let's build your path.</h1>
            <p className="text-gray-500 mt-2 text-lg">Answer a few questions to generate your personalized AI roadmap.</p>
          </div>

          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
            
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
            <div className="w-full bg-gray-100 h-1.5">
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
            <div className="relative bg-white p-6 rounded-full shadow-2xl border-4 border-primary-100">
              <Sparkles className="w-12 h-12 text-primary-600 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-2">Analyzing your profile...</h2>
          <p className="text-gray-500 animate-pulse">Our AI is forging your personalized career route.</p>
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
                <p className="text-gray-400 max-w-lg">Follow these milestones to achieve your goal in {answers.interest === 'ai' ? 'Artificial Intelligence' : answers.interest === 'web' ? 'Web Development' : 'UI/UX Design'}.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[200px] flex flex-col gap-4">
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
                  className="flex items-center justify-center text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg border border-white/20 text-white w-full"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>

          {/* The Timeline / Route */}
          <div className="relative max-w-2xl mx-auto py-10">
            {/* The actual line connecting nodes */}
            <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-gray-200 to-gray-100 rounded-full"></div>

            <div className="space-y-12">
              {roadmap.map((node, idx) => (
                <div 
                  key={node.id} 
                  className={`relative flex items-start gap-8 group ${node.status === 'locked' ? 'opacity-50' : 'cursor-pointer hover:-translate-y-1 transition-transform'}`}
                  onClick={() => node.status === 'active' && setSelectedNode(node)}
                >
                  
                  {/* Node Icon */}
                  <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white transition-colors duration-500 ${node.color}`}>
                    {node.status === 'completed' ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : node.status === 'locked' ? (
                      <Lock className="w-8 h-8 text-gray-500" />
                    ) : (
                      <div className="w-6 h-6 bg-white rounded-full animate-ping"></div>
                    )}
                    
                    {/* Active Ping Effect */}
                    {node.status === 'active' && (
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${node.color}`}></div>
                    )}
                  </div>
                  
                  {/* Node Content Card */}
                  <div className={`flex-1 bg-white rounded-2xl shadow-sm border p-6 transition-all ${
                    node.status === 'active' ? 'border-primary-300 shadow-md ring-2 ring-primary-50' : 'border-gray-100'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        node.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        node.status === 'active' ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {node.type}
                      </span>
                      {node.status === 'active' && <span className="flex items-center text-xs font-bold text-danger-500"><Zap className="w-3 h-3 mr-1" /> Action Required</span>}
                    </div>
                    
                    <h3 className={`text-xl font-bold ${node.status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>{node.title}</h3>
                    <p className={`text-sm mt-2 font-medium flex items-center ${node.status === 'completed' ? 'text-success-600' : 'text-gray-500'}`}>
                      {node.status === 'completed' ? 'Completed successfully!' : `Target: ${node.deadline}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* End of Route */}
            <div className="mt-16 flex flex-col items-center opacity-50">
              <Award className="w-12 h-12 text-gray-300 mb-2" />
              <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Destination Reached</p>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Action Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedNode(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className={`p-8 text-white ${selectedNode.color}`}>
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedNode.title}</h2>
              <p className="opacity-90">Ready to conquer this milestone and level up?</p>
            </div>
            
            <div className="p-8">
              <h4 className="font-bold text-gray-900 mb-4">Required Tasks</h4>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600"><div className="w-2 h-2 rounded-full bg-gray-300 mr-3"></div> Review prerequisite materials</li>
                <li className="flex items-center text-gray-600"><div className="w-2 h-2 rounded-full bg-gray-300 mr-3"></div> Complete the practical assignment</li>
                <li className="flex items-center text-gray-600"><div className="w-2 h-2 rounded-full bg-gray-300 mr-3"></div> Submit documentation online</li>
              </ul>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 justify-center" onClick={() => setSelectedNode(null)}>Not Yet</Button>
                <Button variant="primary" className="flex-1 justify-center" onClick={() => completeMilestone(selectedNode.id)}>Mark Completed</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoadmapPage;
