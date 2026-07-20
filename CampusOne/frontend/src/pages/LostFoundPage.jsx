import { useState, useRef } from 'react';
import { Search, Image as ImageIcon, Send, MessageSquare, AlertTriangle, CheckCircle2, X, MapPin, Clock, Camera } from 'lucide-react';
import Button from '../components/ui/Button';

// Mock Data for the Feed
const INITIAL_POSTS = [
  {
    id: 1,
    type: 'FOUND',
    author: { name: 'Rahul Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    timestamp: '2 hours ago',
    location: 'Near Main Library Entrance',
    description: 'Found a blue Milton water bottle on the bench outside the library. I handed it over to the library front desk security guard.',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80', // water bottle
    replies: [
      { id: 101, author: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', text: 'That looks like Amit\'s bottle. Let me text him.', timestamp: '1 hour ago' },
      { id: 102, author: 'Amit Kumar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', text: 'Yes, that is mine! I have a matching one here is a pic.', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80', timestamp: '45 mins ago' }
    ]
  },
  {
    id: 2,
    type: 'LOST',
    author: { name: 'Sneha Reddy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
    timestamp: '5 hours ago',
    location: 'CSE Block / Lab 3',
    description: 'I lost my boAt wireless earbuds (black case) somewhere between the CSE block and the cafeteria around 11 AM today. Please let me know if anyone finds them!',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80', // earbuds
    replies: []
  },
  {
    id: 3,
    type: 'FOUND',
    author: { name: 'Campus Security', avatar: 'https://ui-avatars.com/api/?name=Campus+Security&background=0D8ABC&color=fff' },
    timestamp: '1 day ago',
    location: 'Main Gate Security Office',
    description: 'A set of bike keys (Yamaha) with a red keychain was found in the parking lot. Claim it at the main gate security office with valid ID.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80', // keys
    replies: [
      { id: 103, author: 'Karthik R.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', text: 'Are there 3 keys on the ring?', timestamp: '20 hours ago' }
    ]
  }
];

const LostFoundPage = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  
  // Composer State
  const [postType, setPostType] = useState('LOST');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Reply State (tracks which post has the reply box open, and the text)
  const [replyingTo, setReplyingTo] = useState(null); // Post ID
  const [replyText, setReplyText] = useState('');

  // Handle local image upload via file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create a local object URL to preview the image instantly without a backend
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newPost = {
      id: Date.now(),
      type: postType,
      author: { name: 'You (Current User)', avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff' },
      timestamp: 'Just now',
      location: location || 'Campus',
      description: description,
      image: previewUrl, // This points to the local blob URL
      replies: []
    };

    setPosts([newPost, ...posts]);
    
    // Reset form
    setDescription('');
    setLocation('');
    clearImage();
  };

  const handleReplySubmit = (postId) => {
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Date.now(),
      author: 'You (Current User)',
      avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff',
      text: replyText,
      timestamp: 'Just now'
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    }));

    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
            <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl mr-3 shadow-sm border border-primary-100">
              <Search className="w-7 h-7" />
            </div>
            Lost & Found
          </h1>
          <p className="text-gray-500 mt-3 text-lg">Report lost items or post things you've found on campus. Help your fellow students recover their belongings!</p>
        </div>
      </div>

      {/* The Composer */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Create a New Post</h2>
          
          {/* Post Type Toggle */}
          <div className="flex bg-white rounded-lg border border-gray-200 shadow-sm p-1">
            <button
              onClick={() => setPostType('LOST')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                postType === 'LOST' ? 'bg-danger-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              I Lost Something
            </button>
            <button
              onClick={() => setPostType('FOUND')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                postType === 'FOUND' ? 'bg-success-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              I Found Something
            </button>
          </div>
        </div>
        
        <form onSubmit={handleCreatePost} className="p-6">
          <div className="space-y-4">
            <div>
              <textarea 
                placeholder={`Describe what you ${postType === 'LOST' ? 'lost' : 'found'}...`}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all resize-none min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 relative w-full">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={`Where was it ${postType === 'LOST' ? 'last seen' : 'found'}?`}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  Attach Photo
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
            <Button type="submit" variant="primary" icon={Send}>Post to Feed</Button>
          </div>
        </form>
      </div>

      {/* The Conversation Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3 mr-1" /> {post.timestamp}
                      <span className="mx-2">•</span>
                      <MapPin className="w-3 h-3 mr-1" /> {post.location}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center ${
                  post.type === 'LOST' ? 'bg-danger-50 text-danger-600 border border-danger-100' : 'bg-success-50 text-success-600 border border-success-100'
                }`}>
                  {post.type === 'LOST' ? <AlertTriangle className="w-3.5 h-3.5 mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                  {post.type}
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 leading-relaxed mb-4">{post.description}</p>
              
              {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                  <img src={post.image} alt="Attachment" className="w-full max-h-96 object-cover" />
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex gap-4 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors bg-gray-50 hover:bg-primary-50 px-3 py-1.5 rounded-lg"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> 
                  {post.replies.length > 0 ? `${post.replies.length} Replies` : 'Reply'}
                </button>
              </div>

            </div>

            {/* Conversation Thread (Replies) */}
            {(post.replies.length > 0 || replyingTo === post.id) && (
              <div className="bg-gray-50/80 p-6 border-t border-gray-100">
                
                {/* Existing Replies */}
                {post.replies.length > 0 && (
                  <div className="space-y-5 mb-6">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="flex gap-3">
                        <img src={reply.avatar} alt={reply.author} className="w-8 h-8 rounded-full object-cover border border-gray-200 mt-1" />
                        <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-bold text-gray-900 text-sm">{reply.author}</span>
                            <span className="text-xs text-gray-400">{reply.timestamp}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.text}</p>
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
                {replyingTo === post.id && (
                  <div className="flex gap-3">
                    <img src="https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff" alt="You" className="w-8 h-8 rounded-full border border-gray-200 mt-1" />
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Write a reply..."
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(post.id)}
                        autoFocus
                      />
                      <Button variant="primary" size="small" className="flex-shrink-0" onClick={() => handleReplySubmit(post.id)}>
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

export default LostFoundPage;
