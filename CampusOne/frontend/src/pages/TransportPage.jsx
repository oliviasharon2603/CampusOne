import { useState, useEffect } from 'react';
import { BusFront, Map, CreditCard, MapPin, Clock, Navigation, CheckCircle2, QrCode, Phone, AlertCircle, X, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useUserActivity } from '../context/UserActivityContext';

const TransportPage = () => {
  const [routesData, setRoutesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('routes');
  
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [trackingRoute, setTrackingRoute] = useState(null);
  
  const { transportPass, applyForPass } = useUserActivity();
  const [passForm, setPassForm] = useState({ routeId: null, term: 'Annual' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/transport');
        const data = await res.json();
        if (data.success) {
          const formatted = data.data.map((r, index) => ({
            id: r.id,
            name: r.name,
            busNo: r.bus_no,
            driver: r.driver_name,
            contact: r.contact_number,
            departure: r.departure_time,
            arrival: r.arrival_time,
            status: index % 2 === 0 ? "On Time" : "Delayed",
            theme: index % 2 === 0 ? "bg-primary-50 text-primary-600 border-primary-200" : "bg-secondary-50 text-secondary-600 border-secondary-200",
            stops: [
              { name: r.name, time: r.departure_time },
              { name: "City Center", time: "07:50 AM" },
              { name: "Highway Bypass", time: "08:15 AM" },
              { name: "CampusOne Main Gate", time: r.arrival_time }
            ]
          }));
          setRoutesData(formatted);
          if (formatted.length > 0) {
            setTrackingRoute(formatted[0]);
            setPassForm({ routeId: formatted[0].id, term: 'Annual' });
          }
        }
      } catch (err) {
        console.error('Error fetching transport routes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  };

  const handleApplyPass = (e) => {
    e.preventDefault();
    const route = routesData.find(r => r.id === passForm.routeId);
    if (!route) {
      showToast("Please select a route.");
      return;
    }
    
    // Create pass payload
    const newPass = {
      id: `PASS-${Math.floor(Math.random() * 10000)}`,
      route: route.name,
      term: passForm.term,
      issuedDate: new Date().toLocaleDateString(),
      validUntil: passForm.term === 'Annual' ? 'May 2027' : 'Dec 2026',
      status: 'Active'
    };
    
    applyForPass(newPass);
    showToast(`Successfully generated ${passForm.term} pass for ${route.name} route.`);
  };

  const handleDownloadPDF = () => {
    const fileContent = `CampusOne Transport Pass\n\nPass ID: ${transportPass.id}\nStatus: Active\nDesignated Route: ${transportPass.route}\nValid Until: ${transportPass.validUntil}\n\nPlease show this digital pass when boarding the bus.`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CampusOne_Transport_Pass_${transportPass.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Pass details downloaded successfully!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative pb-10">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-top fade-in duration-300">
          <div className="bg-white border border-success-200 shadow-lg rounded-lg p-4 flex items-start space-x-3 max-w-sm">
            <CheckCircle2 className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-800">{toast}</p>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
            <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl mr-3 shadow-sm border border-primary-100">
              <BusFront className="w-7 h-7" />
            </div>
            Campus Transport
          </h1>
          <p className="text-gray-600 mt-3 text-lg font-medium">Manage your commute across Trichy city. View bus routes, track vehicles in real-time, and access your digital transport pass.</p>
        </div>
        <div className="w-full md:w-1/3 h-32 md:h-40 rounded-xl overflow-hidden shadow-md">
           <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80" alt="Transport" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit">
        {[
          { id: 'routes', label: 'Routes & Schedule', icon: MapPin },
          { id: 'pass', label: 'My Transport Pass', icon: CreditCard },
          { id: 'tracking', label: 'Live Tracking', icon: Navigation }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-white text-primary-600 shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-primary-500' : ''}`} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">

        {/* ROUTES & SCHEDULE TAB */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            {routesData.map(route => (
              <div key={route.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                <div className={`p-4 border-b ${route.theme}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                      {route.busNo}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm flex items-center ${
                      route.status === 'On Time' ? 'text-success-600' : 'text-warning-600'
                    }`}>
                      {route.status === 'On Time' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      {route.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mt-1 group-hover:underline underline-offset-2">{route.name} Route</h3>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400" /> Start</span>
                      <strong className="text-gray-900">{route.departure}</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" /> Campus</span>
                      <strong className="text-gray-900">{route.arrival}</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                      <span className="text-gray-500 flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400" /> Driver</span>
                      <strong className="text-gray-900">{route.driver}</strong>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full justify-center" onClick={() => setSelectedRoute(route)}>
                    View All Stops
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MY TRANSPORT PASS TAB */}
        {activeTab === 'pass' && (
          <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
            {transportPass ? (
              /* Digital Pass UI */
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700 relative text-white">
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className="flex items-center text-primary-400 mb-2">
                          <BusFront className="w-5 h-5 mr-2" />
                          <span className="font-bold tracking-widest uppercase text-sm">CampusOne Transport</span>
                        </div>
                        <h2 className="text-3xl font-extrabold">{transportPass.term} Pass</h2>
                      </div>
                      <div className="bg-white p-2 rounded-xl shadow-inner flex-shrink-0">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${transportPass.id}`} 
                          alt="Pass QR Code" 
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8 border-t border-white/10 pt-8">
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pass ID</p>
                        <p className="text-lg font-mono font-medium">{transportPass.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                        <p className="text-lg font-medium text-success-400 flex items-center">
                          <CheckCircle2 className="w-5 h-5 mr-1" /> Active
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Designated Route</p>
                        <p className="text-lg font-medium">{transportPass.route}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Valid Until</p>
                        <p className="text-lg font-medium">{transportPass.validUntil}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex justify-between items-center border border-white/10">
                      <span className="text-sm text-gray-300">Show this digital pass when boarding the bus.</span>
                      <Button variant="outline" size="small" className="text-white border-white/20 hover:bg-white/20" onClick={handleDownloadPDF}>
                        Download File
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Application Form UI */
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary-100 text-primary-600">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Apply for Transport Pass</h2>
                  <p className="text-gray-500 mt-2">Select your route and term to generate an instant digital bus pass.</p>
                </div>
                
                <form onSubmit={handleApplyPass} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Route (Trichy City)</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow"
                      value={passForm.routeId}
                      onChange={(e) => setPassForm({...passForm, routeId: Number(e.target.value)})}
                    >
                      {routesData.map(route => (
                        <option key={route.id} value={route.id}>{route.name} Route (via {route.stops[1].name})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Term</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Semester', 'Annual'].map(term => (
                        <div 
                          key={term}
                          onClick={() => setPassForm({...passForm, term})}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            passForm.term === term 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${passForm.term === term ? 'text-primary-700' : 'text-gray-700'}`}>{term}</span>
                            {passForm.term === term && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{term === 'Semester' ? 'Valid for 6 months' : 'Valid for 12 months'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <Button type="submit" variant="primary" className="w-full justify-center text-lg py-3">Generate Digital Pass</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* LIVE TRACKING TAB */}
        {activeTab === 'tracking' && trackingRoute && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="flex flex-col lg:flex-row h-[600px]">
              
              {/* Sidebar Info */}
              <div className="w-full lg:w-96 border-r border-gray-100 p-6 flex flex-col bg-gray-50/50">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-primary-600" /> Live Status
                </h3>
                
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Track Route</label>
                  <select 
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    value={trackingRoute.id}
                    onChange={(e) => setTrackingRoute(routesData.find(r => r.id === Number(e.target.value)))}
                  >
                    {routesData.map(route => (
                      <option key={route.id} value={route.id}>{route.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md text-xs font-bold border border-primary-100">
                      {trackingRoute.busNo}
                    </span>
                    <span className="text-success-600 text-xs font-bold flex items-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-success-500 mr-1.5"></div> Live
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{trackingRoute.name} Route</h4>
                  <p className="text-sm text-gray-500 mb-6">Currently nearing <strong className="text-gray-700">{trackingRoute.stops[2].name}</strong>.</p>
                  
                  <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-200 ml-2">
                    {trackingRoute.stops.map((stop, idx) => {
                      const isPassed = idx < 2;
                      const isCurrent = idx === 2;
                      const isFuture = idx > 2;
                      return (
                        <div key={idx} className={`relative flex items-center gap-4 text-sm z-10 pb-6 last:pb-0 ${isFuture ? 'opacity-50' : ''}`}>
                          <div className={`w-5 h-5 rounded-full border-4 border-white shadow flex-shrink-0 ${isPassed ? 'bg-success-500' : isCurrent ? 'bg-primary-500 animate-pulse' : 'bg-gray-300'}`}></div>
                          <div className={`flex-1 font-medium ${isPassed || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{stop.name}</div>
                          <div className="text-gray-500 font-mono text-xs">{stop.time}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Button variant="outline" className="w-full justify-center bg-white" icon={Phone} onClick={() => alert(`Calling driver ${trackingRoute.driver} at ${trackingRoute.contact}...`)}>
                  Contact Driver
                </Button>
              </div>

              {/* Accurate Map iframe */}
              <div className="flex-1 relative bg-gray-200 hidden sm:block overflow-hidden">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(trackingRoute.stops[0].name + " to CampusOne Tiruchirappalli")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full opacity-90 pointer-events-none"
                ></iframe>
                
                {/* SVG Route Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path 
                    d={trackingRoute.id === 1 ? "M 30 30 Q 40 50 70 80" :
                       trackingRoute.id === 2 ? "M 70 30 Q 60 60 70 80" :
                       trackingRoute.id === 3 ? "M 50 30 Q 55 50 70 80" :
                       "M 30 60 Q 50 70 70 80"} 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="1.5" 
                    strokeDasharray="2 2"
                    className="opacity-90 drop-shadow-md"
                  />
                  {/* Start Point */}
                  <circle cx={trackingRoute.id === 1 ? 30 : trackingRoute.id === 2 ? 70 : trackingRoute.id === 3 ? 50 : 30} 
                          cy={trackingRoute.id === 1 ? 30 : trackingRoute.id === 2 ? 30 : trackingRoute.id === 3 ? 30 : 60} 
                          r="1.5" fill="#ef4444" className="drop-shadow-sm" />
                  {/* End Point (Campus) */}
                  <circle cx="70" cy="80" r="2" fill="#22c55e" className="drop-shadow-sm" />
                </svg>

                {/* Mock GPS Marker Overlay on the path */}
                <div className="absolute pointer-events-none transition-all duration-1000" style={{
                  left: trackingRoute.id === 1 ? '45%' : trackingRoute.id === 2 ? '65%' : trackingRoute.id === 3 ? '55%' : '45%',
                  top: trackingRoute.id === 1 ? '45%' : trackingRoute.id === 2 ? '55%' : trackingRoute.id === 3 ? '45%' : '65%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg mb-2 flex items-center">
                      <BusFront className="w-3 h-3 mr-1.5 text-primary-400" />
                      {trackingRoute.busNo}
                    </div>
                    <div className="w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                    <div className="w-8 h-2 bg-black/20 blur-sm rounded-full mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Stops Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedRoute(null)}></div>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200">
            <div className={`p-5 border-b rounded-t-2xl flex justify-between items-center ${selectedRoute.theme}`}>
              <div>
                <h3 className="font-bold text-lg">{selectedRoute.name} Route</h3>
                <p className="text-xs font-medium opacity-80">{selectedRoute.busNo}</p>
              </div>
              <button onClick={() => setSelectedRoute(null)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Boarding Points & Timings</h4>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-200">
                {selectedRoute.stops.map((stop, idx) => (
                  <div key={idx} className="relative flex items-center gap-4 text-sm z-10 pb-6 last:pb-0">
                    <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm flex-shrink-0 ${
                      idx === 0 ? 'bg-primary-500' : idx === selectedRoute.stops.length - 1 ? 'bg-success-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className={`font-bold ${idx === selectedRoute.stops.length - 1 ? 'text-success-700' : 'text-gray-900'}`}>
                        {stop.name}
                      </p>
                    </div>
                    <div className="text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded text-xs border border-gray-100 shadow-sm">
                      {stop.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <Button variant="outline" className="w-full justify-center" onClick={() => setSelectedRoute(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TransportPage;
