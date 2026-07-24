import { useState, useEffect } from 'react';
import { Search, Users, Calendar, MapPin, CheckCircle2, X, Star, ExternalLink, Activity, UsersRound } from 'lucide-react';
import Button from '../components/ui/Button';
import { useUserActivity } from '../context/UserActivityContext';

const CATEGORIES = ["All", "Technical", "Cultural", "Sports", "Social", "Departmental"];

const ClubsPage = () => {
  const [clubsData, setClubsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedClub, setSelectedClub] = useState(null); // For Details Modal
  const [activeJoinClub, setJoinClub] = useState(null); // Renamed to avoid collision with context action
  const [toast, setToast] = useState(null);
  const [joinReason, setJoinReason] = useState('');

  const { dbUserId, userName, userEmail, joinClub } = useUserActivity();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchClubs = async () => {
      try {
        const url = dbUserId 
          ? `http://localhost:5000/api/v1/clubs?userId=${dbUserId}`
          : `http://localhost:5000/api/v1/clubs`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          // Map backend fields to frontend expected fields
          setClubsData(data.data.map(club => ({
            ...club,
            tagline: club.description ? club.description.substring(0, 40) + '...' : '', 
            theme: "bg-primary-50 text-primary-600",
            members: club.members || 0, // Backend sends it as 'members'
            coreTeam: club.incharge_name ? [{ name: club.incharge_name, role: 'In-charge', contact: club.contact_details, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' }] : [],
            upcomingEvents: club.upcoming_event ? [{ name: club.upcoming_event, date: 'To Be Announced', location: 'Campus' }] : []
          })));
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClubs();
  }, [dbUserId]);

  // Filter Logic
  const filteredClubs = clubsData.filter(club => {
    const matchesCategory = activeTab === 'All' || club.category === activeTab;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleJoinSubmit = async () => {
    if (!dbUserId) {
      setToast('Please log in first to join a club.');
      setTimeout(() => setToast(null), 5000);
      return;
    }
    if (!joinReason.trim()) {
      setToast('Please let us know why you want to join this club.');
      setTimeout(() => setToast(null), 5000);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/v1/clubs/${activeJoinClub.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          student_name: userName || 'Student', 
          email: userEmail || 'student@campusone.edu', 
          reason: joinReason,
          userId: dbUserId
        })
      });
      const data = await res.json();
      if (data.success) {
        setClubsData(prev => prev.map(c => c.id === activeJoinClub.id ? { ...c, isMember: true, members: (c.members || 0) + 1 } : c));
        joinClub(activeJoinClub.id);
        setToast(`You have successfully registered for ${activeJoinClub.name}! The coordinator will reach out shortly.`);
      } else {
        setToast(data.message || 'Failed to join club.');
      }
    } catch (err) {
      console.error(err);
      setToast('Failed to join club.');
    }
    setJoinClub(null);
    setJoinReason('');
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative pb-10">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-top fade-in duration-300">
          <div className="bg-white border border-success-200 shadow-lg rounded-lg p-4 flex items-start space-x-3 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-800 leading-snug">{toast}</p>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
              <UsersRound className="w-8 h-8 mr-3 text-primary-600" />
              Clubs & Societies
            </h1>
            <p className="text-gray-500 mt-2 text-lg max-w-2xl">Find your community, develop new skills, and make lifelong connections outside the classroom.</p>
          </div>
          
          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search clubs..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === category 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No clubs found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
          <Button variant="outline" className="mt-6" onClick={() => {setSearchQuery(''); setActiveTab('All');}}>Reset Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClubs.map(club => (
            <div key={club.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              <div 
                className="h-48 relative overflow-hidden"
              >
                <img 
                  src={club.image} 
                  alt={club.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${club.theme}`}>
                    {club.category}
                  </span>
                  <div className="flex items-center text-white/90 text-sm font-medium bg-gray-900/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <Users className="w-4 h-4 mr-1.5" />
                    {club.members}
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{club.name}</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">{club.tagline}</p>
                
                <p className="text-sm text-gray-600 line-clamp-2 flex-1 mb-6">
                  {club.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button variant="outline" className="w-full justify-center" onClick={() => setSelectedClub(club)}>
                    View Details
                  </Button>
                  {club.isMember ? (
                    <Button variant="outline" className="w-full justify-center opacity-75" disabled>
                      Registered
                    </Button>
                  ) : (
                    <Button variant="primary" className="w-full justify-center" onClick={() => setJoinClub(club)}>
                      Join Club
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedClub(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header Image */}
            <div className="h-48 sm:h-64 relative flex-shrink-0">
              <img src={selectedClub.image} alt={selectedClub.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
              
              <button 
                onClick={() => setSelectedClub(null)} 
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${selectedClub.theme}`}>
                    {selectedClub.category}
                  </span>
                  <span className="bg-white/20 text-white backdrop-blur-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1" /> {selectedClub.members} Members
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">{selectedClub.name}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
              
              {/* About Section */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary-500" /> About Us
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">{selectedClub.description}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Core Team */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <UsersRound className="w-5 h-5 mr-2 text-primary-500" /> Core Team
                  </h3>
                  <div className="space-y-4">
                    {selectedClub.coreTeam.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div>
                          <p className="font-bold text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role} • {member.contact || 'No contact'}</p>
                        </div>
                      </div>
                    ))}

                  </div>
                </section>

                {/* Upcoming Events */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary-500" /> Upcoming Events
                  </h3>
                  <div className="space-y-4">
                    {selectedClub.upcomingEvents.map((event, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all group">
                        <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{event.name}</h4>
                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" /> {event.date}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" /> {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedClub(null)}>Close</Button>
              <Button variant="primary" className="flex-1" onClick={() => { setJoinClub(selectedClub); setSelectedClub(null); }}>
                Join this Club
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Club Modal */}
      {activeJoinClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary-900/20 backdrop-blur-[2px] transition-opacity" onClick={() => setJoinClub(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-50 border-4 border-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Join {activeJoinClub.name}</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                By joining this club, you will be added to their mailing list and invited to upcoming meetings. The core team will review your application.
              </p>
              
              <div className="space-y-4 mb-8 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Why do you want to join? *</label>
                  <textarea 
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24"
                    placeholder="Tell us about your interests..."
                    value={joinReason}
                    onChange={(e) => setJoinReason(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setJoinClub(null)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleJoinSubmit}>Submit Application</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClubsPage;
