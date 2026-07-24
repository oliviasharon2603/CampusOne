import { useState, useEffect } from 'react';
import { Coffee, Search, Clock } from 'lucide-react';

const CanteenPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/canteen');
        const data = await res.json();
        if (data.success) {
          // Backend returns array of { category, items }
          setMenuData(data.data);
        }
      } catch (err) {
        console.error('Error fetching canteen menu:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = ['All', ...menuData.map(c => c.category)];

  // Filter logic applies across all categories now
  const filteredData = menuData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
            <div className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 p-2.5 rounded-xl mr-3 shadow-sm border border-primary-100 dark:border-primary-800">
              <Coffee className="w-7 h-7" />
            </div>
            Campus Canteen Menu
          </h1>
          <p className="text-gray-500 dark:text-slate-300 mt-3 text-lg">Delicious, affordable meals prepared fresh daily. Browse our full menu below.</p>
        </div>
      </div>

      {/* Menu Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-300 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search for any dish..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Items List - Continuous Flow */}
        <div className="p-4 sm:p-6 space-y-10">
          {filteredData.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-slate-300">
              No items found matching "{searchQuery}"
            </div>
          ) : (
            filteredData.map(category => (
              <div key={category.category} className="space-y-4">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-extrabold text-xl sm:text-2xl border-b-2 border-gray-100 dark:border-slate-700/50 pb-2 mb-4">
                  {category.category}
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {category.items.map(item => (
                    <div 
                      key={item.id} 
                      className="flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-3 sm:p-4 items-center hover:shadow-md hover:border-primary-100 dark:border-primary-800 transition-all gap-4"
                    >
                      {/* Properly Placed Fixed-Size Photo */}
                      <img 
                        src={item.image || item.image_url} 
                        alt={item.name} 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0 shadow-sm border border-gray-50 bg-gray-100 dark:bg-slate-700" 
                      />

                      {/* Dish Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate" title={item.name}>{item.name}</h3>
                          <span className={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border w-fit ${
                            item.is_veg ? 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 border-success-200' : 'bg-danger-50 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 border-danger-200 dark:border-danger-700'
                          }`}>
                            {item.is_veg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-300 mt-1 line-clamp-2">
                          {item.description || 'Delicious freshly prepared meal.'}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-right pl-2 sm:pl-4">
                        <p className="font-extrabold text-lg sm:text-2xl text-primary-600 dark:text-primary-400">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CanteenPage;
