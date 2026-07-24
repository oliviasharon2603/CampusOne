import { useState, useEffect } from 'react';
import { Search, Filter, Book, BookOpen, Star, X, Info, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useUserActivity } from '../context/UserActivityContext';

const RECOMMENDED = [
  { id: 7, title: 'Artificial Intelligence: A Modern Approach', reason: 'Matches your interest in AI&DS', difficulty: 'Advanced', time: '14 hrs', image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400' }
];

const LibraryPage = () => {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isAISearching, setIsAISearching] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const { borrowBook, dbUserId, userName } = useUserActivity();

  // Fetch wishlist
  useEffect(() => {
    if (!dbUserId) return;
    fetch(`http://localhost:5000/api/v1/library/wishlist?userId=${dbUserId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setWishlistIds(data.data);
      });
  }, [dbUserId]);

  // Fetch books from real backend
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/library/books');
      const data = await res.json();
      if (data.success) {
        setBooks(data.data.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          dept: b.category || 'General',
          available: b.available > 0,
          availabilityText: `${b.available} / ${b.total} Copies Available`,
          cover: 'bg-primary-100 text-primary-600',
          image: b.cover,
          rack: b.rack,
          available_copies: b.available
        })));
      }
    } catch (error) {
      console.error('Failed to fetch books', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Restore all books if search is cleared
  useEffect(() => {
    if (search === '') {
      fetchBooks();
    }
  }, [search]);

  const [borrowHistory, setBorrowHistory] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);

  useEffect(() => {
    if (!dbUserId) return;
    fetch(`http://localhost:5000/api/v1/library/borrow-history?userId=${dbUserId}`)
      .then(res => res.json())
      .then(data => { if (data.success) setBorrowHistory(data.data); });
    
    fetch(`http://localhost:5000/api/v1/library/requests?userId=${dbUserId}`)
      .then(res => res.json())
      .then(data => { if (data.success) setBookRequests(data.data); });
  }, [dbUserId]);

  // Filter books based on search input and active filter
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                          book.author.toLowerCase().includes(search.toLowerCase()) ||
                          book.dept.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'Available') return book.available;
    if (activeFilter === 'Unavailable') return !book.available;
    if (activeFilter === 'CS') return book.dept === 'Computer Science';
    if (activeFilter === 'AI&DS') return book.dept === 'AI&DS';
    
    return true; // 'All'
  });

  const handleBorrowClick = () => {
    if (!dbUserId) {
      setToast('Please log in first to borrow a book.');
      setTimeout(() => setToast(null), 4000);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleWishlistClick = async () => {
    if (!dbUserId) {
      setToast('Please log in first to use the wishlist.');
      setTimeout(() => setToast(null), 4000);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/v1/library/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: selectedBook.id, userId: dbUserId })
      });
      const result = await response.json();
      if (result.success) {
        if (result.action === 'added') {
          setWishlistIds(prev => [...prev, selectedBook.id]);
          setToast(`${selectedBook.title} has been added to your Wishlist!`);
        } else {
          setWishlistIds(prev => prev.filter(id => id !== selectedBook.id));
          setToast(`${selectedBook.title} removed from Wishlist.`);
        }
      }
    } catch(err) {
      setToast('Failed to update wishlist.');
    }
    setTimeout(() => setToast(null), 4000);
  };

  const handleRemoveHistory = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/v1/library/borrow-history/${id}`, { method: 'DELETE' });
      setBorrowHistory(prev => prev.filter(item => item.id !== id));
      setToast('Removed from borrow history.');
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast('Failed to remove item.');
    }
  };

  const handleRemoveRequest = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/v1/library/requests/${id}`, { method: 'DELETE' });
      setBookRequests(prev => prev.filter(item => item.id !== id));
      setToast('Book request cancelled.');
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast('Failed to cancel request.');
    }
  };

  const handleAISearch = async () => {
    if (!search) {
      setToast('Please enter a search query for AI Search.');
      setTimeout(() => setToast(null), 4000);
      return;
    }
    setIsAISearching(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/library/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: search })
      });
      const result = await response.json();
      if (result.success) {
        setBooks(result.data.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          dept: b.category || 'General',
          available: b.available > 0,
          availabilityText: `${b.available} / ${b.total} Copies Available`,
          cover: 'bg-primary-100 text-primary-600',
          image: b.cover,
          rack: b.rack
        })));
        setToast('AI Search completed successfully.');
      }
    } catch (err) {
      setToast('AI Search failed.');
    }
    setIsAISearching(false);
    setTimeout(() => setToast(null), 4000);
  };

  const confirmBorrow = async () => {
    const isRequest = !selectedBook.available;
    
    if (!isRequest) {
      try {
        // Send request to real backend to reduce available copies
        const response = await fetch('http://localhost:5000/api/v1/library/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId: selectedBook.id, userId: dbUserId, name: userName })
        });
        const result = await response.json();

        if (result.success) {
          // Update book status locally
          const updatedAvailable = selectedBook.available_copies - 1;
          const stillAvailable = updatedAvailable > 0;

          setBooks(prevBooks => 
            prevBooks.map(b => b.id === selectedBook.id ? { ...b, available_copies: updatedAvailable, available: stillAvailable } : b)
          );
          setSelectedBook(prev => ({ ...prev, available_copies: updatedAvailable, available: stillAvailable }));
          
          borrowBook(selectedBook.id);
          
          // Immediately update borrow history
          setBorrowHistory(prev => [{
            id: Date.now(), // temporary ID until refetch
            book_title: selectedBook.title,
            book_cover: selectedBook.image,
            status: 'borrowed',
            borrowed_at: new Date().toISOString()
          }, ...prev]);

          setToast(`You have successfully borrowed ${selectedBook.title}. Please pick it up from rack ${selectedBook.rack}.`);
        } else {
          setToast(result.message || 'Failed to borrow book.');
        }
      } catch (error) {
        setToast('Network error while requesting the book.');
      }
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/v1/library/book-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId: selectedBook.id, userId: dbUserId })
        });
        const result = await response.json();
        
        if (result.success) {
          // Immediately update requests list
          setBookRequests(prev => [{
            id: Date.now(),
            book_title: selectedBook.title,
            book_cover: selectedBook.image,
            status: 'pending',
            requested_at: new Date().toISOString()
          }, ...prev]);
          
          setToast('Your request has been submitted successfully. The requested book is expected within 6 working days.');
        } else {
          setToast('Failed to request book.');
        }
      } catch (error) {
        setToast('Network error while submitting request.');
      }
    }
    
    setShowConfirmModal(false);
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-top fade-in duration-300">
          <div className="bg-white border border-accent-200 shadow-lg rounded-lg p-4 flex items-start space-x-3 max-w-sm">
            <CheckCircle2 className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-800">{toast}</p>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-primary-600" />
            AI Smart Library
          </h1>
          <p className="text-gray-500 mt-1">Discover, borrow, and explore academic resources powered by AI.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search books, authors, or subjects..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="whitespace-nowrap" onClick={() => setShowWishlist(true)}>
            <Star className="w-4 h-4 mr-1 inline-block" /> Wishlist ({wishlistIds.length})
          </Button>
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-gray-700"
          >
            <option value="All">All Books</option>
            <option value="Available">Available Now</option>
            <option value="Unavailable">Requested/Unavailable</option>
            <option value="CS">Computer Science</option>
            <option value="AI&DS">AI & Data Science</option>
          </select>
          <Button variant="primary" className="whitespace-nowrap" onClick={handleAISearch} disabled={isAISearching}>
            {isAISearching ? 'Searching...' : 'AI Search'}
          </Button>
        </div>
      </div>

      {/* AI Recommendations (Hide when searching) */}
      {!search && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-warning-500 fill-current" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOMMENDED.map(book => (
              <div key={book.id} className="bg-gradient-to-r from-secondary-50 to-white rounded-xl shadow-sm border border-secondary-100 p-5 flex items-start space-x-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedBook(book)}>
                <div className="w-16 h-24 bg-secondary-200 rounded flex-shrink-0 flex items-center justify-center text-secondary-600 overflow-hidden relative">
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <Book className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{book.title}</h3>
                  <p className="text-sm text-secondary-700 mt-1 font-medium">{book.reason}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    <span className="bg-white px-2 py-1 rounded border border-gray-100">Level: {book.difficulty}</span>
                    <span className="bg-white px-2 py-1 rounded border border-gray-100">{book.time} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {search ? `Search Results (${filteredBooks.length})` : 'Library Catalog'}
        </h2>
        
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No books found matching your search.</h3>
            <p className="text-gray-500 mt-1">Try adjusting your keywords or use the AI Search.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearch('')}>Clear Search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className={`h-40 ${book.cover} flex items-center justify-center overflow-hidden relative`}>
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <Book className="w-12 h-12 opacity-50" />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-full">{book.dept}</span>
                    {book.available ? (
                      <span className="flex items-center text-xs font-medium text-accent-600"><span className="w-2 h-2 rounded-full bg-accent-500 mr-1"></span>Available</span>
                    ) : (
                      <span className="flex items-center text-xs font-medium text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>Issued</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors" title={book.title}>{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{book.author}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400 font-mono">Rack: {book.rack}</span>
                    <Button size="small" variant={book.available ? 'primary' : 'outline'} onClick={() => setSelectedBook(book)}>
                      {book.available ? 'Borrow' : 'Details'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Borrow History and Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Borrow History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
            My Borrow History
          </h2>
          <div className="space-y-4">
            {borrowHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">No borrow history found.</p>
            ) : (
              borrowHistory.map(history => (
                <div key={history.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden">
                      {history.book_cover ? <img src={history.book_cover} className="w-full h-full object-cover" /> : <Book className="w-5 h-5 m-2 text-gray-400" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{history.book_title}</h4>
                      <p className="text-xs text-gray-500">Borrowed: {new Date(history.borrowed_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${history.status === 'returned' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>
                      {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                    </span>
                    <button onClick={() => handleRemoveHistory(history.id)} className="text-gray-400 hover:text-danger-500 transition-colors" title="Remove">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Book Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Book className="w-5 h-5 mr-2 text-primary-600" />
            My Book Requests
          </h2>
          <div className="space-y-4">
            {bookRequests.length === 0 ? (
              <p className="text-gray-500 text-sm">No active requests.</p>
            ) : (
              bookRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden">
                      {req.book_cover ? <img src={req.book_cover} className="w-full h-full object-cover" /> : <Book className="w-5 h-5 m-2 text-gray-400" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{req.book_title}</h4>
                      <p className="text-xs text-gray-500">Requested: {new Date(req.requested_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      req.status === 'pending' ? 'bg-warning-50 text-warning-700' :
                      req.status === 'available' ? 'bg-success-50 text-success-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                    <button onClick={() => handleRemoveRequest(req.id)} className="text-gray-400 hover:text-danger-500 transition-colors" title="Cancel Request">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Book Details Drawer (Desktop/Tablet) */}
      {selectedBook && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          {/* Glassmorphism Background Overlay */}
          <div className="absolute inset-0 bg-primary-900/10 backdrop-blur-[2px] transition-opacity" onClick={() => setSelectedBook(null)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Book Details</h2>
                <button onClick={() => setSelectedBook(null)} className="text-gray-400 hover:text-gray-500 focus:outline-none bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className={`w-full h-64 ${selectedBook.cover || 'bg-primary-50 text-primary-300'} rounded-xl mb-6 flex items-center justify-center overflow-hidden relative shadow-inner`}>
                  {selectedBook.image ? (
                    <img src={selectedBook.image} alt={selectedBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <Book className="w-20 h-20 opacity-50" />
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-full">{selectedBook.dept}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedBook.title}</h3>
                <p className="text-lg text-gray-600 mt-1">{selectedBook.author}</p>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl flex items-start space-x-3">
                    <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      This is an essential text covering fundamental concepts. It is highly recommended for current semester coursework.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Availability</p>
                      <p className={`font-medium mt-1 ${selectedBook.available ? 'text-accent-600' : 'text-gray-900'}`}>
                        {selectedBook.available ? '3 Copies Available' : 'Currently Issued'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</p>
                      <p className="font-medium text-gray-900 mt-1 font-mono">{selectedBook.rack}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <Button 
                  className="flex-1" 
                  variant={selectedBook.available ? "primary" : "outline"} 
                  onClick={handleBorrowClick}
                  disabled={
                    borrowHistory.some(h => h.book_title === selectedBook.title && h.status === 'borrowed') ||
                    bookRequests.some(r => r.book_title === selectedBook.title && r.status === 'pending')
                  }
                >
                  {borrowHistory.some(h => h.book_title === selectedBook.title && h.status === 'borrowed') 
                    ? 'Borrowed' 
                    : bookRequests.some(r => r.book_title === selectedBook.title && r.status === 'pending') 
                      ? 'Requested'
                      : selectedBook.available ? 'Borrow Book' : 'Request Book'
                  }
                </Button>
                <Button className="flex-1" variant={wishlistIds.includes(selectedBook.id) ? "primary" : "outline"} onClick={handleWishlistClick}>
                  {wishlistIds.includes(selectedBook.id) ? 'In Wishlist' : 'Save to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary-900/10 backdrop-blur-[2px] transition-opacity" onClick={() => setShowConfirmModal(false)}></div>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {selectedBook?.available ? 'Confirm Borrowing' : 'Request Book'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {selectedBook?.available 
                  ? `Are you sure you want to borrow ${selectedBook?.title}? You will need to pick it up from rack ${selectedBook?.rack} within 24 hours.`
                  : `Are you sure you want to request ${selectedBook?.title}? You will be notified when the book is returned or procured.`
                }
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={confirmBorrow}>Confirm</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Side Drawer */}
      {showWishlist && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <div className="absolute inset-0 bg-primary-900/10 backdrop-blur-[2px] transition-opacity" onClick={() => setShowWishlist(false)} />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-warning-500 fill-current" /> My Wishlist
                </h2>
                <button onClick={() => setShowWishlist(false)} className="text-gray-400 hover:text-gray-500 bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlistIds.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">Your wishlist is empty.</p>
                ) : (
                  books.filter(b => wishlistIds.includes(b.id)).map(book => (
                    <div key={book.id} className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:shadow-sm cursor-pointer justify-between">
                      <div className="flex gap-4 flex-1" onClick={() => { setSelectedBook(book); setShowWishlist(false); }}>
                        <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          {book.image ? <img src={book.image} className="w-full h-full object-cover" /> : <Book className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1">{book.title}</h4>
                          <p className="text-sm text-gray-500">{book.author}</p>
                          <p className="text-xs text-primary-600 mt-2 font-mono">Rack: {book.rack}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          fetch('http://localhost:5000/api/v1/library/wishlist', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ bookId: book.id, userId: dbUserId })
                          }).then(res => res.json()).then(result => {
                            if (result.success && result.action === 'removed') {
                              setWishlistIds(prev => prev.filter(id => id !== book.id));
                            }
                          });
                        }} 
                        className="text-gray-400 hover:text-danger-500 transition-colors p-2" 
                        title="Remove from Wishlist"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LibraryPage;
