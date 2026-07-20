import { useState } from 'react';
import { Coffee, Search, Clock } from 'lucide-react';

// Unsplash images for the food
const MENU_DATA = [
  {
    category: 'Starters',
    items: [
      { id: 's1', name: 'Paneer Tikka', price: 120, time: '11:00 AM - 9:00 PM', type: 'Veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 's2', name: 'Veg Spring Roll', price: 80, time: '11:00 AM - 9:00 PM', type: 'Veg', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 's3', name: 'Chicken 65', price: 140, time: '12:00 PM - 9:00 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 's4', name: 'Fish Fingers', price: 145, time: '12:00 PM - 9:00 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=200&h=200' }
    ]
  },
  {
    category: 'Beverages',
    items: [
      { id: 'bv1', name: 'Filter Coffee', price: 30, time: 'All Day', type: 'Veg', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'bv2', name: 'Masala Chai', price: 20, time: 'All Day', type: 'Veg', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'bv3', name: 'Hot Chicken Soup', price: 60, time: '4:00 PM - 9:00 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'bv4', name: 'Mutton Bone Broth', price: 80, time: '4:00 PM - 9:00 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=200&h=200' }
    ]
  },
  {
    category: 'Fresh Juices',
    items: [
      { id: 'fj1', name: 'Fresh Orange Juice', price: 50, time: 'All Day', type: 'Veg', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'fj2', name: 'Watermelon Cooler', price: 40, time: 'All Day', type: 'Veg', image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'fj3', name: 'Raw Egg Protein Shake', price: 80, time: '6:00 AM - 10:00 AM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'fj4', name: 'Whey Isolate Milkshake', price: 100, time: 'All Day', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&q=80&w=200&h=200' }
    ]
  },
  {
    category: 'Breakfast',
    items: [
      { id: 'b1', name: 'Masala Dosa', price: 60, time: '7:30 AM - 11:00 AM', type: 'Veg', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'b2', name: 'Poha & Jalebi', price: 40, time: '7:30 AM - 11:00 AM', type: 'Veg', image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'b3', name: 'Egg Kheema Pav', price: 80, time: '7:30 AM - 11:00 AM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'b4', name: 'Chicken Sausage Omelette', price: 90, time: '7:30 AM - 11:00 AM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=200&h=200' }
    ]
  },
  {
    category: 'Main Course',
    items: [
      { id: 'm1', name: 'Veg Dum Biryani', price: 130, time: '12:30 PM - 3:30 PM', type: 'Veg', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'm2', name: 'Dal Makhani & Naan', price: 140, time: '12:30 PM - 3:30 PM', type: 'Veg', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'm3', name: 'Chicken Biryani', price: 140, time: '12:30 PM - 3:30 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'm4', name: 'Butter Chicken & Roti', price: 149, time: '12:30 PM - 3:30 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200&h=200' }
    ]
  },
  {
    category: 'Snacks',
    items: [
      { id: 'sn1', name: 'Samosa Chat', price: 45, time: '3:30 PM - 7:00 PM', type: 'Veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'sn2', name: 'Peri Peri French Fries', price: 60, time: '3:30 PM - 7:00 PM', type: 'Veg', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'sn3', name: 'Chicken Nuggets (6 pcs)', price: 90, time: '3:30 PM - 7:00 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=200&h=200' },
      { id: 'sn4', name: 'Egg Puff', price: 35, time: '3:30 PM - 7:00 PM', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&q=80&w=200&h=200' }
    ]
  }
];

const CanteenPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic applies across all categories now
  const filteredData = MENU_DATA.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
            <div className="bg-primary-50 text-primary-600 p-2.5 rounded-xl mr-3 shadow-sm border border-primary-100">
              <Coffee className="w-7 h-7" />
            </div>
            Campus Canteen Menu
          </h1>
          <p className="text-gray-500 mt-3 text-lg">Delicious, affordable meals prepared fresh daily. Browse our full menu below.</p>
        </div>
      </div>

      {/* Menu Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search for any dish..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Items List - Continuous Flow */}
        <div className="p-4 sm:p-6 space-y-10">
          {filteredData.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No items found matching "{searchQuery}"
            </div>
          ) : (
            filteredData.map(category => (
              <div key={category.category} className="space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-extrabold text-xl sm:text-2xl border-b-2 border-gray-100 pb-2 mb-4">
                  {category.category}
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {category.items.map(item => (
                    <div 
                      key={item.id} 
                      className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 items-center hover:shadow-md hover:border-primary-100 transition-all gap-4"
                    >
                      {/* Properly Placed Fixed-Size Photo */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0 shadow-sm border border-gray-50 bg-gray-100" 
                      />

                      {/* Dish Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate" title={item.name}>{item.name}</h3>
                          <span className={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border w-fit ${
                            item.type === 'Veg' ? 'bg-success-50 text-success-700 border-success-200' : 'bg-danger-50 text-danger-700 border-danger-200'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-right pl-2 sm:pl-4">
                        <p className="font-extrabold text-lg sm:text-2xl text-primary-600">₹{item.price}</p>
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
