import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Ticket, CheckCircle2, Clock, Sparkles, Filter, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { useUserActivity } from '../context/UserActivityContext';

// Mock Data
const targetDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10); // 10 days from now
const endDate = new Date(targetDate.getTime() + 1000 * 60 * 60 * 24 * 2);
const dateStr = `${targetDate.toLocaleString('en-US', {month: 'short', day: 'numeric'})} - ${endDate.toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;

const HERO_EVENT = {
  id: 101,
  title: "TechNova 2026: Annual Tech Fest",
  date: dateStr,
  venue: "Main Auditorium",
  description: "Join the biggest technology festival of the year. Featuring 24-hour hackathons, robotics competitions, and keynote speakers from top tech giants.",
  category: "Technical",
  targetDate: targetDate
};

const CATEGORIES = ["All", "Technical", "Cultural", "Sports", "Academic", "Hackathons", "Placement"];

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeCategory, setActiveCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroRegistered, setHeroRegistered] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', dept: '', year: '', phone: '', reason: '' });
  const [toast, setToast] = useState(null);
  
  const { registerEvent, dbUserId, userName } = useUserActivity();
  
  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch events from real backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = dbUserId ? `http://localhost:5000/api/v1/events?userId=${dbUserId}` : 'http://localhost:5000/api/v1/events';
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [dbUserId]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = HERO_EVENT.targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleRegisterClick = (event) => {
    if (!dbUserId) {
      showToast('Please log in first to register.');
      return;
    }
    setSelectedEvent(event);
    setShowConfirmModal(true);
  };


  const confirmRegistration = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dept || !formData.year || !formData.phone || !formData.reason) {
      showToast('Please fill out all compulsory fields.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/v1/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEvent.id, userId: dbUserId, name: formData.name, formData })
      });
      const result = await response.json();
      
      if (result.success) {
        setEvents(prev => 
          prev.map(ev => ev.id === selectedEvent.id ? { ...ev, registered: true, seats: ev.seats > 0 ? ev.seats - 1 : 0 } : ev)
        );
        registerEvent(selectedEvent.id);
        showToast(`Successfully registered for ${selectedEvent.title}. Check your notifications for the ticket.`);
      } else {
        showToast(result.message || 'Failed to register for the event.');
      }
    } catch (error) {
      showToast('Network error while processing registration.');
    }
    
    setShowConfirmModal(false);
    setSelectedEvent(null);
    setFormData({ name: '', dept: '', year: '', phone: '', reason: '' });
  };

  const handleViewHackathon = () => {
    setActiveTab('upcoming');
    setActiveCategory('Hackathons');
    setTimeout(() => {
      document.getElementById('events-grid').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleViewGallery = (title) => {
    showToast(`The photo gallery for ${title} is being processed and will be available soon!`);
  };

  const filteredEvents = events.filter(e => {
    const matchesTab = e.type === activeTab;
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
    return matchesTab && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative pb-10">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-top fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 border border-accent-200 shadow-lg rounded-lg p-4 flex items-start space-x-3 max-w-sm">
            <CheckCircle2 className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{toast}</p>
            <button onClick={() => setToast(null)} className="text-gray-400 dark:text-slate-300 hover:text-gray-600 dark:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          College Events
        </h1>
        <p className="text-gray-500 dark:text-slate-300 mt-1">Discover and register for institution-wide events and activities.</p>
      </div>

      {/* Hero Banner (Upcoming Major Event) */}
      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/80 z-10"></div>
        {/* Placeholder for Poster Image */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        
        <div className="relative z-20 p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-3 py-1 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
              Upcoming Major Event
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{HERO_EVENT.title}</h2>
            <p className="text-gray-200 text-lg mb-6 leading-relaxed">{HERO_EVENT.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm">
              <div className="flex items-center bg-white/10 dark:bg-slate-800/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Calendar className="w-4 h-4 mr-2" /> {HERO_EVENT.date}
              </div>
              <div className="flex items-center bg-white/10 dark:bg-slate-800/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <MapPin className="w-4 h-4 mr-2" /> {HERO_EVENT.venue}
              </div>
            </div>

            <Button 
              size="large" 
              className="bg-accent-500 text-white hover:bg-accent-600 border-none shadow-lg shadow-accent-500/30"
              disabled={heroRegistered}
              onClick={() => handleRegisterClick(HERO_EVENT)}
            >
              {heroRegistered ? 'Ticket Secured' : 'Register Now'}
            </Button>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white min-w-[280px]">
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-widest mb-4 text-center">Registration Closes In</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-3xl font-bold tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-xs text-gray-400 dark:text-slate-300 mt-1">Days</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs text-gray-400 dark:text-slate-300 mt-1">Hours</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs text-gray-400 dark:text-slate-300 mt-1">Mins</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs text-gray-400 dark:text-slate-300 mt-1">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-secondary-50 to-white border border-secondary-100 rounded-xl p-5 shadow-sm flex items-start space-x-4">
        <div className="p-3 bg-secondary-100 text-secondary-600 rounded-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Recommended for You</h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">Because you are in <span className="font-semibold text-secondary-700">AI&DS</span>, CampusOne AI suggests checking out the <strong>Web3 Builders Hackathon</strong> to boost your portfolio.</p>
          <Button variant="outline" size="small" className="mt-3" onClick={handleViewHackathon}>View Hackathon</Button>
        </div>
      </div>

      {/* Event Tabs & Filters */}
      <div id="events-grid" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
          {['current', 'upcoming', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 dark:text-slate-300 mr-2 flex-shrink-0" />
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                activeCategory === category
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:bg-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-xl shadow-sm">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No events found.</h3>
            <p className="text-gray-500 dark:text-slate-300 mt-1">There are no {activeTab} events matching your selected category.</p>
            <Button variant="outline" className="mt-4" onClick={() => setActiveCategory('All')}>Clear Filters</Button>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden hover:shadow-md transition-all group flex flex-col">
              {/* Event Poster */}
              <div 
                className="h-48 relative overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-slate-700"
                style={{ 
                  backgroundImage: `url(${event.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/20 transition-colors"></div>
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold text-gray-800 dark:text-slate-200">
                  {event.category}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 mb-3 group-hover:text-primary-600 dark:text-primary-400 transition-colors">{event.title}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-slate-300">
                    <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-slate-300" />
                    {event.date} • {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-slate-300">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-slate-300" />
                    {event.venue}
                  </div>
                  {event.type !== 'completed' && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-300">
                      <Users className="w-4 h-4 mr-2 text-gray-400 dark:text-slate-300" />
                      {event.seats > 0 ? (
                        <span><strong className="text-gray-900 dark:text-white">{event.seats}</strong> seats remaining</span>
                      ) : (
                        <span className="text-danger-500 font-medium">House Full</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700/50 flex gap-3">
                  {event.type !== 'completed' ? (
                    <Button 
                      variant={event.registered ? "outline" : "primary"}
                      className="flex-1"
                      disabled={event.registered || event.seats === 0}
                      onClick={() => handleRegisterClick(event)}
                      icon={event.registered ? CheckCircle2 : Ticket}
                    >
                      {event.registered ? 'Registered' : (event.seats === 0 ? 'Closed' : 'Register')}
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1" onClick={() => handleViewGallery(event.title)}>View Gallery</Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Registration Form Modal */}
      {showConfirmModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary-900/10 backdrop-blur-[2px] transition-opacity" onClick={() => setShowConfirmModal(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Register for Event</h3>
                <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 dark:text-slate-300 hover:text-gray-600 dark:text-slate-300"><X className="w-5 h-5"/></button>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-300 mb-6">
                You are registering for <strong>{selectedEvent.title}</strong>. Please fill out the compulsory details below.
              </p>
              
              <form onSubmit={confirmRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input type="text" required className="w-full border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Department *</label>
                    <input type="text" required className="w-full border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Year *</label>
                    <input type="text" required className="w-full border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input type="tel" required className="w-full border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Why do you want to join? *</label>
                  <textarea required rows="3" className="w-full border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" type="button" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                  <Button variant="primary" className="flex-1" type="submit">Submit Registration</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventsPage;
