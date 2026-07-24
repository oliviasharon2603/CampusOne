import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, X, BookOpen, Calendar, Building2, User } from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useUserActivity } from '../../context/UserActivityContext';

const TopNav = ({ toggleMobileMenu }) => {
  const [userName, setUserName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { registeredEvents, joinedClubs, calendarEvents = [] } = useUserActivity();

  // Calendar Logic
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  // Mock highlights based on context data
  const eventDays = registeredEvents.length > 0 ? [15, 22] : [];
  const clubDays = joinedClubs.length > 0 ? [10, 28] : [];
  const aiEventDays = calendarEvents; // Dates added from AI Insights
  const missedAttendance = [5, 12]; // Simulated missed attendance days

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || 'Student');
      }
    });
    
    // Close search dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const SEARCH_LINKS = [
    { title: 'Smart Library', path: '/library', icon: BookOpen },
    { title: 'College Events', path: '/events', icon: Calendar },
    { title: 'Academic Departments', path: '/departments', icon: Building2 }
  ];

  const filteredSearch = SEARCH_LINKS.filter(link => link.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchClick = (path) => {
    navigate(path);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white  border-b border-gray-200  h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center flex-1">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden mr-4 text-gray-500 hover:text-gray-900  "
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="max-w-md w-full hidden sm:block relative" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200  rounded-lg leading-5 bg-gray-50  placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:bg-white  focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors text-gray-900 "
              placeholder="Search campus resources..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
            />
          </div>
          
          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white  rounded-xl shadow-xl border border-gray-100  py-2 z-50 animate-in fade-in slide-in-from-top-2">
              {filteredSearch.length > 0 ? (
                filteredSearch.map(link => {
                  const Icon = link.icon;
                  return (
                    <button 
                      key={link.path}
                      onClick={() => handleSearchClick(link.path)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50  flex items-center gap-3 transition-colors group"
                    >
                      <div className="p-2 bg-gray-100  rounded-lg group-hover:bg-primary-50  group-hover:text-primary-600  transition-colors">
                        <Icon className="w-4 h-4 text-gray-500  group-hover:text-primary-600 " />
                      </div>
                      <span className="text-sm font-medium text-gray-900 ">{link.title}</span>
                    </button>
                  )
                })
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500 ">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors" onClick={() => setShowCalendar(true)}>
          <Calendar className="w-6 h-6" />
        </button>
        <button className="relative p-2 text-gray-400 hover:text-gray-500  focus:outline-none transition-colors" onClick={() => setShowNotifications(true)}>
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white "></span>
          <Bell className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3 border-l border-gray-200  pl-4 transition-colors">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 ">
              {userName}
            </span>
            <span className="text-xs text-gray-500 ">
              {auth.currentUser?.email || 'student@campusone.edu'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200 text-primary-700 font-bold text-sm">
            {getInitials(userName)}
          </div>
        </div>
      </div>

      {/* Notifications Slide-Out Panel */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 animate-in fade-in" onClick={() => setShowNotifications(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white  shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col border-l border-gray-200 ">
            <div className="p-4 border-b border-gray-100  flex items-center justify-between bg-gray-50 ">
              <h2 className="text-lg font-bold text-gray-900  flex items-center">
                <Bell className="w-5 h-5 mr-2 text-primary-600" /> Notifications
              </h2>
              <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-primary-50  border border-primary-100  p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-primary-900  text-sm">Library Due Date</h4>
                  <span className="text-[10px] text-primary-600  font-medium">Just now</span>
                </div>
                <p className="text-sm text-primary-700  mt-1">Your borrowed book "Introduction to Algorithms" is due tomorrow.</p>
              </div>
              
              <div className="bg-secondary-50  border border-secondary-100  p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-secondary-900  text-sm">Event Registration</h4>
                  <span className="text-[10px] text-secondary-600  font-medium">2 hours ago</span>
                </div>
                <p className="text-sm text-secondary-700  mt-1">Your ticket for the Web3 Hackathon has been confirmed.</p>
              </div>

              <div className="bg-white  border border-gray-200  p-4 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900  text-sm">New Syllabus Upload</h4>
                  <span className="text-[10px] text-gray-500  font-medium">Yesterday</span>
                </div>
                <p className="text-sm text-gray-600  mt-1">The Department of AI&DS has uploaded a new syllabus revision.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Personal Calendar Slide-Out Panel */}
      {showCalendar && (
        <>
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 animate-in fade-in" onClick={() => setShowCalendar(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col border-l border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" /> Personal Calendar
              </h2>
              <button onClick={() => setShowCalendar(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">{currentMonth} {currentYear}</h3>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {blanks.map(b => <div key={`blank-${b}`} className="p-2"></div>)}
                {days.map(day => {
                  const isEvent = eventDays.includes(day);
                  const isClub = clubDays.includes(day);
                  const isMissed = missedAttendance.includes(day);
                  const isToday = day === today.getDate();
                  const isAiEvent = aiEventDays.includes(day);
                  
                  let bgClass = "bg-white hover:bg-gray-50 text-gray-700";
                  if (isAiEvent) bgClass = "bg-indigo-100 text-indigo-700 font-bold border border-indigo-300";
                  else if (isToday) bgClass = "bg-primary-50 text-primary-700 font-bold border border-primary-200";
                  else if (isMissed) bgClass = "bg-danger-50 text-danger-700 font-bold border border-danger-200";
                  else if (isEvent) bgClass = "bg-secondary-50 text-secondary-700 font-bold border border-secondary-200";
                  else if (isClub) bgClass = "bg-warning-50 text-warning-700 font-bold border border-warning-200";

                  return (
                    <div key={day} className={`p-2 rounded-lg text-sm cursor-pointer transition-colors ${bgClass}`}>
                      {day}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">Legend & Upcoming</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-danger-500 mt-1"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Missed Attendance</p>
                      <p className="text-xs text-gray-500 mt-0.5">You missed classes on the {missedAttendance.join('th, ')}th. Critical alert active.</p>
                    </div>
                  </div>
                  {eventDays.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-secondary-500 mt-1"></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Upcoming Event</p>
                        <p className="text-xs text-gray-500 mt-0.5">Hackathon registration due</p>
                      </div>
                    </div>
                  )}
                  {aiEventDays.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1"></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">AI Insight</p>
                        <p className="text-xs text-gray-500 mt-0.5">Added from dashboard recommendation</p>
                      </div>
                    </div>
                  )}
                  {clubDays.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-warning-500 mt-1"></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Club Activities</p>
                        <p className="text-xs text-gray-500 mt-0.5">Meetings for joined clubs scheduled on {clubDays.join('th, ')}th.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default TopNav;
