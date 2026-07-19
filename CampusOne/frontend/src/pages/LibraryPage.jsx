import { useState } from 'react';
import { Search, Filter, Book, BookOpen, Star, X, Info, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

// Mock Data
const INITIAL_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', dept: 'CSE', available: true, rack: 'A-12', cover: 'bg-primary-100 text-primary-600' },
  { id: 2, title: 'Deep Learning', author: 'Ian Goodfellow', dept: 'AI&DS', available: false, rack: 'B-04', cover: 'bg-secondary-100 text-secondary-600' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', dept: 'CSE', available: true, rack: 'A-15', cover: 'bg-accent-100 text-accent-600' },
  { id: 4, title: 'Design of Everyday Things', author: 'Don Norman', dept: 'IT', available: true, rack: 'C-01', cover: 'bg-gray-100 text-gray-600' },
  { id: 5, title: 'Python Crash Course', author: 'Eric Matthes', dept: 'CSE', available: true, rack: 'A-02', cover: 'bg-primary-100 text-primary-600' },
  { id: 6, title: 'Pattern Recognition and Machine Learning', author: 'Christopher M. Bishop', dept: 'AI&ML', available: true, rack: 'B-12', cover: 'bg-secondary-100 text-secondary-600' }
];

const RECOMMENDED = [
  { id: 7, title: 'Artificial Intelligence: A Modern Approach', reason: 'Matches your interest in AI&DS', difficulty: 'Advanced', time: '14 hrs' }
];

const LibraryPage = () => {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Filter books based on search input
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.dept.toLowerCase().includes(search.toLowerCase())
  );

  const handleBorrowClick = () => {
    setShowConfirmModal(true);
  };

  const handleWishlistClick = () => {
    setSelectedBook(null);
    setToast(`${selectedBook.title} has been added to your Wishlist!`);
    setTimeout(() => setToast(null), 4000);
  };

  const confirmBorrow = () => {
    // Update book status
    setBooks(prevBooks => 
      prevBooks.map(b => b.id === selectedBook.id ? { ...b, available: false } : b)
    );
    
    // Update selected book locally for the drawer
    setSelectedBook(prev => ({ ...prev, available: false }));
    
    setShowConfirmModal(false);
    
    // Show success toast
    setToast('Your request has been submitted successfully. The requested book is expected within 6 working days.');
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
          <Button variant="outline" icon={Filter} className="whitespace-nowrap">
            Filters
          </Button>
          <Button variant="primary" className="whitespace-nowrap">
            AI Search
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
                <div className="w-16 h-24 bg-secondary-200 rounded flex-shrink-0 flex items-center justify-center text-secondary-600">
                  <Book className="w-8 h-8" />
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
                <div className={`h-40 ${book.cover} flex items-center justify-center`}>
                  <Book className="w-12 h-12 opacity-50" />
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
                <div className={`w-full h-64 ${selectedBook.cover || 'bg-primary-50 text-primary-300'} rounded-xl mb-6 flex items-center justify-center`}>
                  <Book className="w-20 h-20 opacity-50" />
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
                <Button className="flex-1" variant="primary" disabled={!selectedBook.available} onClick={handleBorrowClick}>
                  {selectedBook.available ? 'Borrow Book' : 'Request Book'}
                </Button>
                <Button className="flex-1" variant="outline" onClick={handleWishlistClick}>Save to Wishlist</Button>
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Borrowing</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to borrow <strong>{selectedBook?.title}</strong>? You will need to pick it up from rack {selectedBook?.rack} within 24 hours.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={confirmBorrow}>Confirm</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LibraryPage;
