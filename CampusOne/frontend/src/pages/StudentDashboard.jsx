import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Calendar, BookOpen, Clock, AlertCircle, ArrowRight, Sparkles, X, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useUserActivity } from '../context/UserActivityContext';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass = "bg-white border-gray-100", subtext }) => {
  const isSolidDanger = bgClass.includes('danger-500');
  return (
    <div className={`${bgClass} rounded-xl shadow-sm border ${isSolidDanger ? 'border-transparent' : ''} p-6 flex items-center group hover:shadow-md transition-shadow`}>
      <div className={`p-4 rounded-xl mr-5 ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className={`text-sm font-medium ${isSolidDanger ? 'text-danger-100' : 'text-gray-500'}`}>{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${isSolidDanger ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
        {subtext && <p className={`text-xs mt-1 font-medium ${isSolidDanger ? 'text-danger-200' : 'text-gray-400'}`}>{subtext}</p>}
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [userName, setUserName] = useState('');
  const [userUid, setUserUid] = useState(null);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    attendance: 0,
    aiTip: { title: "Loading...", desc: "Fetching latest insights...", isWarning: false },
    todaySchedule: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [showTimetable, setShowTimetable] = useState(false);
  const [showAITip, setShowAITip] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [isClosingPoster, setIsClosingPoster] = useState(false);

  const handleClosePoster = () => {
    setIsClosingPoster(true);
    setTimeout(() => {
      setShowPoster(false);
      setIsClosingPoster(false);
    }, 500); // match duration-500
  };
  
  const navigate = useNavigate();
  const { borrowedBooks, registeredEvents, joinedClubs, dbUserId, addCalendarEvent } = useUserActivity();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || 'Student');
        setUserUid(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const url = dbUserId ? `http://localhost:5000/api/v1/dashboard?userId=${dbUserId}` : 'http://localhost:5000/api/v1/dashboard';
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        }
        
        // Fetch announcements
        const annRes = await fetch('http://localhost:5000/api/v1/announcements');
        const annData = await annRes.json();
        if (annData.success) setAnnouncements(annData.data);
        
        // Fetch notifications
        if (dbUserId) {
          const notRes = await fetch(`http://localhost:5000/api/v1/notifications?userId=${dbUserId}`);
          const notData = await notRes.json();
          if (notData.success) setNotifications(notData.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [dbUserId]);

  const { attendance, attendanceStats, aiTip, todaySchedule } = dashboardData;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {userName} 👋</h1>
          <p className="text-gray-500 mt-1">Here is what's happening on campus today.</p>
        </div>
        
        {/* Highlighted Poster Button */}
        <button 
          onClick={() => setShowPoster(true)}
          className="group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5"
        >
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          Freshers' Welcome Party
        </button>
      </div>

      <div>
        {/* Quick AI Tip Banner */}
        <div className={`mt-4 border rounded-xl p-4 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 shadow-sm ${aiTip.isWarning ? 'bg-danger-50 border-danger-200' : 'bg-primary-50 border-primary-100'}`}>
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2 rounded-lg ${aiTip.isWarning ? 'bg-danger-100' : 'bg-primary-100'}`}>
              {aiTip.isWarning ? <AlertCircle className="w-5 h-5 text-danger-600" /> : <Sparkles className="w-5 h-5 text-primary-600" />}
            </div>
            <div>
              <h3 className={`font-bold text-sm ${aiTip.isWarning ? 'text-danger-900' : 'text-primary-900'}`}>{aiTip.isWarning ? 'AI Alert' : 'CampusOne AI Insight'}</h3>
              <p className={`text-sm mt-0.5 ${aiTip.isWarning ? 'text-danger-800' : 'text-primary-700'}`}>{aiTip.title}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAITip(true)}
            className={`font-semibold text-sm whitespace-nowrap bg-white px-4 py-2 rounded-lg border shadow-sm transition-colors ${aiTip.isWarning ? 'text-danger-600 hover:text-danger-700 border-danger-200' : 'text-primary-600 hover:text-primary-700 border-primary-100'}`}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Attendance" 
          value={`${attendance}%`} 
          icon={Calendar} 
          subtext={attendanceStats ? `${attendanceStats.attended}/${attendanceStats.total} Classes | ${attendanceStats.leaves} Leaves` : "Loading stats..."}
          colorClass={attendance < 75 ? "bg-white/20 text-white" : "bg-success-100 text-success-600"} 
          bgClass={attendance < 75 ? "bg-danger-500 border-transparent" : "bg-white border-gray-100"}
        />
        <StatCard 
          title="Upcoming Events" 
          value={registeredEvents.length} 
          icon={Clock} 
          colorClass="bg-warning-100 text-warning-600" 
        />
        <StatCard 
          title="Library Requests" 
          value={borrowedBooks.length} 
          icon={BookOpen} 
          colorClass="bg-secondary-100 text-secondary-600" 
        />
        <StatCard 
          title="Clubs Joined" 
          value={joinedClubs.length} 
          icon={Users} 
          colorClass="bg-danger-100 text-danger-600" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Schedule Section */}
          <div className="bg-white  rounded-xl shadow-sm border border-gray-100  p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 ">Today's Schedule</h2>
              <button 
                onClick={() => setShowTimetable(true)}
                className="text-primary-600  font-medium text-sm hover:text-primary-700 transition-colors"
              >
                View Full Timetable
              </button>
            </div>
            
            <div className="space-y-4">
              {todaySchedule.map((item, idx) => (
                <div key={idx} className="flex items-center p-4 border border-gray-100  rounded-xl hover:border-primary-100  hover:shadow-sm  transition-all group">
                  <div className="w-24 flex-shrink-0 text-sm font-bold text-gray-900 ">{item.time}</div>
                  <div className="flex-1 ml-4 border-l-2 border-primary-200  pl-4">
                    <h4 className="font-semibold text-gray-900  group-hover:text-primary-600  transition-colors">{item.course}</h4>
                    <p className="text-sm text-gray-500  mt-1">{item.type} • {item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Campus Announcements</h2>
            </div>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-gray-500 text-sm">No announcements at this time.</p>
              ) : (
                announcements.map((ann, idx) => (
                  <div key={idx} className="flex items-start p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                    <div className="p-2 rounded-lg bg-primary-50 text-primary-600 mr-4 mt-1">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{ann.content}</p>
                      <p className="text-xs text-gray-400 mt-2 font-medium">
                        {new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* Recommendations Section */}
          <div className="bg-white  rounded-xl shadow-sm border border-gray-100  p-6">
            <h2 className="text-lg font-bold text-gray-900  mb-6 flex items-center">
              <Sparkles className="w-5 h-5 text-secondary-500 mr-2" /> 
              Recommended for You
            </h2>
            
            <div className="space-y-4">
              <div 
                onClick={() => setShowRecommendation({ title: 'TechNova Hackathon', path: '/events', match: '98%', type: 'Event' })}
                className="group cursor-pointer p-4 bg-gray-50  rounded-xl border border-transparent hover:border-secondary-200  transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary-600  bg-secondary-100  px-2 py-1 rounded-md">Event</span>
                </div>
                <h4 className="font-bold text-gray-900  group-hover:text-secondary-600  transition-colors">TechNova Hackathon</h4>
                <p className="text-sm text-gray-500  mt-1 line-clamp-2">Based on your interest in Web Development, you might want to register for this upcoming event.</p>
                <div className="mt-3 flex items-center text-sm font-medium text-secondary-600 ">
                  View Details <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => setShowRecommendation({ title: 'Advanced ML Notes', path: '/library', match: '95%', type: 'Resource' })}
                className="group cursor-pointer p-4 bg-gray-50  rounded-xl border border-transparent hover:border-primary-200  transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600  bg-primary-100  px-2 py-1 rounded-md">Resource</span>
                </div>
                <h4 className="font-bold text-gray-900  group-hover:text-primary-600  transition-colors">Advanced ML Notes</h4>
                <p className="text-sm text-gray-500  mt-1 line-clamp-2">Your peers in semester 6 are highly rating this study material.</p>
                <div className="mt-3 flex items-center text-sm font-medium text-primary-600 ">
                  View Details <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      
      {/* AI Tip Modal */}
      {showAITip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary-900/20 backdrop-blur-[2px]" onClick={() => setShowAITip(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${aiTip.isWarning ? 'bg-danger-100' : 'bg-primary-100'}`}>
                {aiTip.isWarning ? <AlertCircle className="w-6 h-6 text-danger-600" /> : <Sparkles className="w-6 h-6 text-primary-600" />}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{aiTip.isWarning ? 'AI Alert' : 'AI Insight'}</h2>
              <button onClick={() => setShowAITip(false)} className="ml-auto p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6">
              <h3 className={`font-bold text-lg mb-2 ${aiTip.isWarning ? 'text-danger-700' : 'text-gray-900'}`}>{aiTip.title}</h3>
              <p className="text-gray-600 leading-relaxed">{aiTip.desc}</p>
              
              <div className="mt-6 bg-gray-50  p-4 rounded-lg border border-gray-100 ">
                <p className="text-sm font-medium text-gray-700  mb-3">Suggested Actions:</p>
                <div className="flex gap-3">
                  <Button size="small" onClick={() => {
                    // Add event to calendar context using current day
                    if (typeof addCalendarEvent === 'function') {
                      addCalendarEvent(new Date().getDate());
                    }
                    setShowAITip(false); 
                    // Optional: show a small toast or visual feedback
                    alert("Added to calendar!");
                  }}>Add to Calendar</Button>
                  <Button variant="outline" size="small" onClick={() => setShowAITip(false)}>Dismiss</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Modal */}
      {showTimetable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40  backdrop-blur-sm" onClick={() => setShowTimetable(false)}></div>
          <div className="bg-white  rounded-xl shadow-2xl max-w-2xl w-full relative z-10 animate-in zoom-in-95 duration-200 border border-gray-100 ">
            <div className="p-4 border-b border-gray-100  flex justify-between items-center bg-gray-50  rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900 ">Weekly Timetable</h2>
              <button onClick={() => setShowTimetable(false)} className="p-2 hover:bg-gray-200  rounded-full"><X className="w-5 h-5 text-gray-500 " /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-gray-500  uppercase tracking-wider mb-4 border-b border-gray-100  pb-2">
                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center h-64">
                {Array.from({ length: 15 }).map((_, i) => {
                  // Mix it up a little bit by adding some empty slots
                  if (i === 3 || i === 7 || i === 11) {
                     return <div key={i} className="bg-gray-50  rounded-lg p-2 border border-gray-100  flex items-center justify-center text-xs font-medium text-gray-400 ">Free</div>
                  }
                  if (!todaySchedule || todaySchedule.length === 0) return null;
                  
                  const cls = todaySchedule[i % todaySchedule.length];
                  const typeStyles = {
                    'Lab': 'bg-primary-50  text-primary-700  border-primary-100 ',
                    'Lecture': 'bg-secondary-50  text-secondary-700  border-secondary-100 ',
                    'Seminar': 'bg-success-50  text-success-700  border-success-100 '
                  };
                  return (
                    <div key={i} className={`rounded-lg p-2 border flex flex-col items-center justify-center text-[10px] sm:text-xs font-medium ${typeStyles[cls.type] || 'bg-gray-50  border-gray-100  text-gray-700 '}`}>
                      <span className="font-bold block mb-1 leading-tight">{cls.course}</span>
                      <span className="opacity-80">{cls.room}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Modal */}
      {showRecommendation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-secondary-900/20  backdrop-blur-[2px]" onClick={() => setShowRecommendation(false)}></div>
          <div className="bg-white  rounded-xl shadow-2xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200 text-center p-8 border border-gray-100 ">
            <div className="w-16 h-16 bg-secondary-100  text-secondary-600  rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900  mb-2">{showRecommendation.title}</h2>
            <p className="text-gray-600  mb-6">Our AI determines this is a {showRecommendation.match} match for your current skill progression and academic track.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => {
                setShowRecommendation(null);
                navigate(showRecommendation.path);
              }}>Explore Now</Button>
              <Button variant="outline" onClick={() => setShowRecommendation(null)}>Maybe Later</Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Poster Modal */}
      {showPoster && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm ${isClosingPoster ? 'animate-out fade-out duration-500' : 'animate-in fade-in duration-500'}`}>
          
          {/* Sparkles Background */}
          {!isClosingPoster && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <Sparkles className="absolute top-1/4 left-1/4 w-12 h-12 text-yellow-300 animate-sparkle opacity-80" />
              <Sparkles className="absolute bottom-1/4 right-1/4 w-16 h-16 text-pink-400 animate-sparkle-delayed opacity-80" />
              <Sparkles className="absolute top-1/3 right-1/3 w-8 h-8 text-blue-400 animate-sparkle opacity-60" />
              <Sparkles className="absolute bottom-1/3 left-1/3 w-10 h-10 text-purple-400 animate-sparkle-delayed opacity-70" />
              <Sparkles className="absolute top-10 right-20 w-14 h-14 text-yellow-400 animate-sparkle opacity-90" />
              <Sparkles className="absolute bottom-10 left-20 w-12 h-12 text-secondary-300 animate-sparkle-delayed opacity-90" />
            </div>
          )}

          <button 
            onClick={handleClosePoster} 
            className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black/80 rounded-full transition-colors z-50 group"
          >
            <X className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <div className={`relative ${isClosingPoster ? 'animate-out zoom-out-95 duration-500' : 'animate-burst'}`}>
            <img 
              src="/freshers-poster.jpg" 
              alt="Freshers Welcome Party" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_50px_rgba(236,72,153,0.5)] border border-white/20"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
