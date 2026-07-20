import { useState, useRef } from 'react';
import { AlertCircle, Image as ImageIcon, Send, MessageSquare, Clock, Camera, X, Building, Laptop, Home, Coffee, CheckCircle2, ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';

// Mock Data for the Feed
const INITIAL_COMPLAINTS = [
  {
    id: 1,
    category: 'Infrastructure',
    status: 'IN PROGRESS', // PENDING, IN PROGRESS, RESOLVED
    author: { name: 'Karthik R.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80' },
    timestamp: 'Yesterday at 2:30 PM',
    location: 'Lab 4, CSE Block',
    description: 'The air conditioning unit in Lab 4 has been leaking water since yesterday morning. It is creating a puddle near the server racks, which is a major safety hazard.',
    image: 'https://images.unsplash.com/photo-1527066236129-cbaf7e20f4c0?auto=format&fit=crop&w=600&q=80', // Water puddle
    replies: [
      { id: 101, author: 'Campus Maintenance Admin', isAdmin: true, avatar: 'https://ui-avatars.com/api/?name=Maintenance&background=eab308&color=fff', text: 'Thank you for reporting this. A technician has been dispatched and is currently working on fixing the leak. Status updated to In Progress.', timestamp: 'Today at 9:00 AM' }
    ]
  },
  {
    id: 2,
    category: 'Hostel',
    status: 'PENDING',
    author: { name: 'Sneha Reddy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
    timestamp: '5 hours ago',
    location: 'Girls Hostel A, 3rd Floor',
    description: 'The Wi-Fi router on the 3rd floor has been completely dead for the last two days. We have online assignments due this weekend, please fix this urgently.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', // Router
    replies: []
  },
  {
    id: 3,
    category: 'Cafeteria',
    status: 'RESOLVED',
    author: { name: 'Rahul Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    timestamp: 'Last Week',
    location: 'Main Cafeteria',
    description: 'The water purifier near the entrance is dispensing murky water. It seems the filters haven\'t been changed in a long time.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4c?auto=format&fit=crop&w=600&q=80', // Water cooler
    replies: [
      { 
        id: 103, 
        author: 'Cafeteria Management', 
        isAdmin: true, 
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=22c55e&color=fff', 
        text: 'The filters have been completely replaced and the machine was serviced this morning. Safe drinking water is now restored. Marking as Resolved.', 
        image: 'https://images.unsplash.com/photo-1550508126-c737976e1f0e?auto=format&fit=crop&q=80&w=400', // Clean water / filter
        timestamp: '3 days ago' 
      },
      { 
        id: 104, 
        author: 'Rahul Sharma', 
        isAdmin: false, 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', 
        text: 'Confirmed, the water is clean now. Thank you!', 
        timestamp: '2 days ago' 
      }
    ]
  }
];

const CATEGORIES = [
  { id: 'Infrastructure', icon: Building },
  { id: 'Academic', icon: Laptop },
  { id: 'Hostel', icon: Home },
  { id: 'Cafeteria', icon: Coffee }
];

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  
  // Composer State
  const [category, setCategory] = useState('Infrastructure');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Reply State
  const [replyingTo, setReplyingTo] = useState(null); // Complaint ID
  const [replyText, setReplyText] = useState('');

  // Handle local image upload via file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    const newComplaint = {
      id: Date.now(),
      category: category,
      status: 'PENDING',
      author: { name: 'You (Current User)', avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff' },
      timestamp: 'Just now',
      location: location,
      description: description,
      image: previewUrl, 
      replies: []
    };

    setComplaints([newComplaint, ...complaints]);
    
    // Reset form
    setDescription('');
    setLocation('');
    clearImage();
  };

  const handleReplySubmit = (complaintId) => {
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Date.now(),
      author: 'You (Current User)',
      isAdmin: false,
      avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff',
      text: replyText,
      timestamp: 'Just now'
    };

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return { ...c, replies: [...c.replies, newReply] };
      }
      return c;
    }));

    setReplyingTo(null);
    setReplyText('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-danger-50 text-danger-700 border-danger-200';
      case 'IN PROGRESS': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'RESOLVED': return 'bg-success-50 text-success-700 border-success-200';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
            <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl mr-3 shadow-sm border border-primary-100">
              <ShieldAlert className="w-7 h-7" />
            </div>
            Grievance Redressal
          </h1>
          <p className="text-gray-600 mt-3 text-lg font-medium">Report campus issues, track resolution progress, and communicate directly with administration.</p>
        </div>
        <div className="w-full md:w-1/3 h-32 md:h-40 rounded-xl overflow-hidden shadow-md">
           <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" alt="Tech Support" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* The Composer */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900 mb-3">File a New Complaint</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  category === cat.id 
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <cat.icon className={`w-4 h-4 mr-2 ${category === cat.id ? 'text-white' : 'text-gray-400'}`} />
                {cat.id}
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleCreateComplaint} className="p-6">
          <div className="space-y-4">
            <div>
              <textarea 
                placeholder="Describe the issue in detail..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all resize-none min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative w-full">
                <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Exact Location (e.g. Lab 4, Block B)"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex-shrink-0">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  icon={Camera} 
                  className="w-full sm:w-auto"
                  onClick={() => fileInputRef.current.click()}
                >
                  Attach Evidence
                </Button>
              </div>
            </div>
            
            {/* Image Preview */}
            {previewUrl && (
              <div className="relative mt-4 inline-block">
                <img src={previewUrl} alt="Preview" className="h-32 rounded-xl object-cover border border-gray-200 shadow-sm" />
                <button 
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white p-1 rounded-full hover:bg-danger-500 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
            <Button type="submit" variant="primary" icon={Send}>Submit Complaint</Button>
          </div>
        </form>
      </div>

      {/* The Conversation Feed */}
      <div className="space-y-6">
        {complaints.map(complaint => (
          <div key={complaint.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              
              {/* Complaint Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <img src={complaint.author.avatar} alt={complaint.author.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h3 className="font-bold text-gray-900">{complaint.author.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3 mr-1" /> {complaint.timestamp}
                      <span className="mx-2">•</span>
                      <Building className="w-3 h-3 mr-1" /> {complaint.location}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{complaint.category}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center shadow-sm ${getStatusColor(complaint.status)}`}>
                    {complaint.status === 'RESOLVED' ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <Clock className="w-3.5 h-3.5 mr-1" />}
                    Status: {complaint.status}
                  </div>
                </div>
              </div>

              {/* Complaint Content */}
              <p className="text-gray-800 leading-relaxed mb-4">{complaint.description}</p>
              
              {complaint.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={complaint.image} alt="Attachment" className="w-full max-h-96 object-cover" />
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex gap-4 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => setReplyingTo(replyingTo === complaint.id ? null : complaint.id)}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors bg-gray-50 hover:bg-primary-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-primary-100"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> 
                  {complaint.replies.length > 0 ? `View ${complaint.replies.length} Updates` : 'Add Comment'}
                </button>
              </div>

            </div>

            {/* Conversation Thread (Replies) */}
            {(complaint.replies.length > 0 || replyingTo === complaint.id) && (
              <div className="bg-gray-50/80 p-6 border-t border-gray-100">
                
                {/* Existing Replies */}
                {complaint.replies.length > 0 && (
                  <div className="space-y-5 mb-6">
                    {complaint.replies.map(reply => (
                      <div key={reply.id} className="flex gap-3">
                        <img src={reply.avatar} alt={reply.author} className="w-8 h-8 rounded-full object-cover border border-gray-200 mt-1" />
                        <div className={`flex-1 p-4 rounded-2xl rounded-tl-none border shadow-sm ${
                          reply.isAdmin ? 'bg-primary-50 border-primary-100' : 'bg-white border-gray-100'
                        }`}>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className={`font-bold text-sm flex items-center ${reply.isAdmin ? 'text-primary-900' : 'text-gray-900'}`}>
                              {reply.author}
                              {reply.isAdmin && <CheckCircle2 className="w-4 h-4 ml-1.5 text-primary-500" />}
                            </span>
                            <span className={`text-xs ${reply.isAdmin ? 'text-primary-600' : 'text-gray-400'}`}>{reply.timestamp}</span>
                          </div>
                          <p className={`text-sm leading-relaxed ${reply.isAdmin ? 'text-primary-800' : 'text-gray-700'}`}>{reply.text}</p>
                          
                          {/* Optional Image inside a reply */}
                          {reply.image && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-black/5 shadow-sm max-w-sm">
                              <img src={reply.image} alt="Reply Attachment" className="w-full h-auto object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Box */}
                {replyingTo === complaint.id && (
                  <div className="flex gap-3">
                    <img src="https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff" alt="You" className="w-8 h-8 rounded-full border border-gray-200 mt-1" />
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add a comment or follow-up..."
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(complaint.id)}
                        autoFocus
                      />
                      <Button variant="primary" size="small" className="flex-shrink-0" onClick={() => handleReplySubmit(complaint.id)}>
                        Send
                      </Button>
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsPage;
