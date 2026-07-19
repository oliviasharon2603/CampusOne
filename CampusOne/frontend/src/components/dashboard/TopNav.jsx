import { Search, Bell, Menu } from 'lucide-react';

const TopNav = ({ toggleMobileMenu }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center flex-1">
        <button onClick={toggleMobileMenu} className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Global Search */}
        <div className="max-w-md w-full hidden sm:block relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
            placeholder="Search CampusOne..."
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:bg-gray-100 rounded-full transition-colors">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
          <Bell className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
            OL
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-700">Olivia</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
